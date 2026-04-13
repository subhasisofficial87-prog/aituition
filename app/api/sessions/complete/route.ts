import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { queryOne, execute } from '@/lib/db';
import type { DailySession } from '@/types';

// POST /api/sessions/complete
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const { planId, day, answers } = await req.json();

    if (!planId || !day) return NextResponse.json({ error: 'planId and day required' }, { status: 400 });

    const ds = await queryOne<DailySession>(
      'SELECT * FROM daily_sessions WHERE plan_id = ? AND day_number = ? AND user_id = ?',
      [planId, day, session.userId]
    );
    if (!ds) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    // Score quiz
    const questions = typeof ds.quiz_questions === 'string'
      ? JSON.parse(ds.quiz_questions)
      : (ds.quiz_questions ?? []);

    let score = 0;
    const weakTopics: string[] = [];

    if (answers && Array.isArray(answers)) {
      answers.forEach((ans: string, idx: number) => {
        const q = questions[idx];
        if (!q) return;
        if (ans === q.answer) {
          score++;
        } else {
          weakTopics.push(ds.topic);
        }
      });
    }

    // Update session
    await execute(
      `UPDATE daily_sessions SET quiz_answers = ?, quiz_score = ?, completed = 1, completed_at = NOW()
       WHERE id = ?`,
      [JSON.stringify(answers ?? []), score, ds.id]
    );

    // Save quiz result
    await execute(
      `INSERT INTO quiz_results (session_id, user_id, plan_id, score, total, chapter, weak_topics)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE score = VALUES(score)`,
      [ds.id, session.userId, planId, score, questions.length, ds.topic, JSON.stringify([...new Set(weakTopics)])]
    );

    // Update streak
    const todayStr = new Date().toISOString().slice(0, 10);
    const progress = await queryOne<any>(
      'SELECT * FROM user_progress WHERE user_id = ?',
      [session.userId]
    );

    if (progress) {
      const lastDate   = progress.last_study_date;
      const yesterday  = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().slice(0, 10);

      let newStreak = progress.current_streak;
      if (lastDate === yStr) newStreak++;
      else if (lastDate !== todayStr) newStreak = 1;

      const totalSessions = progress.total_sessions + 1;
      const avgScore = progress.avg_quiz_score
        ? ((progress.avg_quiz_score * progress.total_sessions + (score / Math.max(questions.length, 1)) * 100) / totalSessions).toFixed(2)
        : ((score / Math.max(questions.length, 1)) * 100).toFixed(2);

      await execute(
        `UPDATE user_progress SET
           current_streak = ?, longest_streak = GREATEST(longest_streak, ?),
           total_sessions = ?, avg_quiz_score = ?, last_study_date = ?
         WHERE user_id = ?`,
        [newStreak, newStreak, totalSessions, avgScore, todayStr, session.userId]
      );
    }

    return NextResponse.json({ score, total: questions.length, weakTopics: [...new Set(weakTopics)] });
  } catch (err: any) {
    if (err?.status === 401) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    console.error('[sessions/complete]', err);
    return NextResponse.json({ error: 'common.error' }, { status: 500 });
  }
}
