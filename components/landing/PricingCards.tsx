'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

type BillingPeriod = 'monthly' | 'quarterly' | 'yearly';

const BASE_PRICES = {
  basic: { lkg: 149, '1-5': 199, '6-8': 249, '9-12-cbse': 299, '9-12-icse': 349 },
  pro:   { lkg: 249, '1-5': 349, '6-8': 449, '9-12-cbse': 549, '9-12-icse': 649 },
};

const BILLING: Record<BillingPeriod, { multiplier: number; save: number }> = {
  monthly:   { multiplier: 1,  save: 0  },
  quarterly: { multiplier: 3,  save: 10 },
  yearly:    { multiplier: 10, save: 17 },
};

const TIERS = [
  { key: 'lkg',     labelKey: 'pricing.tier.lkg'  },
  { key: '1-5',     labelKey: 'pricing.tier.15'   },
  { key: '6-8',     labelKey: 'pricing.tier.68'   },
  { key: '9-12-cbse', labelKey: 'pricing.tier.912' },
];

const FEATURES_BASIC = ['pricing.f1', 'pricing.f2', 'pricing.f3', 'pricing.f4', 'pricing.f6'];
const FEATURES_PRO   = ['pricing.f1', 'pricing.f2', 'pricing.f3', 'pricing.f4', 'pricing.f5', 'pricing.f6'];

export default function PricingCards() {
  const { t } = useI18n();
  const [billing, setBilling] = useState<BillingPeriod>('monthly');
  const [tierIdx, setTierIdx] = useState(2); // Default: Class 6-8

  const tier = TIERS[tierIdx];
  const { multiplier, save } = BILLING[billing];

  const basicPrice = Math.round(BASE_PRICES.basic[tier.key as keyof typeof BASE_PRICES.basic] * multiplier * 0.95);
  const proPrice   = Math.round(BASE_PRICES.pro[tier.key as keyof typeof BASE_PRICES.pro]   * multiplier * 0.95);

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">{t('pricing.title')}</h2>
          <p className="text-gray-500 text-lg">{t('pricing.sub')}</p>
        </div>

        {/* Class tier selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {TIERS.map((tr, i) => (
            <button
              key={tr.key}
              onClick={() => setTierIdx(i)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                tierIdx === i
                  ? 'bg-gray-900 text-white shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t(tr.labelKey)}
            </button>
          ))}
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-gray-100 p-1 rounded-xl gap-1">
            {(['monthly', 'quarterly', 'yearly'] as BillingPeriod[]).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  billing === b ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t(`pricing.${b}`)}
                {BILLING[b].save > 0 && (
                  <span className="ml-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                    {t('pricing.save')} {BILLING[b].save}%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Basic */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-green-300 transition-colors">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{t('pricing.basic')}</h3>
            <p className="text-gray-500 text-sm mb-6">{t('pricing.basic.desc')}</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-gray-900">₹{basicPrice.toLocaleString('en-IN')}</span>
              <span className="text-gray-500 ml-1">
                {billing === 'monthly' ? t('pricing.per.month') : `/${billing === 'quarterly' ? '3 months' : 'year'}`}
              </span>
            </div>
            <Link
              href="/register"
              className="block w-full py-3 text-center bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-colors mb-6"
            >
              {t('pricing.cta.basic')}
            </Link>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{t('pricing.includes')}</p>
            <ul className="space-y-2">
              {FEATURES_BASIC.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  {t(f)}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div className="relative bg-gradient-to-b from-green-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow">
                ⭐ {t('pricing.popular')}
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{t('pricing.pro')}</h3>
            <p className="text-white/80 text-sm mb-6">{t('pricing.pro.desc')}</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">₹{proPrice.toLocaleString('en-IN')}</span>
              <span className="text-white/70 ml-1">
                {billing === 'monthly' ? t('pricing.per.month') : `/${billing === 'quarterly' ? '3 months' : 'year'}`}
              </span>
            </div>
            <Link
              href="/register"
              className="block w-full py-3 text-center bg-white text-green-700 hover:bg-green-50 font-bold rounded-xl transition-colors mb-6"
            >
              {t('pricing.cta.pro')}
            </Link>
            <p className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-3">{t('pricing.includes')}</p>
            <ul className="space-y-2">
              {FEATURES_PRO.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-white">
                  <Check className="w-4 h-4 text-white/80 shrink-0" />
                  {t(f)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          All prices include GST. Cancel anytime. 7-day free trial on all plans.
        </p>
      </div>
    </section>
  );
}
