'use client';

import Link from 'next/link';
import { useState } from 'react';
import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useLanguage } from '@/context/LanguageContext';
import { formatDate, monthBySlug, programItem } from '@/lib/raaCeturtdienas';

const ACCENT = '#bc6f20';

/** One month of the RAA Ceturtdienas series: every Thursday it holds. */
export default function CeturtdienasMonthPage({ slug }: { slug: string }) {
  const [navOpen, setNavOpen] = useState(false);
  const { t } = useLanguage();
  const c = t.raaCeturtdienas;
  const month = monthBySlug(slug);

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
        <div className="max-w-3xl w-full bg-black/70 p-6 sm:p-8 rounded-lg shadow-lg">
          <p className="text-sm opacity-60">{c.title}</p>
          <h1 className="text-4xl font-bold mb-6">
            {month ? t.months[month.key].name : c.title}
          </h1>

          {month && (
            <ul className="flex flex-col">
              {month.thursdays.map((th) => {
                const event = programItem(t.program.items, th.itemKey);
                return (
                  <li
                    key={th.iso}
                    className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-[#f5f5dc]/20 py-3"
                  >
                    <span className="w-24 shrink-0 font-mono text-sm opacity-70">
                      {formatDate(th.iso)}
                    </span>
                    {event && th.slug ? (
                      <Link
                        href={`/events/${th.slug}`}
                        className="underline decoration-transparent transition-colors hover:decoration-current"
                        style={{ color: ACCENT }}
                      >
                        {event.title}
                      </Link>
                    ) : (
                      <span className="text-sm italic opacity-50">{c.noEvent}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/raa-ceturtdienas"
              className="inline-block rounded border border-current px-4 py-2 transition-colors hover:bg-[#f5f5dc] hover:text-black"
            >
              ← {c.backToSeries}
            </Link>
            <Link
              href="/program"
              className="inline-block rounded border border-current px-4 py-2 transition-colors hover:bg-[#f5f5dc] hover:text-black"
            >
              {c.allEvents} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
