'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';

export default function SeriesPage() {
  const [navOpen, setNavOpen] = useState(false);
  const { t } = useLanguage();

  const seriesItems = [
    t.series.items.raaMuseum,
    t.series.items.dialogoAdAbsurdum,
    t.series.items.kabiirijasSalons,
    t.series.items.citizenResearch,
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
            <h1 className="text-4xl font-bold mb-6 text-center">{t.series.title}</h1>
            <div className="text-justify leading-relaxed whitespace-pre-line">
              {t.series.description}
            </div>
            <br />
            <div className="flex flex-col gap-6">
              {seriesItems.map((item) => (
                <div key={item.id} className="flex flex-row gap-4 items-start">
                  <div className="w-1/4 shrink-0">
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <div className="relative w-full aspect-square">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </a>
                    ) : (
                      <div className="relative w-full aspect-square">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>
                  <div className="w-3/4 flex flex-col gap-2">
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <p className="text-sm">{item.description}</p>
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
