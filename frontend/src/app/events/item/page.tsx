'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import EventPageContent from '@/components/EventPageContent';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

type EventRow = {
  date: string;
  title: string;
  coreTime: string;
  interventionTime: string;
  artists: { displayName: string; nationality: string }[];
  pageUrl: string;
  slug: string;
  revealed: boolean;
};

export default function ItemPage() {
  const [navOpen, setNavOpen] = useState(false);
  const { t } = useLanguage();

  const events = t.program.features.item.events as EventRow[];

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

          {/* Programme rows */}
          <div className="mt-8 mb-2">
            <h2 className="text-xs uppercase tracking-widest text-[#f5f5dc]/70 mb-3">
              Programme
            </h2>
            {/* Header row */}
            <div className="hidden sm:grid sm:grid-cols-[7rem_1fr_9rem_7rem] gap-x-3 pb-1 mb-2 border-b border-[#f5f5dc]/35 text-[10px] uppercase tracking-widest text-[#f5f5dc]/65">
              <span>Date</span>
              <span>Performance</span>
              <span>Performance time</span>
              <span>Group visit</span>
            </div>
            <div>
              {events.map((event, i) => {
                const rowRevealed = (event as unknown as { revealed: boolean }).revealed;
                return (
                  <div
                    key={i}
                    onClick={() => {
                      if (!rowRevealed) {
                        alert('Performances will be revealed on the 26th of June.');
                        return;
                      }
                      if (event.pageUrl) window.location.href = event.pageUrl;
                    }}
                    className={`grid grid-cols-1 sm:grid-cols-[7rem_1fr_9rem_7rem] gap-x-3 gap-y-0.5 py-3 border-b border-[#f5f5dc]/25 hover:bg-[#f5f5dc]/5 px-1 -mx-1 transition-colors group cursor-pointer ${
                      !rowRevealed ? 'blur-[3px] select-none pointer-events-none' : ''
                    }`}
                  >
                    {/* Date */}
                    <span className="text-sm font-medium text-[#f5f5dc]/90 tabular-nums whitespace-nowrap">
                      {event.date}
                    </span>
                    {/* Title + artists */}
                    <span className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                      <span className="text-sm font-semibold group-hover:text-white transition-colors">
                        {event.title}
                      </span>
                      <span className="text-xs text-[#f5f5dc]/65">
                        {event.artists.map((a, j) => (
                          <span key={j}>
                            {a.displayName}{' '}
                            <span className="text-[#f5f5dc]/45">({a.nationality})</span>
                            {j < event.artists.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </span>
                    </span>
                    {/* Core time */}
                    <span className="text-xs text-[#f5f5dc]/75 tabular-nums whitespace-nowrap sm:pt-0.5">
                      {event.coreTime || 'All day'}
                    </span>
                    {/* Group visit (intervention) time — separate link */}
                    <span className="text-xs tabular-nums whitespace-nowrap sm:pt-0.5" onClick={(e) => e.stopPropagation()}>
                      <a
                        href="/item/intervention-registration"
                        className="text-[#f5f5dc]/75 underline decoration-dotted hover:text-[#f5f5dc] transition-colors"
                      >
                        {event.interventionTime || '—'}
                      </a>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Intervention registration button */}
          {t.program.items.item.externalLink && (
            <div className="mt-6 text-center">
              <a
                href={t.program.items.item.externalLink}
                rel="noopener noreferrer"
                className="inline-block border border-[#f5f5dc]/50 text-[#f5f5dc]/70 px-6 py-2 text-sm tracking-wide hover:border-[#f5f5dc] hover:text-[#f5f5dc] transition-colors"
              >
                Register for a scheduled group visit to the performance
              </a>
            </div>
          )}
        </EventPageContent>
      </div>
    </div>
  );
}
