import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { queryOne, query } from '@/lib/db';
import type { UserProgress, DashboardData } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);

    // User progress
    const progress = await queryOne<UserProgress>(
      'SELECT * FROM user_progress WHERE user_id = ?',
      [session.userId]
    );

    // Active plan
    const plan = await queryOne<any>(
      `SELECT sp.id, sp.board, sp.class_level, sp.subject, sp.child_name, sp.language,
              sp.plan_data, sp.trial_start_date, sp.status,
              u.subscription_tier
       FROM study_plans sp
       JOIN users u ON u.id = sp.user_id
       WHERE sp.user_id = ? AND sp.status = 'active'
       ORDER BY sp.created_at DESC LIMIT 1`,
      [session.userId]
    );

    // Recent quiz results
    const recentQuizzes = await query<any>(
      `SELECT qr.score, qr.total, qr.chapter, qr.taken_at
       FROM quiz_results qr
       WHERE qr.user_id = ?
       ORDER BY qr.taken_at DESC LIMIT 5`,
      [session.userId]
    );

    // Weak areas (lowest scoring chapters)
    const weakAreas = await query<any>(
      `SELECT chapter, AVG(score/total)*100 as avg_score, COUNT(*) as attempts
       FROM quiz_results
       WHERE user_id = ?
       GROUP BY chapter
       HAVING avg_score < 70
       ORDER BY avg_score ASC LIMIT 3`,
      [session.userId]
    );

    // Count completed sessions
    let completedDays = 0;
    let totalDays = 220;
    let todayEntry = null;

    if (plan) {
      const completed = await queryOne<{ cnt: number }>(
        'SELECT COUNT(*) as cnt FROM daily_sessions WHERE plan_id = ? AND completed = 1',
        [plan.id]
      );
      completedDays = completed?.cnt ?? 0;

      // Find today's entry
      const planData = typeof plan.plan_data === 'string' ? JSON.parse(plan.plan_data) : plan.plan_data;
      const todayStr = new Date().toISOString().slice(0, 10);
      todayEntry = planData?.find((d: any) => d.date === todayStr) ?? planData?.[completedDays] ?? planData?.[0];
      totalDays = planData?.length ?? 220;
    }

    const dashboard: DashboardData = {
      streak:        progress?.current_streak ?? 0,
      longestStreak: progress?.longest_streak ?? 0,
      totalSessions: progress?.total_sessions ?? 0,
      avgQuizScore:  progress?.avg_quiz_score ? Number(progress.avg_quiz_score) : 0,
      weeklyMins:    progress?.weekly_study_mins ?? 0,
      completedDays,
      totalDays,
      todayEntry,
      recentQuizzes,
      weakAreas,
      plan: plan ? { id: plan.id, childName: plan.child_name, board: plan.board, classLevel: plan.class_level, subject: plan.subject } : null,
      tier:          plan?.subscription_tier ?? session.tier ?? 'free',
      trialStart:    plan?.trial_start_date ?? null,
    };

    return NextResponse.json(dashboard);
  } catch (err: any) {
    if (err?.status === 401) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    console.error('[progress]', err);
    return NextResponse.json({ error: 'common.error' }, { status: 500 });
  }
}
