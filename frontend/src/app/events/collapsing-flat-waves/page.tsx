'use client';

import Image from 'next/image';
import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import EventLinks from '@/components/EventLinks';
import EventPageContent from '@/components/EventPageContent';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const galleryImages = [
  '/assets/collapsing-flat-waves/poster-1.jpg',
];

export default function CollapsingFlatWavesPage() {
  const [navOpen, setNavOpen] = useState(false);
  const { t, locale } = useLanguage();

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
        <EventPageContent event={t.program.items.collapsingFlatWaves}>
          <EventLinks event={t.program.items.collapsingFlatWaves} />
          <div className="grid grid-cols-1 gap-4 mt-6">
            {galleryImages.map((src) => (
              <Image
                key={src}
                src={src}
                alt={t.program.items.collapsingFlatWaves.title}
                width={1922}
                height={2560}
                className="w-full h-auto rounded-lg"
              />
            ))}
          </div>

          {/* Exhibition text / floor plan, as a PDF */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-3">
              {locale === 'lat' ? 'Izstādes teksts' : 'Exhibition text'}
            </h2>
            <iframe
              src="/assets/collapsing-flat-waves/Collapsing-Flat-Waves-Text.pdf"
              className="w-full rounded-lg shadow-md"
              style={{ height: '80vh' }}
              title={
                locale === 'lat'
                  ? 'Collapsing Flat Waves — izstādes teksts'
                  : 'Collapsing Flat Waves — exhibition text'
              }
            />
            <a
              href="/assets/collapsing-flat-waves/Collapsing-Flat-Waves-Text.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sm underline hover:opacity-80"
            >
              {locale === 'lat' ? 'Atvērt PDF jaunā cilnē ↗' : 'Open PDF in a new tab ↗'}
            </a>
          </div>
        </EventPageContent>
      </div>
    </div>
  );
}
