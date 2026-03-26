'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function DialogoAdInfinitumPage() {
  const [navOpen, setNavOpen] = useState(false);
  const { t } = useLanguage();

  const event = t.program.items.dialogoAdInfinitum;

  return (
    <div className="relative w-full min-h-screen text-[#f5f5dc]">
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

      <div className="relative z-10 py-20 px-4 sm:px-8 pointer-events-auto flex justify-center">
        <div className="max-w-2xl w-full bg-black/80 p-8 sm:p-12 rounded-lg shadow-lg flex flex-col gap-8">

          <div className="text-sm tracking-widest uppercase text-[#f5f5dc]/50">
            Performance — 26 March 2026
          </div>

          <h1 className="text-4xl font-bold leading-tight">
            {event.title}
          </h1>

          <div className="text-sm tracking-wide text-[#f5f5dc]/60 -mt-4">
            by Leonhard Marlo
          </div>

          <div className="leading-relaxed text-lg whitespace-pre-line">
            {event.description}
          </div>

          <div className="border-t border-[#f5f5dc]/20 pt-6">
            <Link
              href="/events/weavers"
              className="text-sm tracking-wide text-[#f5f5dc]/50 hover:text-[#f5f5dc] transition-colors"
            >
              ← Part of the Weavers exhibition
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
