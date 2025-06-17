'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useState } from 'react';

export default function ProgramPage() {
  const [navOpen, setNavOpen] = useState(true);

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
        <div className="bg-black/90 text-[#f5f5dc] text-3xl font-semibold p-8 rounded-lg pointer-events-auto">
          Coming soon
        </div>
      </div>
    </div>
  );
}
