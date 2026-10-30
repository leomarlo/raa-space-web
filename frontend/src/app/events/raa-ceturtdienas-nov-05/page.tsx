'use client';

import Image from 'next/image';
import Link from 'next/link';
import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import EventPageContent from '@/components/EventPageContent';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const themeImage = { src: '/assets/raa-ceturtdienas-nov-05/theme.jpg', width: 1080, height: 1350 };

export default function Page() {
  const [navOpen, setNavOpen] = useState(false);
  const { t } = useLanguage();
  const event = t.program.items.raaCeturtdienasNov05;

  // Two copies of the same ticket button: one near the title, one at the end
  // of the Instagram row below.
  const pillClass =
    'px-4 py-2 border border-[#f5f5dc] text-[#f5f5dc] rounded-full hover:bg-[#f5f5dc] hover:text-black transition';
  const ticketPillClass =
    'px-4 py-2 border-2 border-[#8B0000] bg-[#8B0000]/40 text-[#f5f5dc] rounded-full hover:bg-[#8B0000] transition';
  const buyTicketsButton = event.externalLink && (
    <a href={event.externalLink} target="_blank" rel="noopener noreferrer" className={ticketPillClass}>
      {event.externalLinkText || 'Tickets'}
    </a>
  );

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
        <EventPageContent event={event} titleAction={buyTicketsButton}>
          <p className="mt-6 text-sm opacity-80">
            {event.when} · {event.location} · {event.price}
          </p>
          <div className="flex flex-wrap gap-4 mt-6 justify-center">
            {event.instaLink && (
              <a href={event.instaLink} target="_blank" rel="noopener noreferrer" className={pillClass}>
                Instagram
              </a>
            )}
            {buyTicketsButton}
          </div>
          <div className="mt-6 flex justify-center">
            <Image
              src={themeImage.src}
              alt={event.title}
              width={themeImage.width}
              height={themeImage.height}
              className="w-full sm:w-2/3 h-auto rounded-lg"
            />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/raa-ceturtdienas"
              className="inline-block rounded border border-current px-4 py-2 transition-colors hover:bg-[#f5f5dc] hover:text-black"
            >
              ← {t.raaCeturtdienas.backToSeries}
            </Link>
            <Link
              href="/raa-ceturtdienas/novembris"
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
