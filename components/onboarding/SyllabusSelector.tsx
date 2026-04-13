'use client';

import { useEffect, useState } from 'react';
import { List, PenLine } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import type { SyllabusStructure } from '@/types';

interface Props {
  board: string;
  classLevel: string;
  subject: string;
  chapters: string[];
  onChange: (chapters: string[]) => void;
}

export default function SyllabusSelector({ board, classLevel, subject, chapters, onChange }: Props) {
  const { t } = useI18n();
  const [mode, setMode] = useState<'pick' | 'custom'>('pick');
  const [structures, setStructures] = useState<SyllabusStructure[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [customText, setCustomText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!board || !classLevel || !subject) return;
    setLoading(true);
    fetch(`/api/syllabus?board=${encodeURIComponent(board)}&class=${encodeURIComponent(classLevel)}&subject=${encodeURIComponent(subject)}`)
      .then((r) => r.json())
      .then((data) => {
        setStructures(data.structures ?? []);
        if (data.structures?.length > 0) {
          setSelectedId(data.structures[0].id);
          onChange(data.structures[0].chapters_json);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [board, classLevel, subject]);

  function handlePickStructure(s: SyllabusStructure) {
    setSelectedId(s.id);
    onChange(s.chapters_json as string[]);
  }

  function handleCustomChange(text: string) {
    setCustomText(text);
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    onChange(lines);
  }

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex gap-3">
        <button
          onClick={() => setMode('pick')}
          className={`flex items-center gap-2 flex-1 py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${
            mode === 'pick'
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          <List className="w-4 h-4" />
          {t('onboarding.syllabus.pick')}
        </button>
        <button
          onClick={() => setMode('custom')}
          className={`flex items-center gap-2 flex-1 py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${
            mode === 'custom'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          <PenLine className="w-4 h-4" />
          {t('onboarding.syllabus.custom')}
        </button>
      </div>

      {mode === 'pick' && (
        <div>
          {loading ? (
            <div className="text-center py-6 text-gray-400">{t('common.loading')}</div>
          ) : structures.length === 0 ? (
            <p className="text-gray-500 text-sm py-4">No pre-defined syllabus found. Please use custom entry.</p>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 font-medium">{t('onboarding.select.structure')}</p>
              {structures.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handlePickStructure(s)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedId === s.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <p className="font-semibold text-gray-900 text-sm">{s.structure_name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {Array.isArray(s.chapters_json) ? s.chapters_json.length : '?'} chapters
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {mode === 'custom' && (
        <div>
          <textarea
            value={customText}
            onChange={(e) => handleCustomChange(e.target.value)}
            placeholder={t('onboarding.custom.placeholder')}
            rows={10}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm font-mono resize-none"
          />
          {chapters.length > 0 && (
            <p className="text-xs text-green-600 mt-2 font-semibold">{chapters.length} chapters detected</p>
          )}
        </div>
      )}
    </div>
  );
}
