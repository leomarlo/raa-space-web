'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useLanguage } from '@/context/LanguageContext';
import {
  CETURTDIENAS_MONTHS,
  formatDate,
  programItem,
  type Thursday,
} from '@/lib/raaCeturtdienas';

const ACCENT = '#bc6f20';

export default function RaaCeturtdienasPage() {
  const [navOpen, setNavOpen] = useState(false);
  const [openMonths, setOpenMonths] = useState<string[]>(['oktobris']);
  const { t } = useLanguage();
  const c = t.raaCeturtdienas;

  const toggleMonth = (slug: string) =>
    setOpenMonths((open) =>
      open.includes(slug) ? open.filter((s) => s !== slug) : [...open, slug]
    );

  const renderThursday = (th: Thursday) => {
    const event = programItem(t.program.items, th.itemKey);
    return (
      <li
        key={th.iso}
        className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-[#f5f5dc]/15 py-2"
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
  };

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
        <div className="max-w-4xl w-full bg-black/70 p-6 sm:p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-6 text-center">{c.title}</h1>

          <div className="overflow-hidden">
            <div className="w-full mb-4 md:float-right md:w-1/3 md:ml-6 md:mb-2">
              <Image
                src={c.poster}
                alt={c.title}
                width={1587}
                height={2245}
                className="w-full h-auto rounded-lg"
                priority
              />
            </div>
            <p className="text-justify leading-relaxed whitespace-pre-line">
              {c.description}
            </p>
            <p className="mt-3 text-sm font-semibold" style={{ color: ACCENT }}>
              {c.capacity}
            </p>
            <p className="mt-2 text-xs opacity-70">
              {c.pressLabel}:{' '}
              <a
                href={c.pressUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-80"
              >
                {c.pressLinkText}
              </a>
            </p>
          </div>

          {/* Program: a month opens in place, and its name leads to its own page */}
          <section className="mt-10 clear-both">
            <h2 className="text-2xl font-bold">{c.programTitle}</h2>
            <p className="mt-1 mb-4 text-sm opacity-60">{c.programIntro}</p>

            {CETURTDIENAS_MONTHS.map((month) => {
              const isOpen = openMonths.includes(month.slug);
              return (
                <div key={month.slug} className="border-b border-[#f5f5dc]/25">
                  <div className="flex items-center justify-between gap-4 py-3">
                    <Link
                      href={`/raa-ceturtdienas/${month.slug}`}
                      className="text-xl font-bold transition-colors"
                      style={{ color: ACCENT }}
                    >
                      {t.months[month.key].name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleMonth(month.slug)}
                      aria-expanded={isOpen}
                      aria-label={`${t.months[month.key].name} — ${c.programTitle}`}
                      className="rounded border border-current px-3 py-1 text-sm transition-colors hover:bg-[#f5f5dc] hover:text-black"
                    >
                      {isOpen ? '▲' : '▼'}
                    </button>
                  </div>
                  {isOpen && (
                    <ul className="pb-4">
                      {month.thursdays.map(renderThursday)}
                      <li className="pt-3">
                        <Link
                          href={`/raa-ceturtdienas/${month.slug}`}
                          className="text-sm underline hover:opacity-80"
                        >
                          {c.seeMonth} →
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              );
            })}
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-bold mb-3">{c.teamTitle}</h2>
            <ul className="flex flex-col gap-2">
              {c.team.map((person) => (
                <li key={person.name} className="flex flex-wrap items-baseline gap-x-3">
                  {person.instagram ? (
                    <a
                      href={person.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold underline decoration-transparent transition-colors hover:decoration-current"
                      style={{ color: ACCENT }}
                    >
                      {person.name}
                    </a>
                  ) : (
                    <span className="font-bold">{person.name}</span>
                  )}
                  <span className="text-sm opacity-70">{person.role}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-8">
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
