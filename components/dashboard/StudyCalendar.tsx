'use client';

import { useI18n } from '@/lib/i18n';
import type { DayEntry } from '@/types';

interface Props {
  planData: DayEntry[];
  completedDays: number;
  planId: number;
}

export default function StudyCalendar({ planData, completedDays, planId }: Props) {
  const { t } = useI18n();
  const todayStr = new Date().toISOString().slice(0, 10);

  // Show first 60 days (2 months) to keep it compact
  const displayDays = planData.slice(0, 60);

  function getDayStatus(entry: DayEntry): 'completed' | 'today' | 'future' {
    if (entry.date < todayStr && entry.day <= completedDays) return 'completed';
    if (entry.date === todayStr) return 'today';
    return 'future';
  }

  const statusStyles = {
    completed: 'bg-green-400 text-white',
    today:     'bg-blue-500 text-white ring-2 ring-blue-300 ring-offset-1',
    future:    'bg-gray-100 text-gray-400',
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-900 mb-4">{t('dashboard.calendar')}</h3>
      <div className="grid grid-cols-10 gap-1">
        {displayDays.map((entry) => {
          const status = getDayStatus(entry);
          return (
            <a
              key={entry.day}
              href={status !== 'future' ? `/study/${planId}/${entry.day}` : undefined}
              title={`Day ${entry.day}: ${entry.topic}`}
              className={`w-full aspect-square rounded-md flex items-center justify-center text-xs font-bold transition-all ${statusStyles[status]} ${
                status !== 'future' ? 'hover:opacity-80 cursor-pointer' : 'cursor-default'
              }`}
            >
              {entry.day}
            </a>
          );
        })}
      </div>
      <div className="flex gap-4 mt-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-green-400 rounded-sm inline-block" /> {t('dashboard.completed')}</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-500 rounded-sm inline-block" /> Today</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-gray-100 rounded-sm inline-block border border-gray-200" /> Upcoming</span>
      </div>
    </div>
  );
}
