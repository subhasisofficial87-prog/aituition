'use client';

import { useEffect } from 'react';
import { useI18n } from '@/lib/i18n';

/**
 * Subjects available per board × class group.
 * Must match the subjects seeded in syllabus_structures.
 */
const SUBJECTS: Record<string, Record<string, string[]>> = {
  CBSE: {
    'LKG-UKG':    ['English', 'Hindi', 'Mathematics', 'EVS'],
    'Class 1-5':  ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Sanskrit', 'Computer', 'General Knowledge'],
    'Class 6-8':  ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'History', 'Geography', 'Sanskrit', 'Computer Science'],
    'Class 9-12': ['English', 'Hindi', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Computer Science'],
  },
  ICSE: {
    'LKG-UKG':    ['English', 'Mathematics'],
    'Class 1-5':  ['English', 'Mathematics'],
    'Class 6-8':  ['English', 'History & Civics', 'Geography'],
    'Class 9-12': ['Physics', 'Chemistry', 'Biology', 'Computer Applications'],
  },
  'Odia Medium': {
    'LKG-UKG':    ['Odia'],
    'Class 1-5':  ['Odia', 'Hindi'],
    'Class 6-8':  ['Odia', 'History', 'Geography', 'Science', 'Computer'],
    'Class 9-12': ['Odia', 'Mathematics', 'Science', 'History', 'Geography', 'Computer'],
  },
};

/** Map individual class → group key */
function classToGroup(cls: string): string {
  if (['LKG', 'UKG'].includes(cls)) return 'LKG-UKG';
  const n = Number(cls);
  if (n >= 1 && n <= 5)  return 'Class 1-5';
  if (n >= 6 && n <= 8)  return 'Class 6-8';
  if (n >= 9 && n <= 12) return 'Class 9-12';
  return 'Class 6-8';
}

interface Props {
  board: string;
  classLevel: string;
  subject: string;
  onChange: (subject: string) => void;
}

export default function SubjectSelector({ board, classLevel, subject, onChange }: Props) {
  const { t } = useI18n();

  const group    = classToGroup(classLevel);
  const subjects = SUBJECTS[board]?.[group] ?? SUBJECTS['CBSE']['Class 6-8'];

  // Auto-select first when class/board changes and current subject not in list
  useEffect(() => {
    if (subjects.length > 0 && !subjects.includes(subject)) {
      onChange(subjects[0]);
    }
  }, [board, classLevel]);

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{t('onboarding.subject')}</label>
      <p className="text-xs text-gray-400 mb-4">
        {board} · {group}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {subjects.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all text-left ${
              subject === s
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-gray-50 border border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
