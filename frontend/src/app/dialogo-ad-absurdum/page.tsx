'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ProgramItem } from '@/types/program';
import Image from 'next/image';

export default function DialogoAdAbsurdumPage() {
  const [navOpen, setNavOpen] = useState(false);
  const { t } = useLanguage();

  const series = t.series.items.dialogoAdAbsurdum;

  const dialogoAdAbsurdumEvents: ProgramItem[] = [
    t.program.items.raaOpening,
    t.program.items.theatreOpening,
    t.program.items.kabiirijasSalons1,
  ];

  return (
    <div className="relative w-full min-h-screen">
      {/* Background effect */}
      <div className="absolute inset-0 -z-20">
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
        {/* Centered black panel */}
        <div className="relative max-w-4xl w-full rounded-lg shadow-lg text-[#f5f5dc]">
          <div className="absolute inset-0 bg-black rounded-lg" aria-hidden />
          <div className="relative z-10 p-6 sm:p-8">
            <h1 className="text-4xl font-bold mb-6 text-center">{series.title}</h1>
            <div className="text-justify leading-relaxed whitespace-pre-line">
              {series.description}
            </div>
            <br />
            <h2 className="text-2xl font-bold mb-4 text-center">{series.events}</h2>
            <div className="flex flex-col gap-4">
              {dialogoAdAbsurdumEvents.map((event) => (
                <div key={event.id} className="flex flex-row gap-4">
                  <div className="w-1/4">
                  <a href={event.url} target="_blank" rel="noopener noreferrer">
                  <Image 
                    src={event.image} 
                    alt={event.title} 
                    className="w-auto h-48"
                    width={100} 
                    height={100} 
                    />
                    </a>
                  </div>
                  <div className="w-3/4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold">{event.title}</h3>
                    <p className="text-sm">{event.description}</p>
                  </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
