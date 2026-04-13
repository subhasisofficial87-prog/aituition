import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import type { SyllabusStructure } from '@/types';

/**
 * Map individual class level → group range stored in DB
 * e.g. '5' → 'Class 1-5', 'LKG' → 'LKG-UKG', '10' → 'Class 9-12'
 */
function classToGroup(cls: string): string {
  if (['LKG', 'UKG'].includes(cls))             return 'LKG-UKG';
  const n = Number(cls);
  if (n >= 1  && n <= 5)                         return 'Class 1-5';
  if (n >= 6  && n <= 8)                         return 'Class 6-8';
  if (n >= 9  && n <= 12)                        return 'Class 9-12';
  // Already a group range — pass through
  if (cls.startsWith('Class') || cls === 'LKG-UKG') return cls;
  return cls;
}

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    const { searchParams } = req.nextUrl;
    const board   = searchParams.get('board');
    const cls     = searchParams.get('class');
    const subject = searchParams.get('subject');

    if (!board) {
      return NextResponse.json({ error: 'board required' }, { status: 400 });
    }

    const classGroup = cls ? classToGroup(cls) : null;

    let sql = `SELECT id, board, class_level, subject, structure_name, chapters_json
               FROM syllabus_structures WHERE board = ?`;
    const params: string[] = [board];

    if (classGroup) {
      sql += ' AND class_level = ?';
      params.push(classGroup);
    }
    if (subject) {
      sql += ' AND subject = ?';
      params.push(subject);
    }

    sql += ' ORDER BY subject';

    const rows = await query<SyllabusStructure>(sql, params);

    const structures = rows.map((r) => ({
      ...r,
      chapters_json:
        typeof r.chapters_json === 'string'
          ? JSON.parse(r.chapters_json)
          : r.chapters_json,
    }));

    return NextResponse.json({ structures, classGroup });
  } catch (err: any) {
    if (err?.status === 401) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    console.error('[syllabus]', err);
    return NextResponse.json({ error: 'common.error' }, { status: 500 });
  }
}
