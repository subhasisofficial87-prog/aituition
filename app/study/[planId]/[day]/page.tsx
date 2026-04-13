'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, HelpCircle, MessageCircle, CreditCard } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import LectureViewer from '@/components/study/LectureViewer';
import QuizPanel from '@/components/study/QuizPanel';
import QuizResult from '@/components/study/QuizResult';
import DoubtChat from '@/components/study/DoubtChat';
import type { QuizQuestion, DayEntry } from '@/types';

type Tab = 'lecture' | 'quiz' | 'doubt';

interface StudyData {
  session: {
    lecture_content: string;
    quiz_questions: QuizQuestion[];
    quiz_answers?: string[];
    quiz_score?: number;
    completed: number;
  };
  dayEntry: DayEntry;
}

export default function StudyPage({ params }: { params: Promise<{ planId: string; day: string }> }) {
  const { planId, day } = use(params);
  const dayNum = Number(day);

  const { t } = useI18n();
  const router = useRouter();

  const [data, setData] = useState<StudyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('lecture');
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    // Detect pro from cookie (set by JWT; we check via a simple API later)
    fetch('/api/progress')
      .then((r) => r.json())
      .then((d) => { if (d.tier === 'pro') setIsPro(true); })
      .catch(() => {});

    fetch(`/api/sessions?planId=${planId}&day=${dayNum}`)
      .then(async (res) => {
        if (res.status === 402) {
          const d = await res.json();
          setBlocked(d.blocked);
          return;
        }
        const d = await res.json();
        setData(d);
        if (d.session.completed) {
          setQuizAnswers(d.session.quiz_answers ?? []);
          setQuizScore(d.session.quiz_score ?? null);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [planId, dayNum]);

  async function handleQuizSubmit(answers: string[]) {
    setQuizSubmitting(true);
    try {
      const res = await fetch('/api/sessions/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, day: dayNum, answers }),
      });
      const result = await res.json();
      setQuizAnswers(answers);
      setQuizScore(result.score);
    } catch {
      // ignore
    } finally {
      setQuizSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">{t('study.generating')}</p>
        </div>
      </div>
    );
  }

  if (blocked === 'trial_expired') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('study.paywall.title')}</h2>
          <p className="text-gray-500 mb-6">{t('study.paywall.sub')}</p>
          <Link href="/#pricing" className="block w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-xl shadow-sm mb-3">
            {t('study.paywall.cta')}
          </Link>
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
            ← {t('study.back.dashboard')}
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{t('common.error')}</p>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'lecture', label: t('study.lecture'), icon: <BookOpen className="w-4 h-4" /> },
    { key: 'quiz',    label: t('study.quiz'),    icon: <HelpCircle className="w-4 h-4" /> },
    { key: 'doubt',   label: t('study.doubt'),   icon: <MessageCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
              {t('study.day')} {dayNum} · {t('study.chapter')}: {data.dayEntry.chapter}
            </p>
            <p className="text-sm font-semibold text-gray-900 truncate">{data.dayEntry.topic}</p>
          </div>
          {quizScore !== null && (
            <span className="text-xs bg-green-100 text-green-700 font-bold px-2.5 py-1 rounded-full">
              {quizScore}/{data.session.quiz_questions.length} ✓
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="max-w-3xl mx-auto px-4 flex gap-1 pb-0">
          {tabs.map((t_) => (
            <button
              key={t_.key}
              onClick={() => setTab(t_.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                tab === t_.key
                  ? 'border-green-500 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t_.icon}
              {t_.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          {tab === 'lecture' && (
            <LectureViewer
              content={data.session.lecture_content}
              topic={data.dayEntry.topic}
            />
          )}

          {tab === 'quiz' && (
            quizScore !== null ? (
              <QuizResult
                questions={data.session.quiz_questions}
                answers={quizAnswers}
                score={quizScore}
                onNext={() => router.push(`/study/${planId}/${dayNum + 1}`)}
              />
            ) : (
              <QuizPanel
                questions={data.session.quiz_questions}
                onSubmit={handleQuizSubmit}
                submitting={quizSubmitting}
              />
            )
          )}

          {tab === 'doubt' && (
            <DoubtChat planId={planId} day={dayNum} isPro={isPro} />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-4">
          {dayNum > 1 && (
            <Link
              href={`/study/${planId}/${dayNum - 1}`}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              ← Previous Day
            </Link>
          )}
          <div />
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
            {t('study.back.dashboard')} →
          </Link>
        </div>
      </div>
    </div>
  );
}
