'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function TavaasKurpeesPage() {
  const [navOpen, setNavOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="relative w-full min-h-screen overflow-hidden text-[#f5f5dc]">
      <RaaHieroglyphMatrix frequency={0} initialState={0} />

      {navOpen && (
        <div className="absolute inset-0 bg-black/70 z-30 pointer-events-auto" />
      )}

      <Entrance
        initialMenuSelection={'RAA SPACE'}
        itemArrangement={2}
        navOpen={navOpen}
        setNavOpen={setNavOpen}
      />

      <div className="relative z-10 w-full pt-20 pb-8 px-4 sm:px-8 pointer-events-auto flex">
        <div className="bg-black p-6 md:p-10 max-w-5xl w-full rounded-none space-y-6 text-left text-justify leading-relaxed text-[#f5f5dc] whitespace-pre-line">
          <h1 className="text-4xl font-bold text-center mb-4">
            {t.program.items.tavaasKurpees.title}
          </h1>

          <p>{t.program.items.tavaasKurpees.description}</p>

          <div className="w-full aspect-[3/4]">
            <iframe
              src="/assets/tavaas-kurpees/TavaasKurpees.pdf"
              width="100%"
              height="800px"
              className="border border-white w-full"
              title="Tavaas Kurpees Exhibition PDF"
            />
          </div>
        </div>
      </div>

    </div>
  );
}
