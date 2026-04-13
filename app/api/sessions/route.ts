import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { queryOne, execute } from '@/lib/db';
import { buildSystemPrompt, buildQuizPrompt, claudeComplete, parseQuizJSON } from '@/lib/claude';
import type { StudyPlan, DailySession, DayEntry } from '@/types';

// GET /api/sessions?planId=X&day=N
export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const { searchParams } = req.nextUrl;
    const planId = searchParams.get('planId');
    const day    = Number(searchParams.get('day') ?? 1);

    if (!planId) return NextResponse.json({ error: 'planId required' }, { status: 400 });

    // Load plan
    const plan = await queryOne<StudyPlan>(
      'SELECT * FROM study_plans WHERE id = ? AND user_id = ?',
      [planId, session.userId]
    );
    if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 });

    // Trial gate
    const trialStart = new Date(plan.trial_start_date);
    const today      = new Date();
    const daysSince  = Math.floor((today.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSince > 7 && session.tier === 'free') {
      return NextResponse.json({ blocked: 'trial_expired' }, { status: 402 });
    }

    // Parse plan_data
    const planData: DayEntry[] = typeof plan.plan_data === 'string'
      ? JSON.parse(plan.plan_data as unknown as string)
      : plan.plan_data as unknown as DayEntry[];

    const dayEntry = planData.find((d) => d.day === day);
    if (!dayEntry) return NextResponse.json({ error: 'Day not found in plan' }, { status: 404 });

    // Check if session already exists
    const existing = await queryOne<DailySession>(
      'SELECT * FROM daily_sessions WHERE plan_id = ? AND day_number = ?',
      [planId, day]
    );

    if (existing && existing.lecture_content && existing.quiz_questions) {
      return NextResponse.json({
        session: {
          ...existing,
          quiz_questions: typeof existing.quiz_questions === 'string'
            ? JSON.parse(existing.quiz_questions)
            : existing.quiz_questions,
        },
        dayEntry,
      });
    }

    // Generate lecture + quiz
    const systemPrompt = buildSystemPrompt(
      plan.board,
      plan.class_level,
      plan.language,
      plan.child_name
    );

    const lecturePrompt = `Teach today's topic: "${dayEntry.topic}" from Chapter "${dayEntry.chapter}".
This is Day ${day} of the student's study plan.
Provide a complete 30-minute lecture covering this topic thoroughly.`;

    const lectureContent = await claudeComplete(systemPrompt, lecturePrompt, 8192);

    const quizSystemPrompt = 'You are a quiz generator. Return only valid JSON arrays, no markdown.';
    const quizRaw = await claudeComplete(
      quizSystemPrompt,
      buildQuizPrompt(dayEntry.topic, dayEntry.chapter, plan.board, plan.class_level, plan.language)
    );
    const quizQuestions = parseQuizJSON(quizRaw) ?? [];

    // Save or update session
    if (existing) {
      await execute(
        'UPDATE daily_sessions SET lecture_content = ?, quiz_questions = ? WHERE id = ?',
        [lectureContent, JSON.stringify(quizQuestions), existing.id]
      );
    } else {
      await execute(
        `INSERT INTO daily_sessions (plan_id, user_id, day_number, topic, lecture_content, quiz_questions)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [planId, session.userId, day, dayEntry.topic, lectureContent, JSON.stringify(quizQuestions)]
      );
    }

    return NextResponse.json({
      session: { lecture_content: lectureContent, quiz_questions: quizQuestions, completed: 0 },
      dayEntry,
    });
  } catch (err: any) {
    if (err?.status === 401) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    console.error('[sessions GET]', err);
    return NextResponse.json({ error: 'common.error' }, { status: 500 });
  }
}
