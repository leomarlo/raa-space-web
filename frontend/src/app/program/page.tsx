'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import ProgramCard from '@/components/ProgramCard';
import ProgramItem from '@/types/program';

export default function ProgramPage() {
  const [navOpen, setNavOpen] = useState(false);
  const { t } = useLanguage();

  // Convert program.items object to array
  const programItems: ProgramItem[] = Object.values(t.program.items);


  return (
    <div className="relative w-full h-screen overflow-hidden">
      <RaaHieroglyphMatrix frequency={0} initialState={0} />
      {navOpen && (
        <div className="absolute inset-0 bg-black/70 z-30 pointer-events-auto" />
      )}
      <Entrance
        initialMenuSelection={'Program'}
        itemArrangement={2}
        navOpen={navOpen}
        setNavOpen={setNavOpen}
      />
      <div className="absolute inset-0 z-10 overflow-auto py-20 px-4 sm:px-8 pointer-events-auto flex justify-center">
        <div className="max-w-3xl w-full">
          {programItems.map((item) => (
            <ProgramCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
