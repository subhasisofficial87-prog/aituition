'use client';

import { ClipboardList } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface QuizResult {
  score: number;
  total: number;
  chapter: string;
  taken_at: string;
}

interface Props {
  quizzes: QuizResult[];
}

export default function RecentQuizzes({ quizzes }: Props) {
  const { t } = useI18n();

  function scoreColor(score: number, total: number) {
    const pct = (score / total) * 100;
    if (pct >= 80) return 'bg-green-100 text-green-700';
    if (pct >= 60) return 'bg-blue-100 text-blue-700';
    return 'bg-orange-100 text-orange-700';
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList className="w-4 h-4 text-blue-500" />
        <h3 className="font-bold text-gray-900">{t('dashboard.recent')}</h3>
      </div>

      {quizzes.length === 0 ? (
        <p className="text-sm text-gray-400 py-2">No quizzes yet — complete a lesson to get started!</p>
      ) : (
        <div className="space-y-2">
          {quizzes.map((qr, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-700 truncate pr-3">{qr.chapter}</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${scoreColor(qr.score, qr.total)}`}>
                {qr.score}/{qr.total}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
