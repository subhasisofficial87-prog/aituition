'use client';

import Link from 'next/link';
import { PlayCircle, BookOpen } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import type { DayEntry } from '@/types';

interface Props {
  planId: number | null;
  todayEntry: DayEntry | null;
  completedDays: number;
}

export default function TodaysLesson({ planId, todayEntry, completedDays }: Props) {
  const { t } = useI18n();

  if (!planId || !todayEntry) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-2">{t('dashboard.today')}</h3>
        <p className="text-gray-500 text-sm">{t('dashboard.no.plan')}</p>
        <Link
          href="/onboarding"
          className="inline-block mt-4 px-5 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm font-semibold rounded-lg"
        >
          {t('dashboard.create')}
        </Link>
      </div>
    );
  }

  const dayNum = todayEntry.day;

  return (
    <div className="bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
          <BookOpen className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white/80 text-xs font-medium uppercase tracking-wide mb-1">
            {t('dashboard.today')} · {t('study.day')} {dayNum}
          </p>
          <h3 className="text-xl font-bold leading-snug mb-1">{todayEntry.chapter}</h3>
          <p className="text-white/80 text-sm">{todayEntry.topic}</p>
        </div>
      </div>

      <Link
        href={`/study/${planId}/${dayNum}`}
        className="mt-5 flex items-center justify-center gap-2 w-full py-3 bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition-colors"
      >
        <PlayCircle className="w-5 h-5" />
        {t('dashboard.start')}
      </Link>
    </div>
  );
}
