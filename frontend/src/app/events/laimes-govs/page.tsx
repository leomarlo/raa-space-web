'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';

export default function LaimesGovsPage() {
  const [navOpen, setNavOpen] = useState(false);
  const { t } = useLanguage();

  const event = t.program.items.laimesGovs;

  return (
    <div className="relative w-full min-h-screen text-[#f5f5dc]">
      {/* Background effect */}
      <div className="absolute inset-0 -z-10">
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

      {/* Content area */}
      <div className="relative z-10 py-20 px-4 sm:px-8 pointer-events-auto flex justify-center">
        <div className="max-w-4xl w-full bg-black/70 p-6 sm:p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-6 text-center">
            {event.title}
          </h1>

          {/* Poster */}
          <div className="mb-6 flex justify-center">
            <Image
              src="/assets/laimes-govs/poster.jpg"
              alt="Laimes Govs poster"
              width={600}
              height={800}
              className="rounded-lg max-w-full"
              unoptimized
            />
          </div>

          <div className="text-justify leading-relaxed whitespace-pre-line">
            {event.description}
          </div>

          {/* Price */}
          {event.price && (
            <div className="mt-6 leading-relaxed whitespace-pre-line">
              {event.price}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
