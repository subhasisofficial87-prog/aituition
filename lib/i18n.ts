'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ─── Language Map ─────────────────────────────────────────────────────────────
export const LANGUAGES: Record<string, string> = {
  en: 'English',
  hi: 'हिन्दी',
  or: 'ଓଡ଼ିଆ',
  bn: 'বাংলা',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  mr: 'मराठी',
  kn: 'ಕನ್ನಡ',
  gu: 'ગુજરાતી',
  ml: 'മലയാളം',
  ur: 'اردو',
};

export type LangCode = keyof typeof LANGUAGES;

// ─── Static locale imports (bundled at build time) ────────────────────────────
const LOCALES: Record<string, Record<string, string>> = {
  en: require('../locales/en.json'),
  hi: require('../locales/hi.json'),
  or: require('../locales/or.json'),
  bn: require('../locales/bn.json'),
  ta: require('../locales/ta.json'),
  te: require('../locales/te.json'),
  mr: require('../locales/mr.json'),
  kn: require('../locales/kn.json'),
  gu: require('../locales/gu.json'),
  ml: require('../locales/ml.json'),
  ur: require('../locales/ur.json'),
};

// ─── Context ──────────────────────────────────────────────────────────────────
interface I18nContextValue {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
});

// ─── Provider ─────────────────────────────────────────────────────────────────
export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>('en');

  useEffect(() => {
    // Read from localStorage on mount
    try {
      const stored = localStorage.getItem('ait_lang') as LangCode | null;
      if (stored && LOCALES[stored]) {
        setLangState(stored);
      }
    } catch {
      // localStorage unavailable (SSR or private browsing)
    }
  }, []);

  const setLang = useCallback((newLang: LangCode) => {
    if (!LOCALES[newLang]) return;
    setLangState(newLang);
    try {
      localStorage.setItem('ait_lang', newLang);
      // Also set cookie so SSR can hint the language
      document.cookie = `ait_lang=${newLang};path=/;max-age=${60 * 60 * 24 * 365}`;
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      const locale = LOCALES[lang] ?? LOCALES['en'];
      return locale[key] ?? LOCALES['en'][key] ?? key;
    },
    [lang]
  );

  return React.createElement(
    I18nContext.Provider,
    { value: { lang, setLang, t } },
    children
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}

// ─── RTL languages ────────────────────────────────────────────────────────────
export const RTL_LANGS: LangCode[] = ['ur'];

export function isRTL(lang: LangCode): boolean {
  return RTL_LANGS.includes(lang);
}
