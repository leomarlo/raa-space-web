'use client';

import Image from 'next/image';
import Link from 'next/link';
import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import EventPageContent from '@/components/EventPageContent';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const galleryImages = [
  { src: '/assets/raa-ceturtdienas-okt-01/mes-group.jpg', width: 1600, height: 1200 },
  { src: '/assets/raa-ceturtdienas-okt-01/annija.jpg', width: 1400, height: 1867 },
];

export default function Page() {
  const [navOpen, setNavOpen] = useState(false);
  const { t } = useLanguage();
  const event = t.program.items.raaCeturtdienasOkt01;

  // Two copies of the same ticket button: one near the title, one at the end
  // of the Instagram row below. Built by hand (rather than via EventLinks) so
  // the two links can share a single row with Tickets on the right.
  const pillClass =
    'px-4 py-2 border border-[#f5f5dc] text-[#f5f5dc] rounded-full hover:bg-[#f5f5dc] hover:text-black transition';
  const ticketPillClass =
    'px-4 py-2 border-2 border-[#8B0000] text-[#f5f5dc] rounded-full hover:bg-[#8B0000] transition';
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {galleryImages.map((img) => (
              <Image
                key={img.src}
                src={img.src}
                alt={event.title}
                width={img.width}
                height={img.height}
                className="w-full h-auto rounded-lg"
              />
            ))}
          </div>
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
