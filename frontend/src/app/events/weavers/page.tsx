'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';

export default function WeaversPage() {
  const [navOpen, setNavOpen] = useState(false);
  const { t } = useLanguage();

  const event = t.program.items.weavers;

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
          {/* Event Title */}
          <h1 className="text-4xl font-bold mb-6 text-center">
            {event.title}
          </h1>

          {/* Poster */}
          <div className="mb-6 flex justify-center">
            <Image
              src="/assets/weavers/poster.png"
              alt="Weavers poster"
              width={600}
              height={900}
              className="rounded-lg max-w-full"
              unoptimized
            />
          </div>

          {/* Event Description */}
          <div className="text-justify leading-relaxed whitespace-pre-line">
            {event.description}
          </div>

          {/* Link to Dialogo performance */}
          <div className="mt-8 pt-6 border-t border-[#f5f5dc]/20">
            <Link
              href="/events/dialogo-ad-infinitum"
              className="flex items-center gap-3 group"
            >
              <span className="text-[#f5f5dc]/50 group-hover:text-[#f5f5dc] transition-colors text-sm tracking-widest uppercase">
                Performance
              </span>
              <span className="text-xl font-bold group-hover:text-white transition-colors">
                Dialogo ad Infinitum →
              </span>
            </Link>
            <p className="mt-1 text-sm text-[#f5f5dc]/50">by Leonhard Marlo · 20:00</p>
          </div>
        </div>
      </div>
    </div>
  );
}
