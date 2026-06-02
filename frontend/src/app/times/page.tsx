'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useState, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function TimesPage() {
  const [navOpen, setNavOpen] = useState(false);
  const { t, locale } = useLanguage();

  const isSpecialPeriod = useMemo(() => {
    const today = new Date();
    const start = new Date(2026, 4, 28);        // May 28, 2026
    const end   = new Date(2026, 5, 24, 23, 59, 59); // Jun 24, 2026
    return today >= start && today <= end;
  }, []);

  return (
    <div className="relative w-full min-h-screen text-[#f5f5dc]">
      <div className="fixed inset-0 -z-10">
        <RaaHieroglyphMatrix frequency={0} initialState={0} />
      </div>

      {navOpen && (
        <div className="absolute inset-0 bg-black/70 z-30 pointer-events-auto" />
      )}

      <Entrance
        initialMenuSelection={null}
        itemArrangement={1}
        navOpen={navOpen}
        setNavOpen={setNavOpen}
      />

      <div className="relative z-10 py-20 px-4 sm:px-8 pointer-events-auto flex justify-center">
        <div className="max-w-4xl w-full bg-black p-6 sm:p-8 rounded-lg shadow-lg space-y-6">
          <h1 className="text-4xl font-bold text-center">{t.times.title}</h1>

          <div className="text-center space-y-2">
            <p className="text-xl font-semibold">{t.times.openingLabel}</p>
            <p className="text-3xl font-bold">{t.times.days}</p>
            <p className="text-3xl font-bold">{t.times.hours}</p>
          </div>

          <p className="text-center text-sm opacity-75">{t.times.note}</p>

          <p className="text-center">{t.times.address}</p>

          {isSpecialPeriod && (
            <div className="border-[3pt] border-[#8B0000] bg-black p-6 rounded-lg flashing-box">
              <p className="text-[#f5f5dc] font-bold text-lg text-center mb-3">
                {locale === 'lat'
                  ? '11. – 24. jūnijs: izmainīti darba laiki'
                  : '11 – 24 June: different opening times'}
              </p>
              <div className="text-center space-y-1 mb-3">
                <p className="text-[#f5f5dc]">
                  {locale === 'lat' ? 'Pirmdiena – Piektdiena' : 'Monday – Friday'}: 11:00 – 19:00
                </p>
                <p className="text-[#f5f5dc]">
                  {locale === 'lat' ? 'Sestdiena & Svētdiena' : 'Saturday & Sunday'}: 11:00 – 17:00
                </p>
              </div>
              <p className="text-center text-[#f5f5dc]/70 text-sm mb-4">
                {locale === 'lat'
                  ? 'Meža Bārs šajā periodā ir slēgts (vasaras atvaļinājums).'
                  : 'Forest Bar is closed during this period (summer leave).'}
              </p>
              <div className="flex justify-center">
                <a
                  href="https://www.instagram.com/p/DYwL5qfDFi0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#f5f5dc]/60 hover:text-[#f5f5dc] transition-colors underline"
                >
                  Instagram
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
