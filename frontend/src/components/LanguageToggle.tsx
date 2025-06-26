'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <button
      onClick={() => setLocale(locale === 'eng' ? 'lat' : 'eng')}
      className="text-xs uppercase tracking-wide text-[#f5f5dc] border border-[#f5f5dc] px-2 py-1 rounded"
    >
      {locale === 'eng' ? 'LATVISKI' : 'ENGLISH'}
    </button>
  );
}
