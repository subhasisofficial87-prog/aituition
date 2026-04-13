'use client';

import { Target, Heart } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function AboutUs() {
  const { t } = useI18n();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">{t('about.title')}</h2>
          <p className="text-gray-600 text-lg leading-relaxed">{t('about.body')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t('about.aim.title')}</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">{t('about.aim.body')}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Our Values</h3>
            </div>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">✓</span> Every child deserves quality education</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">✓</span> Learning in your mother tongue matters</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">✓</span> Affordable does not mean low quality</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">✓</span> Consistency builds champions</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
