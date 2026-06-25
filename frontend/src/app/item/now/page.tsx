'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';

type Artist = {
  displayName: string;
  image?: string;
  ig?: string;
  url?: string;
  nationality: string;
};

type ItemEvent = {
  date: string;
  title: string;
  description: string;
  bio: string;
  artists: Artist[];
  registrationUrl: string;
  interventionTime: string;
  coreTime: string;
  themeImage: string;
  instagramPost: string;
  pageUrl: string;
  slug: string;
  revealed: boolean;
};

const REGISTRATION_OPENS = new Date('2026-06-26T00:00:00');

export default function NowPage() {
  const [navOpen, setNavOpen] = useState(false);
  const { t } = useLanguage();

  const allEvents = t.program.features.item.events as ItemEvent[];
  const event = allEvents.find((e) => e.slug === 'now')!;

  function handleRegisterClick(ev: React.MouseEvent<HTMLAnchorElement>) {
    if (new Date() < REGISTRATION_OPENS) {
      ev.preventDefault();
      alert('Registration opens on the 26th of June.');
    }
  }

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

          {/* Header */}
          <p className="text-xs text-[#f5f5dc]/50 text-center mb-2 tracking-widest uppercase">
            ITEM — Shuffled Time &nbsp;·&nbsp; {event.date} &nbsp;·&nbsp; {event.interventionTime}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-center">{event.title}</h1>
          <p className="text-center text-sm text-[#f5f5dc]/70 mb-8">
            {event.artists.map((a, i) => (
              <span key={i}>
                {a.ig ? (
                  <a
                    href={`https://www.instagram.com/${a.ig}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-[#f5f5dc] transition-colors"
                  >
                    {a.displayName}
                  </a>
                ) : a.url ? (
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-[#f5f5dc] transition-colors"
                  >
                    {a.displayName}
                  </a>
                ) : (
                  a.displayName
                )}
                {' '}({a.nationality}){i < event.artists.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>

          {/* Main image + description */}
          <div className="overflow-hidden mb-8">
            <div className="mb-4 md:float-right md:w-2/5 md:ml-6 md:mb-2">
              <Image
                src={event.themeImage}
                alt={event.title}
                width={540}
                height={675}
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div className="text-[#f5f5dc]/90 leading-relaxed whitespace-pre-line">
              {event.description}
            </div>
            <div className="clear-both" />
          </div>

          {/* Artist bio */}
          {event.bio && (
            <div className="border-t border-[#f5f5dc]/20 pt-6 mb-8">
              <h2 className="text-xs uppercase tracking-widest text-[#f5f5dc]/50 mb-3">
                About the artist
              </h2>
              <div className="text-[#f5f5dc]/75 leading-relaxed whitespace-pre-line text-sm">
                {event.bio}
              </div>
            </div>
          )}

          {/* Bottom links */}
          <div className="border-t border-[#f5f5dc]/20 pt-6 flex flex-wrap gap-3 justify-center">
            {event.instagramPost && (
              <a
                href={event.instagramPost}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-[#f5f5dc] px-5 py-2 text-sm hover:bg-[#f5f5dc] hover:text-black transition-colors"
              >
                Instagram Post
              </a>
            )}
            <Link
              href="/events/item"
              className="inline-block border border-[#f5f5dc] px-5 py-2 text-sm hover:bg-[#f5f5dc] hover:text-black transition-colors"
            >
              ITEM — Shuffled Time
            </Link>
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleRegisterClick}
              className="inline-block bg-[#8B0000] border border-[#8B0000] text-[#f5f5dc] px-5 py-2 text-sm font-bold hover:bg-[#a00000] hover:border-[#a00000] transition-colors"
            >
              Register for this intervention
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
