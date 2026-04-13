import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { queryOne } from '@/lib/db';
import type { StudyPlan } from '@/types';

export async function GET(req: NextRequest, { params }: { params: Promise<{ planId: string }> }) {
  try {
    const session = await requireAuth(req);
    const { planId } = await params;

    const plan = await queryOne<StudyPlan>(
      'SELECT * FROM study_plans WHERE id = ? AND user_id = ?',
      [planId, session.userId]
    );

    if (!plan) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Parse JSON fields
    if (typeof plan.chapters_json === 'string') plan.chapters_json = JSON.parse(plan.chapters_json);
    if (typeof plan.plan_data === 'string') plan.plan_data = JSON.parse(plan.plan_data as unknown as string);

    return NextResponse.json({ plan });
  } catch (err: any) {
    if (err?.status === 401) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    console.error('[plans/:id]', err);
    return NextResponse.json({ error: 'common.error' }, { status: 500 });
  }
}
