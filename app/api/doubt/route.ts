import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { queryOne } from '@/lib/db';
import { buildSystemPrompt, claudeComplete } from '@/lib/claude';
import type { StudyPlan } from '@/types';

// POST /api/doubt
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);

    if (session.tier !== 'pro') {
      return NextResponse.json({ blocked: 'pro_only' }, { status: 402 });
    }

    const { planId, day, question } = await req.json();
    if (!question?.trim()) return NextResponse.json({ error: 'question required' }, { status: 400 });

    const plan = await queryOne<StudyPlan>(
      'SELECT * FROM study_plans WHERE id = ? AND user_id = ?',
      [planId, session.userId]
    );
    if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 });

    const systemPrompt = buildSystemPrompt(
      plan.board,
      plan.class_level,
      plan.language,
      plan.child_name
    );

    const context = day ? `The student is currently on Day ${day} of their study plan.` : '';
    const userPrompt = `${context}\n\nStudent's doubt: ${question}`;

    const answer = await claudeComplete(systemPrompt, userPrompt, 2048);

    return NextResponse.json({ answer });
  } catch (err: any) {
    if (err?.status === 401) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (err?.status === 402) return NextResponse.json({ blocked: 'pro_only' }, { status: 402 });
    console.error('[doubt]', err);
    return NextResponse.json({ error: 'common.error' }, { status: 500 });
  }
}
