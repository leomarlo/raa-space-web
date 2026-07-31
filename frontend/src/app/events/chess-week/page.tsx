'use client';

import Entrance from '@/components/Entrance';
import EventPageContent from '@/components/EventPageContent';
import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { useState } from 'react';

type ChessWeekEvent = {
  time: string;
  title: string;
  details: string;
  pageUrl: string;
  registrationUrl: string;
  registrationLabel: string;
};

type ChessWeekDay = {
  date: string;
  day: string;
  pageUrl: string;
  events: ChessWeekEvent[];
};

export default function ChessWeekPage() {
  const [navOpen, setNavOpen] = useState(false);
  const { locale, t } = useLanguage();
  const days = t.program.features.chessWeek.days as ChessWeekDay[];
  const eventForPage = t.program.items.raaChessWeek;

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
        <EventPageContent event={eventForPage}>
          <div className="mt-8 bg-black rounded-lg p-4 sm:p-5">
            <p className="text-xs uppercase tracking-widest text-[#f5f5dc]/60 mb-4">
              {locale === 'lat' ? 'Programma' : 'Programme'}
            </p>

            {days.map((day) => (
              <section key={day.date} className="mb-7 last:mb-0">
                <div className="flex items-baseline gap-3 pb-2 mb-1 border-b border-[#f5f5dc]/40">
                  {day.pageUrl ? (
                    <Link
                      href={day.pageUrl}
                      className="font-bold underline decoration-dotted underline-offset-4 hover:text-white"
                    >
                      {day.day}
                    </Link>
                  ) : (
                    <h2 className="font-bold">{day.day}</h2>
                  )}
                  <span className="text-sm text-[#f5f5dc]/60">{day.date}</span>
                </div>

                {day.events.map((event) => (
                  <div
                    key={`${day.date}-${event.time}-${event.title}`}
                    className="grid grid-cols-[6.5rem_1fr] gap-x-3 py-3 border-b border-[#f5f5dc]/20 last:border-b-0"
                  >
                    <span className="text-sm tabular-nums text-[#f5f5dc]/70">
                      {event.time}
                    </span>
                    <div>
                      {event.pageUrl ? (
                        <Link
                          href={event.pageUrl}
                          className="font-semibold underline decoration-dotted underline-offset-4 hover:text-white"
                        >
                          {event.title}
                        </Link>
                      ) : (
                        <p className="font-semibold">{event.title}</p>
                      )}
                      {event.details && (
                        <p className="mt-1 text-sm text-[#f5f5dc]/65">{event.details}</p>
                      )}
                      {event.registrationLabel && (
                        event.registrationUrl ? (
                          <a
                            href={event.registrationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-2 border border-[#f5f5dc]/60 px-3 py-1 text-xs hover:bg-[#f5f5dc] hover:text-black transition-colors"
                          >
                            {event.registrationLabel}
                          </a>
                        ) : (
                          <span className="inline-block mt-2 border border-[#f5f5dc]/25 px-3 py-1 text-xs text-[#f5f5dc]/50">
                            {event.registrationLabel}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </section>
            ))}
          </div>
        </EventPageContent>
      </div>
    </div>
  );
}
