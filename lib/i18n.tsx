'use client';

import { createContext, useContext } from 'react';

export const LANGUAGES = {
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
} as const;

export type LangCode = keyof typeof LANGUAGES;

interface I18nContextType {
  lang: string;
  setLang: (lang: string) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  return (
    <I18nContext.Provider value={{ lang: 'en', setLang: () => {}, t: (k) => k }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
