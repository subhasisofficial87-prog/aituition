'use client';

import Link from 'next/link';
import { ArrowRight, PlayCircle, Star } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-blue-50 pt-8 pb-20">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white border border-green-200 rounded-full px-4 py-2 text-sm font-medium text-green-700 shadow-sm mb-6">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          {t('hero.badge')}
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          {t('hero.title')}
          <br />
          <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            AI Tuition
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          {t('hero.subtitle')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link
            href="/register"
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
          >
            {t('hero.cta')}
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#how"
            className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 hover:border-green-300 text-gray-700 font-semibold rounded-xl transition-all text-lg"
          >
            <PlayCircle className="w-5 h-5 text-green-500" />
            {t('hero.cta2')}
          </a>
        </div>

        {/* Social proof */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span>Trusted by 1000+ parents</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-green-500 font-semibold">✓</span>
            <span>CBSE · ICSE · Odia Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-blue-500 font-semibold">✓</span>
            <span>LKG to Class 12</span>
          </div>
        </div>
      </div>
    </section>
  );
}
