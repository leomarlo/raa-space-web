'use client';

import { useState } from 'react';
import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactPage() {
  const [navOpen, setNavOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <RaaHieroglyphMatrix frequency={0} initialState={0} />
      {navOpen && (
        <div className="absolute inset-0 bg-black/70 z-30 pointer-events-auto" />
      )}
      <Entrance
        initialMenuSelection={'Contact'}
        itemArrangement={2}
        navOpen={navOpen}
        setNavOpen={setNavOpen}
      />
      
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="max-w-lg bg-black/90 text-[#f5f5dc] text-lg p-8 rounded-lg text-justify pointer-events-auto">
          <p className="mb-4">
            {t.contact.email} <a href="mailto:enter@raa.space" className="underline">enter@raa.space</a>.
          </p>
          <p className="mb-4">{t.contact.location}</p>
          <p>
            {t.contact.instagram}{' '}
            <a
              href="https://www.instagram.com/raa_riga/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              @raa_riga
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
