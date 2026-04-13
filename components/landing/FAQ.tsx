'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'];

interface FAQItemProps {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, open, onToggle }: FAQItemProps) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-6 pb-5 text-gray-600 leading-relaxed text-sm border-t border-gray-100 pt-4">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQ({ limit }: { limit?: number }) {
  const { t } = useI18n();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const keys = limit ? FAQ_KEYS.slice(0, limit) : FAQ_KEYS;

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">{t('faq.title')}</h2>
          <p className="text-gray-500 text-lg">{t('faq.sub')}</p>
        </div>

        <div className="space-y-3">
          {keys.map((key, i) => (
            <FAQItem
              key={key}
              question={t(`faq.${key}`)}
              answer={t(`faq.a${key.slice(1)}`)}
              open={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
