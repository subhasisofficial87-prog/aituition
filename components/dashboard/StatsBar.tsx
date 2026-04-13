'use client';

import { Flame, TrendingUp, Clock, Target } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface Props {
  streak: number;
  progress: number;
  weeklyMins: number;
  avgScore: number;
}

export default function StatsBar({ streak, progress, weeklyMins, avgScore }: Props) {
  const { t } = useI18n();

  const stats = [
    {
      icon: Flame,
      value: streak,
      label: t('dashboard.streak'),
      color: 'text-orange-500',
      bg: 'bg-orange-50',
      suffix: '',
    },
    {
      icon: TrendingUp,
      value: Math.round(progress),
      label: t('dashboard.progress'),
      color: 'text-green-500',
      bg: 'bg-green-50',
      suffix: '%',
    },
    {
      icon: Clock,
      value: weeklyMins,
      label: t('dashboard.weekly'),
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      suffix: ` ${t('dashboard.mins')}`,
    },
    {
      icon: Target,
      value: Math.round(avgScore),
      label: t('dashboard.avg'),
      color: 'text-purple-500',
      bg: 'bg-purple-50',
      suffix: '%',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map(({ icon: Icon, value, label, color, bg, suffix }) => (
        <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">
            {value}{suffix}
          </p>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">{label}</p>
        </div>
      ))}
    </div>
  );
}
