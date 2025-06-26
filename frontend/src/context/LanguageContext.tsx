// context/LanguageContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import eng from '@/locales/eng.json';
import lat from '@/locales/lat.json';

type Locale = 'eng' | 'lat';
type Translations = typeof eng;

const translations: Record<Locale, Translations> = { eng, lat };

const LanguageContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Translations;
}>({
  locale: 'eng',
  setLocale: () => {},
  t: translations.eng,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('lat');
  const t = translations[locale];

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
