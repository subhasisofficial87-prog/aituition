'use client';

import { AlertTriangle } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface WeakArea {
  chapter: string;
  avg_score: number;
  attempts: number;
}

interface Props {
  areas: WeakArea[];
}

export default function WeakAreas({ areas }: Props) {
  const { t } = useI18n();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-4 h-4 text-orange-500" />
        <h3 className="font-bold text-gray-900">{t('dashboard.weak')}</h3>
      </div>

      {areas.length === 0 ? (
        <p className="text-sm text-gray-400 py-2">No weak areas yet — keep taking quizzes! 🎯</p>
      ) : (
        <div className="space-y-3">
          {areas.map((area, i) => (
            <div key={i}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-700 font-medium truncate pr-2">{area.chapter}</span>
                <span className="text-xs font-bold text-orange-600 shrink-0">{Math.round(area.avg_score)}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-400 rounded-full"
                  style={{ width: `${Math.round(area.avg_score)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
