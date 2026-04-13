'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import BoardClassSelector from '@/components/onboarding/BoardClassSelector';
import SubjectSelector from '@/components/onboarding/SubjectSelector';
import SyllabusSelector from '@/components/onboarding/SyllabusSelector';
import PlanCreationLoader from '@/components/onboarding/PlanCreationLoader';

const STEPS = 4;

export default function OnboardingPage() {
  const { t } = useI18n();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [board, setBoard] = useState('CBSE');
  const [classLevel, setClassLevel] = useState('10');
  const [subject, setSubject] = useState('Mathematics');
  const [childName, setChildName] = useState('');
  const [language, setLanguage] = useState('English');
  const [chapters, setChapters] = useState<string[]>([]);

  function handleChange(field: string, value: string) {
    if (field === 'board') setBoard(value);
    else if (field === 'classLevel') setClassLevel(value);
    else if (field === 'childName') setChildName(value);
    else if (field === 'language') setLanguage(value);
  }

  function canProceed(): boolean {
    if (step === 1) return !!board && !!classLevel && !!childName.trim();
    if (step === 2) return !!subject;
    if (step === 3) return chapters.length > 0;
    return true;
  }

  async function handleCreate() {
    setCreating(true);
    setError('');
    setStep(4);
    try {
      const res = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ board, classLevel, subject, childName, language, chapters }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(t('common.error'));
        setStep(3);
        return;
      }
      router.push('/dashboard');
    } catch {
      setError(t('common.error'));
      setStep(3);
    } finally {
      setCreating(false);
    }
  }

  const stepLabels = [
    t('onboarding.step1'),
    t('onboarding.step2'),
    t('onboarding.step3'),
    t('onboarding.step4'),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">{t('onboarding.title')}</h1>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {stepLabels.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all ${
                step > i + 1
                  ? 'bg-green-500 text-white'
                  : step === i + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`hidden sm:block text-xs font-medium ${step === i + 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                {label}
              </span>
              {i < STEPS - 1 && <div className="w-6 h-0.5 bg-gray-200" />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {step === 4 && creating ? (
            <PlanCreationLoader />
          ) : (
            <>
              {step === 1 && (
                <BoardClassSelector
                  board={board}
                  classLevel={classLevel}
                  childName={childName}
                  language={language}
                  onChange={handleChange}
                />
              )}
              {step === 2 && (
                <SubjectSelector
                  board={board}
                  classLevel={classLevel}
                  subject={subject}
                  onChange={setSubject}
                />
              )}
              {step === 3 && (
                <SyllabusSelector
                  board={board}
                  classLevel={classLevel}
                  subject={subject}
                  chapters={chapters}
                  onChange={setChapters}
                />
              )}

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                {step > 1 ? (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {t('onboarding.back')}
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    disabled={!canProceed()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50 text-sm shadow-sm"
                  >
                    {t('onboarding.next')}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleCreate}
                    disabled={!canProceed() || creating}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-lg hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50 text-sm shadow-sm"
                  >
                    {t('onboarding.start')}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
