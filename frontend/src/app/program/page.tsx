'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function ProgramPage() {
  const [navOpen, setNavOpen] = useState(true);
  const { t } = useLanguage();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <RaaHieroglyphMatrix frequency={0} initialState={0} />
      <Entrance
        initialMenuSelection={'Program'}
        itemArrangement={2}
        navOpen={navOpen}
        setNavOpen={setNavOpen}
      />
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="bg-black/90 text-[#f5f5dc] text-3xl font-semibold p-8 rounded-none pointer-events-auto text-center">
          <br />
          <br />
          {t.program.openingEvent}
          <a href="https://www.instagram.com/p/DLUciNyNjXL/?img_index=1" target="_blank" rel="noopener noreferrer" className="underline">
            {t.program.openingEventLink}
          </a>
        </div>
      </div>
    </div>
  );
}
