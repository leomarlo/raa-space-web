'use client';

import Head from 'next/head';
import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useState } from 'react';

export default function TelpaPage() {
  const [navOpen, setNavOpen] = useState(true);

  return (
    <div className="relative w-full h-screen overflow-hidden text-[#f5f5dc]">
      <Head>
        <title>RAA SPACE | Telpa</title>
      </Head>
      <RaaHieroglyphMatrix frequency={0} initialState={0} />
      <Entrance
        initialNavOpen={true}
        initialMenuSelection={'RAA SPACE'}
        itemArrangement={2}
        navOpen={navOpen}
        setNavOpen={setNavOpen}
      />

      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="bg-black/80 p-8 rounded-lg max-w-xl text-xl space-y-6 text-justify leading-relaxed">
          <p>
            Raa is a venue for performances, exhibitions, workshops and other cultural events located in the center of Riga.
          </p>
          <p>
            Raa is raa. If it was something else it wouldn't be called so. In some fields of inquiry an argument that aims to establish a claim by proving that the contrary would lead to absurdity is called <em>Reductio ad Absurdum</em>, sometimes also abbreviated to <strong>RAA</strong>.
          </p>
          <p>
            Had Raa been created on June 1st 2025 or later, it couldn't have been what it is now and besides who would create Raa after registering the domain <code>raa.space</code>?
          </p>
        </div>
      </div>
    </div>
  );
}
