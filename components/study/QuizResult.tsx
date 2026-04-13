'use client';

import { CheckCircle, XCircle, Trophy } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import type { QuizQuestion } from '@/types';

interface Props {
  questions: QuizQuestion[];
  answers: string[];
  score: number;
  onNext: () => void;
}

export default function QuizResult({ questions, answers, score, onNext }: Props) {
  const { t } = useI18n();
  const total = questions.length;
  const pct = Math.round((score / total) * 100);

  const emoji = pct >= 80 ? '🌟' : pct >= 60 ? '👍' : '💪';
  const color = pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-blue-600' : 'text-orange-600';

  return (
    <div>
      {/* Score summary */}
      <div className="text-center mb-8 py-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl">
        <div className="text-5xl mb-3">{emoji}</div>
        <h3 className="text-2xl font-bold text-gray-900">{t('study.quiz.score')}</h3>
        <p className={`text-5xl font-extrabold mt-2 ${color}`}>{score}/{total}</p>
        <p className="text-gray-500 mt-1 text-sm">{pct}% correct</p>
      </div>

      {/* Per-question breakdown */}
      <div className="space-y-4 mb-8">
        {questions.map((q, i) => {
          const correct = answers[i] === q.answer;
          return (
            <div
              key={i}
              className={`rounded-xl p-4 border-2 ${
                correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-start gap-2 mb-2">
                {correct
                  ? <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  : <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                }
                <p className="text-sm font-semibold text-gray-900">{q.q}</p>
              </div>
              {!correct && (
                <p className="text-xs text-gray-600 ml-7">
                  <span className="font-semibold text-green-700">{t('study.quiz.correct')}:</span> {q.answer}) {q.options.find(o => o.startsWith(q.answer))}
                </p>
              )}
              {q.explanation && (
                <p className="text-xs text-gray-500 ml-7 mt-1 italic">{q.explanation}</p>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={onNext}
        className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold rounded-xl transition-all shadow-sm"
      >
        {t('study.next.day')} →
      </button>
    </div>
  );
}
