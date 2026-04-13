import type { DayEntry } from '@/types';

/**
 * buildStudyPlan
 * --------------
 * Distributes chapters across 220 Mon–Fri lecture days over ~10 months.
 * Weekend days are marked as 'doubt' (Pro only) and not counted in 220.
 *
 * @param chapters  Array of chapter names
 * @param startDate Starting date (defaults to today)
 * @returns         Array of DayEntry objects (lecture days only, 220 items)
 */
export function buildStudyPlan(chapters: string[], startDate: Date = new Date()): DayEntry[] {
  if (!chapters.length) throw new Error('At least one chapter required');

  const TOTAL_DAYS = 220;
  const daysPerChapter = Math.ceil(TOTAL_DAYS / chapters.length);

  // Build chapter → topics mapping (split evenly)
  // For now, we assign lecture numbers within each chapter
  const plan: DayEntry[] = [];
  let lectureDay = 0;
  let calDate = new Date(startDate);
  calDate.setHours(0, 0, 0, 0);

  let chapterIdx = 0;
  let dayInChapter = 0;

  while (lectureDay < TOTAL_DAYS) {
    const dayOfWeek = calDate.getDay(); // 0=Sun, 6=Sat

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // Weekend — skip (doubt days are handled in study page)
      calDate = addDays(calDate, 1);
      continue;
    }

    // Lecture day
    const chapter = chapters[chapterIdx];
    dayInChapter++;

    plan.push({
      day: lectureDay + 1,
      date: formatDate(calDate),
      chapter,
      topic: `${chapter} — Part ${dayInChapter}`,
      type: 'lecture',
    });

    lectureDay++;
    calDate = addDays(calDate, 1);

    // Advance chapter
    if (dayInChapter >= daysPerChapter && chapterIdx < chapters.length - 1) {
      chapterIdx++;
      dayInChapter = 0;
    }
  }

  return plan;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * getDayEntry — Find today's (or a specific day's) entry in a plan
 */
export function getDayEntry(planData: DayEntry[], targetDate?: string): DayEntry | null {
  const dateStr = targetDate ?? formatDate(new Date());
  return planData.find((d) => d.date === dateStr) ?? null;
}

/**
 * getDayNumber — Return the sequential day number for today
 */
export function getTodayDayNumber(planData: DayEntry[]): number {
  const entry = getDayEntry(planData);
  return entry?.day ?? 1;
}
