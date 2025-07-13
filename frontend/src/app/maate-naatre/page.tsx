'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useState } from 'react';

export default function MaateNaatrePage() {
    const [navOpen, setNavOpen] = useState(false);
  
    return (
      <div className="relative w-full h-screen overflow-hidden">
        <RaaHieroglyphMatrix frequency={0} initialState={0} />
        {navOpen && (
          <div className="absolute inset-0 bg-black/70 z-30 pointer-events-auto" />
        )}
        <Entrance
          initialMenuSelection={'Maate Naatre'}
          itemArrangement={2}
          navOpen={navOpen}
          setNavOpen={setNavOpen}
        />
      </div>
    );
  }