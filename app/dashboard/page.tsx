'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import StatsBar from '@/components/dashboard/StatsBar';
import TodaysLesson from '@/components/dashboard/TodaysLesson';
import StudyCalendar from '@/components/dashboard/StudyCalendar';
import WeakAreas from '@/components/dashboard/WeakAreas';
import RecentQuizzes from '@/components/dashboard/RecentQuizzes';
import MotivationalBanner from '@/components/dashboard/MotivationalBanner';
import type { DashboardData, DayEntry } from '@/types';

export default function DashboardPage() {
  const { t } = useI18n();
  const [data, setData] = useState<DashboardData | null>(null);
  const [planData, setPlanData] = useState<DayEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/progress')
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!data?.plan?.id) return;
    fetch(`/api/plans/${data.plan.id}`)
      .then((r) => r.json())
      .then((d) => {
        const pd = d.plan?.plan_data;
        if (Array.isArray(pd)) setPlanData(pd);
      })
      .catch(() => {});
  }, [data?.plan?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const noPlan = !data?.plan;
  const progressPct = data ? Math.round((data.completedDays / Math.max(data.totalDays, 1)) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">{t('dashboard.title')} 👋</h1>
            {data?.plan && (
              <p className="text-gray-500 text-sm mt-1">
                {data.plan.childName} · {data.plan.board} Class {data.plan.classLevel} · {data.plan.subject}
              </p>
            )}
          </div>
          <Link
            href="/onboarding"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm font-semibold rounded-xl shadow-sm hover:from-green-600 hover:to-blue-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Plan
          </Link>
        </div>

        {noPlan ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t('dashboard.no.plan')}</h2>
            <p className="text-gray-500 mb-6 text-sm">Set up your child's study plan in under 30 seconds.</p>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-xl shadow-sm"
            >
              <Plus className="w-4 h-4" />
              {t('dashboard.create')}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Motivational banner */}
            <MotivationalBanner
              streak={data!.streak}
              progress={progressPct}
              childName={data?.plan?.childName}
            />

            {/* Stats */}
            <StatsBar
              streak={data!.streak}
              progress={progressPct}
              weeklyMins={data!.weeklyMins}
              avgScore={data!.avgQuizScore}
            />

            {/* Today's lesson + weak areas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TodaysLesson
                  planId={data!.plan?.id ?? null}
                  todayEntry={data!.todayEntry}
                  completedDays={data!.completedDays}
                />
              </div>
              <div>
                <WeakAreas areas={data!.weakAreas ?? []} />
              </div>
            </div>

            {/* Calendar */}
            {planData.length > 0 && (
              <StudyCalendar
                planData={planData}
                completedDays={data!.completedDays}
                planId={data!.plan!.id}
              />
            )}

            {/* Recent quizzes */}
            <RecentQuizzes quizzes={data!.recentQuizzes ?? []} />
          </div>
        )}
      </div>
    </div>
  );
}
