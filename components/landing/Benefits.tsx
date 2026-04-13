'use client';

import { Upload, Globe2, Baby, Flame, IndianRupee, LayoutDashboard } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const BENEFITS = [
  { key: 'b1', icon: Upload,          color: 'text-green-600',  bg: 'bg-green-50' },
  { key: 'b2', icon: Globe2,          color: 'text-blue-600',   bg: 'bg-blue-50' },
  { key: 'b3', icon: Baby,            color: 'text-purple-600', bg: 'bg-purple-50' },
  { key: 'b4', icon: Flame,           color: 'text-orange-600', bg: 'bg-orange-50' },
  { key: 'b5', icon: IndianRupee,     color: 'text-emerald-600',bg: 'bg-emerald-50' },
  { key: 'b6', icon: LayoutDashboard, color: 'text-indigo-600', bg: 'bg-indigo-50' },
];

export default function Benefits() {
  const { t } = useI18n();

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">{t('benefits.title')}</h2>
          <p className="text-gray-500 text-lg">{t('benefits.sub')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map(({ key, icon: Icon, color, bg }) => (
            <div key={key} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t(`benefits.${key}.title`)}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{t(`benefits.${key}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
