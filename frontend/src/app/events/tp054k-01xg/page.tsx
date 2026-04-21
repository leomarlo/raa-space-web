'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import EventPageContent from '@/components/EventPageContent';
import Image from 'next/image';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Tp054k01xgPage() {
  const [navOpen, setNavOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="relative w-full min-h-screen text-[#f5f5dc]">
      <div className="fixed inset-0 -z-10">
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
        <EventPageContent event={t.program.items.tp054k01xg}>
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Sneak peek from the studios</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Image
                src="/assets/TP054K-01xG/Vika-Work-In-Progress.jpeg"
                alt="Viktorija Galkina — work in progress"
                width={800}
                height={600}
                className="w-full h-auto rounded-lg"
              />
              <Image
                src="/assets/TP054K-01xG/Alina-with-paintings.jpeg"
                alt="Alīna Burlakova — studio"
                width={800}
                height={1000}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </EventPageContent>
      </div>
    </div>
  );
}
