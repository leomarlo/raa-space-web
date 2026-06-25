'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';

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

function handleRegisterClick(e: React.MouseEvent<HTMLAnchorElement>) {
  if (new Date() < REGISTRATION_OPENS) {
    e.preventDefault();
    alert('Registration opens on the 26th of June.');
  }
}

export default function InterventionRegistrationPage() {
  const [navOpen, setNavOpen] = useState(false);
  const { t } = useLanguage();

  const feature = t.program.features.item;
  const events = feature.events as ItemEvent[];

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
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center">{feature.title}</h1>
          <p className="text-center mb-8 text-[#f5f5dc]/75 leading-relaxed whitespace-pre-line text-sm sm:text-base">
            {feature.description}
          </p>

          <div>
            <hr className="border-[#f5f5dc]/30" />
            {events.map((event, index) => (
              <div key={index}>
                <div
                  className={`py-6 transition-all duration-300 ${
                    !event.revealed ? 'blur-[3px] select-none pointer-events-none' : ''
                  }`}
                >
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Theme image */}
                    <div className="flex-shrink-0 w-full sm:w-36">
                      <div className="relative h-44 w-full">
                        <Image
                          src={event.themeImage}
                          alt={event.title}
                          fill
                          className="object-cover rounded"
                          sizes="(max-width: 640px) 100vw, 144px"
                        />
                      </div>
                    </div>

                    {/* Event info */}
                    <div className="flex-1 flex flex-col justify-between gap-3">
                      <div>
                        <p className="text-xs text-[#f5f5dc]/55 mb-1 tracking-wide">
                          {event.date} · {event.interventionTime}
                          {event.coreTime ? ` · Core: ${event.coreTime}` : ''}
                        </p>
                        <h2 className="text-xl font-bold mb-2">{event.title}</h2>
                        <p className="text-sm text-[#f5f5dc]/75">
                          {event.artists.map((a, i) => (
                            <span key={i}>
                              {a.displayName}{' '}
                              <span className="text-[#f5f5dc]/45 text-xs">({a.nationality})</span>
                              {i < event.artists.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </p>
                      </div>

                      {/* Register button */}
                      <div>
                        <a
                          href={event.registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={handleRegisterClick}
                          className="inline-block border border-[#f5f5dc] px-4 py-2 text-xs sm:text-sm hover:bg-[#f5f5dc] hover:text-black transition-colors"
                        >
                          Register for &ldquo;{event.title}&rdquo; on {event.date}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="border-[#f5f5dc]/30" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
