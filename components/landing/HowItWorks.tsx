'use client';

import { MousePointerClick, BrainCircuit, Zap } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const STEPS = [
  { icon: MousePointerClick, color: 'bg-green-100 text-green-600', num: '1' },
  { icon: BrainCircuit,      color: 'bg-blue-100 text-blue-600',   num: '2' },
  { icon: Zap,               color: 'bg-purple-100 text-purple-600', num: '3' },
];

export default function HowItWorks() {
  const { t } = useI18n();

  return (
    <section id="how" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">{t('how.title')}</h2>
          <p className="text-gray-500 text-lg">{t('how.sub')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-green-300 to-blue-300 z-0" />

          {STEPS.map(({ icon: Icon, color, num }, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center">
              <div className={`w-20 h-20 rounded-2xl ${color} flex items-center justify-center mb-4 shadow-sm`}>
                <Icon className="w-9 h-9" />
              </div>
              <div className="absolute -top-2 -right-2 md:static md:hidden w-6 h-6 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {num}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t(`how.s${i + 1}.title`)}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {t(`how.s${i + 1}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
