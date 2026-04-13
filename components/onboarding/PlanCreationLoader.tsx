'use client';

import { useEffect, useState } from 'react';
import { BrainCircuit } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const MESSAGES = [
  'Analysing your chapters...',
  'Distributing lessons over 10 months...',
  'Scheduling Mon–Fri lectures...',
  'Preparing your personalised plan...',
  'Almost ready!',
];

export default function PlanCreationLoader() {
  const { t } = useI18n();
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((i) => (i + 1 < MESSAGES.length ? i + 1 : i));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center animate-pulse">
          <BrainCircuit className="w-12 h-12 text-white" />
        </div>
        <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-green-300 border-t-transparent animate-spin" />
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">{t('onboarding.creating')}</h3>
      <p className="text-gray-500 text-sm mb-6">{t('onboarding.creating.sub')}</p>

      <div className="bg-gray-50 rounded-xl px-6 py-3 text-sm text-gray-600 font-medium animate-fade-in">
        {MESSAGES[msgIdx]}
      </div>
    </div>
  );
}
