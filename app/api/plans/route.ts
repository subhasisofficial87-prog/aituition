import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { query, execute } from '@/lib/db';
import { buildStudyPlan } from '@/lib/plan-generator';
import type { StudyPlan } from '@/types';

// POST /api/plans — create a new study plan
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const { board, classLevel, subject, childName, language, chapters } = await req.json();

    if (!board || !classLevel || !subject || !childName || !chapters?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const today = new Date();
    const planData = buildStudyPlan(chapters as string[], today);
    const trialStart = today.toISOString().slice(0, 10);

    const result = await execute(
      `INSERT INTO study_plans
        (user_id, board, class_level, subject, child_name, language, chapters_json, plan_data, trial_start_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        session.userId,
        board,
        classLevel,
        subject,
        childName,
        language ?? 'en',
        JSON.stringify(chapters),
        JSON.stringify(planData),
        trialStart,
      ]
    );

    // Set trial_start_date on user if not already set
    await execute(
      `UPDATE users SET trial_start_date = COALESCE(trial_start_date, ?), trial_used = 1 WHERE id = ?`,
      [trialStart, session.userId]
    );

    return NextResponse.json({ planId: result.insertId }, { status: 201 });
  } catch (err: any) {
    if (err?.status === 401) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    console.error('[plans POST]', err);
    return NextResponse.json({ error: 'common.error' }, { status: 500 });
  }
}

// GET /api/plans — list user's plans
export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);

    const plans = await query<StudyPlan>(
      `SELECT id, board, class_level, subject, child_name, language, status, trial_start_date, created_at
       FROM study_plans WHERE user_id = ? ORDER BY created_at DESC`,
      [session.userId]
    );

    return NextResponse.json({ plans });
  } catch (err: any) {
    if (err?.status === 401) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    console.error('[plans GET]', err);
    return NextResponse.json({ error: 'common.error' }, { status: 500 });
  }
}
