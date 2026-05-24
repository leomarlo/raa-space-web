'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function TimesPage() {
  const [navOpen, setNavOpen] = useState(false);
  const { t } = useLanguage();

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
        </div>
      </div>
    </div>
  );
}
