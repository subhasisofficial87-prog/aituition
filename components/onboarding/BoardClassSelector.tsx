'use client';

import { useI18n } from '@/lib/i18n';

const BOARDS = ['CBSE', 'ICSE', 'Odia Medium'];
const CLASSES = ['LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

interface Props {
  board: string;
  classLevel: string;
  childName: string;
  language: string;
  onChange: (field: string, value: string) => void;
}

export default function BoardClassSelector({ board, classLevel, childName, language, onChange }: Props) {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      {/* Child name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('onboarding.child.name')}</label>
        <input
          type="text"
          value={childName}
          onChange={(e) => onChange('childName', e.target.value)}
          placeholder={t('onboarding.child.placeholder')}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
        />
      </div>

      {/* Board */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('onboarding.board')}</label>
        <div className="flex flex-wrap gap-3">
          {BOARDS.map((b) => (
            <button
              key={b}
              onClick={() => onChange('board', b)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                board === b
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Class */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('onboarding.class')}</label>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {CLASSES.map((c) => (
            <button
              key={c}
              onClick={() => onChange('classLevel', c)}
              className={`py-2 rounded-lg font-semibold text-sm transition-all ${
                classLevel === c
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('onboarding.language')}</label>
        <select
          value={language}
          onChange={(e) => onChange('language', e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
        >
          <option value="English">English</option>
          <option value="Hindi">हिन्दी</option>
          <option value="Odia">ଓଡ଼ିଆ</option>
          <option value="Bengali">বাংলা</option>
          <option value="Tamil">தமிழ்</option>
          <option value="Telugu">తెలుగు</option>
          <option value="Marathi">मराठी</option>
          <option value="Kannada">ಕನ್ನಡ</option>
          <option value="Gujarati">ગુજરાતી</option>
          <option value="Malayalam">മലയാളം</option>
          <option value="Urdu">اردو</option>
        </select>
      </div>
    </div>
  );
}
