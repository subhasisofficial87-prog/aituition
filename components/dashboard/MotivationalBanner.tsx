'use client';

import { useI18n } from '@/lib/i18n';

interface Props {
  streak: number;
  progress: number;
  childName?: string;
}

export default function MotivationalBanner({ streak, progress, childName }: Props) {
  const { t } = useI18n();

  const idx = streak >= 7 ? 3 : streak >= 3 ? 0 : progress >= 50 ? 2 : 1;
  const message = t(`dashboard.motivation.${idx}`);

  const gradients = [
    'from-orange-400 to-pink-500',
    'from-blue-400 to-purple-500',
    'from-green-400 to-teal-500',
    'from-yellow-400 to-orange-500',
  ];

  return (
    <div className={`bg-gradient-to-r ${gradients[idx]} rounded-2xl px-6 py-4 text-white`}>
      <p className="font-bold text-lg">{message}</p>
      {childName && (
        <p className="text-white/80 text-sm mt-0.5">
          Keep up the great work, {childName}! 📖
        </p>
      )}
    </div>
  );
}
