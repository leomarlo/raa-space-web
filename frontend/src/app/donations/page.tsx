'use client';

import { useState } from 'react';
import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useLanguage } from '@/context/LanguageContext';

export default function DonationsPage() {
  const [navOpen, setNavOpen] = useState(false);
  const { t } = useLanguage();
  const d = t.donations;

  return (
    <div className="relative w-full min-h-screen text-[#f5f5dc]">
      <div className="absolute inset-0 -z-10">
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
        <div className="max-w-2xl w-full bg-black/70 p-6 sm:p-8 rounded-lg shadow-lg space-y-6">
          <h1 className="text-4xl font-bold text-center">{d.title}</h1>

          <p className="text-justify leading-relaxed">{d.intro}</p>
          <p className="text-justify leading-relaxed">{d.why}</p>

          <div className="border border-[#f5f5dc]/30 rounded-lg p-6 space-y-3">
            <h2 className="text-xl font-bold">{d.bankTitle}</h2>
            <div className="flex gap-4">
              <span className="text-[#f5f5dc]/60 w-24 shrink-0">{d.account}</span>
              <span className="font-mono">RAA.SPACE</span>
            </div>
            <div className="flex gap-4">
              <span className="text-[#f5f5dc]/60 w-24 shrink-0">{d.iban}</span>
              <span className="font-mono tracking-widest">LV76HABA0551062076709</span>
            </div>
          </div>

          <p className="text-justify leading-relaxed border-l-2 border-[#8B0000] pl-4">{d.tile}</p>

          <p className="text-center text-[#f5f5dc]/80 italic">{d.thankYou}</p>
        </div>
      </div>
    </div>
  );
}
