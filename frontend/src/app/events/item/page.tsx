'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import EventPageContent from '@/components/EventPageContent';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

type EventRow = {
  date: string;
  title: string;
  artists: { displayName: string; nationality: string }[];
  pageUrl: string;
  slug: string;
};

const REVEAL_DATE = new Date('2026-06-27T00:00:00');

function handleRowClick(e: React.MouseEvent, pageUrl: string) {
  if (new Date() < REVEAL_DATE) {
    e.preventDefault();
    alert('Performances will be revealed on the 26th of June.');
    return;
  }
  if (!pageUrl) {
    e.preventDefault();
  }
}

export default function ItemPage() {
  const [navOpen, setNavOpen] = useState(false);
  const { t } = useLanguage();

  const events = t.program.features.item.events as EventRow[];
  const revealed = new Date() >= REVEAL_DATE;

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
        <EventPageContent event={t.program.items.item}>

          {/* Program rows */}
          <div className="mt-8 mb-2">
            <h2 className="text-xs uppercase tracking-widest text-[#f5f5dc]/50 mb-3">
              Program
            </h2>
            <div>
              {events.map((event, i) => (
                <a
                  key={i}
                  href={event.pageUrl || '#'}
                  onClick={(e) => handleRowClick(e, event.pageUrl)}
                  className={`flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3 py-2.5 border-b border-[#f5f5dc]/15 hover:bg-[#f5f5dc]/5 px-1 -mx-1 transition-colors group cursor-pointer ${
                    !revealed && !(event as unknown as { revealed: boolean }).revealed
                      ? 'blur-[3px] select-none'
                      : ''
                  }`}
                >
                  <span className="text-xs text-[#f5f5dc]/45 w-24 flex-shrink-0 tabular-nums">
                    {event.date}
                  </span>
                  <span className="text-sm font-semibold group-hover:text-white transition-colors">
                    {event.title}
                  </span>
                  <span className="text-xs text-[#f5f5dc]/55 sm:ml-auto">
                    {event.artists.map((a, j) => (
                      <span key={j}>
                        {a.displayName}{' '}
                        <span className="text-[#f5f5dc]/35">({a.nationality})</span>
                        {j < event.artists.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Intervention registration button */}
          {t.program.items.item.externalLink && (
            <div className="mt-6 text-center">
              <a
                href={t.program.items.item.externalLink}
                rel="noopener noreferrer"
                className="inline-block bg-[#8B0000] border border-[#8B0000] text-[#f5f5dc] px-8 py-3 text-base font-bold tracking-wide hover:bg-[#a00000] hover:border-[#a00000] transition-colors"
              >
                {t.program.items.item.externalLinkText}
              </a>
            </div>
          )}
        </EventPageContent>
      </div>
    </div>
  );
}
