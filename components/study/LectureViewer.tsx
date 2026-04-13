'use client';

import { BookOpen } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface Props {
  content: string;
  topic: string;
}

export default function LectureViewer({ content, topic }: Props) {
  const { t } = useI18n();

  // Simple markdown-lite renderer: bold, headings, bullets
  function renderContent(text: string) {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-xl font-bold text-gray-900 mt-6 mb-2">{line.slice(3)}</h2>;
      }
      if (line.startsWith('# ')) {
        return <h1 key={i} className="text-2xl font-extrabold text-gray-900 mt-6 mb-3">{line.slice(2)}</h1>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={i} className="ml-4 text-gray-700 leading-relaxed list-disc">
            {renderInline(line.slice(2))}
          </li>
        );
      }
      if (line.startsWith('📌')) {
        return (
          <div key={i} className="mt-6 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 font-medium">
            {line}
          </div>
        );
      }
      if (!line.trim()) return <div key={i} className="h-2" />;
      return <p key={i} className="text-gray-700 leading-relaxed mb-2">{renderInline(line)}</p>;
    });
  }

  function renderInline(text: string) {
    // Bold: **text**
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith('**') && part.endsWith('**')
        ? <strong key={i}>{part.slice(2, -2)}</strong>
        : part
    );
  }

  return (
    <div>
      {/* Topic header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{t('study.lecture')}</p>
          <h2 className="text-lg font-bold text-gray-900">{topic}</h2>
        </div>
      </div>

      {/* Lecture content */}
      <div className="prose max-w-none text-base">
        {renderContent(content)}
      </div>
    </div>
  );
}
