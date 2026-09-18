'use client';

import Link from 'next/link';
import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import EventLinks from '@/components/EventLinks';
import EventPageContent from '@/components/EventPageContent';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Page() {
  const [navOpen, setNavOpen] = useState(false);
  const { t } = useLanguage();
  const event = t.program.items.raaCeturtdienasOkt22;

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
        <EventPageContent event={event}>
          <p className="mt-6 text-sm opacity-80">
            {event.when} · {event.location} · {event.price}
          </p>
          <EventLinks event={event} />
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/raa-ceturtdienas"
              className="inline-block rounded border border-current px-4 py-2 transition-colors hover:bg-[#f5f5dc] hover:text-black"
            >
              ← {t.raaCeturtdienas.backToSeries}
            </Link>
            <Link
              href="/raa-ceturtdienas/oktobris"
              className="inline-block rounded border border-current px-4 py-2 transition-colors hover:bg-[#f5f5dc] hover:text-black"
            >
              {t.raaCeturtdienas.seeMonth} →
            </Link>
          </div>
        </EventPageContent>
      </div>
    </div>
  );
}
