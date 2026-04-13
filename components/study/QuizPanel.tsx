'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import type { QuizQuestion } from '@/types';

interface Props {
  questions: QuizQuestion[];
  onSubmit: (answers: string[]) => void;
  submitting?: boolean;
}

export default function QuizPanel({ questions, onSubmit, submitting }: Props) {
  const { t } = useI18n();
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''));

  function selectAnswer(qIdx: number, option: string) {
    const letter = option.charAt(0); // 'A', 'B', 'C', 'D'
    const updated = [...answers];
    updated[qIdx] = letter;
    setAnswers(updated);
  }

  const allAnswered = answers.every((a) => a !== '');

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <HelpCircle className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{t('study.quiz')}</p>
          <p className="text-sm text-gray-700">Answer all 5 questions to complete today's lesson</p>
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((q, qi) => (
          <div key={qi} className="bg-gray-50 rounded-xl p-4">
            <p className="font-semibold text-gray-900 mb-3 text-sm leading-relaxed">
              Q{qi + 1}. {q.q}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.options.map((opt, oi) => {
                const letter = opt.charAt(0);
                const selected = answers[qi] === letter;
                return (
                  <button
                    key={oi}
                    onClick={() => selectAnswer(qi, opt)}
                    className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all border-2 ${
                      selected
                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => onSubmit(answers)}
        disabled={!allAnswered || submitting}
        className="mt-6 w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 shadow-sm"
      >
        {submitting ? t('common.loading') : t('study.quiz.submit')}
      </button>
    </div>
  );
}
