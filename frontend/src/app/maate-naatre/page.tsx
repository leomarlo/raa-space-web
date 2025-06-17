'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useState } from 'react';

export default function MaateNaatrePage() {
    const [navOpen, setNavOpen] = useState(true);
  
    return (
      <div className="relative w-full h-screen overflow-hidden">
        <RaaHieroglyphMatrix frequency={0} initialState={0} />
        <Entrance
          initialMenuSelection={'Maate Naatre'}
          itemArrangement={2}
          navOpen={navOpen}
          setNavOpen={setNavOpen}
        />
      </div>
    );
  }