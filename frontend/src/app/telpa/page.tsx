'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function TelpaPage() {
  const [navOpen, setNavOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="relative w-full h-screen overflow-hidden text-[#f5f5dc]">
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

      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="bg-black/80 p-8 rounded-none max-w-xl text-l space-y-6 text-justify leading-relaxed">
          <p>{t.telpa.paragraph1}</p>
          <p>{t.telpa.paragraph2}</p>
          {t.telpa.findUsOnInstagram}
          <a href="https://www.instagram.com/raa_riga/" target="_blank" rel="noopener noreferrer" className="underline">
            {t.telpa.instagram}
          </a>
        </div>
      </div>
    </div>
  );
}
