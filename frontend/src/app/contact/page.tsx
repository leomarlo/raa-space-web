'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useState } from 'react';

export default function ContactPage() {
  const [navOpen, setNavOpen] = useState(true);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <RaaHieroglyphMatrix frequency={0} initialState={0} />
      <Entrance
        initialNavOpen={true}
        initialMenuSelection={'Contact'}
        itemArrangement={2}
        navOpen={navOpen}
        setNavOpen={setNavOpen}
      />
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="max-w-lg bg-black/90 text-[#f5f5dc] text-lg p-8 rounded-lg text-justify pointer-events-auto">
          <p className="mb-4">
            Contact us at <a href="mailto:enter@raa.space" className="underline">enter@raa.space</a>.
          </p>
          <p className="mb-4">We are located at Matīsa iela 8, Rīga.</p>
          <p>
            Follow us on Instagram:{" "}
            <a
              href="https://www.instagram.com/raa_riga/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              @raa_riga
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
