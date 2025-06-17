'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useState } from 'react';

export default function RaaPage() {
    const [navOpen, setNavOpen] = useState(false);
  
    return (
      <div className="relative w-full h-screen overflow-hidden">
        <RaaHieroglyphMatrix frequency={0} initialState={0} />
        <Entrance
          initialMenuSelection={null}
          itemArrangement={1}
          navOpen={navOpen}
          setNavOpen={setNavOpen}
        />
      </div>
    );
  }