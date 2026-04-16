'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useI18n, LANGUAGES, LangCode } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label="Switch language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{LANGUAGES[lang as LangCode] || 'English'}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 max-h-72 overflow-y-auto">
          {Object.entries(LANGUAGES).map(([code, name]) => (
            <button
              key={code}
              onClick={() => {
                setLang(code as LangCode);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-green-50 hover:text-green-700 transition-colors ${
                lang === code ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-700'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
