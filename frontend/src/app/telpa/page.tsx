'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';

export default function TelpaPage() {
  const [navOpen, setNavOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="relative w-full min-h-screen text-[#f5f5dc]">
      {/* Background effect */}
      <div className="absolute inset-0 -z-10">
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

      {/* Content area */}
      <div className="relative z-10 py-20 px-4 sm:px-8 pointer-events-auto flex justify-center">
        <div className="max-w-4xl w-full bg-black p-6 sm:p-8 rounded-lg shadow-lg space-y-6">
          {/* Page Title */}
          <h1 className="text-4xl font-bold text-center">
            {t.telpa.title}
          </h1>

          {/* Paragraphs */}
          <p className="text-justify leading-relaxed">{t.telpa.paragraph1}</p>
          <p className="text-justify leading-relaxed">{t.telpa.paragraph2}</p>

          {/* Instagram Link */}
          <p>
            {t.telpa.findUsOnInstagram}{' '}
            <a 
              href="https://www.instagram.com/raa_riga/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="underline text-[#f5f5dc] hover:text-white"
            >
              {t.telpa.instagram}
            </a>
          </p>
          <h2 className="text-2xl font-bold text-center">
            {t.telpa.layoutTitle}
          </h2>

          <p className="text-justify leading-relaxed">{t.telpa.layoutDescription}</p>
                    {/* Image */}
                    <Image 
            src="/assets/telpa/layout.jpeg" 
            alt="Telpa" 
            className="w-full h-auto rounded-lg shadow-md"
            width={1000}
            height={1000}
          />
          <h2 id="map" className="text-2xl font-bold text-center">{t.telpa.mapTitle}</h2>
          <p className="text-justify leading-relaxed">{t.telpa.mapDescription}</p>
          <Image 
            src="/assets/telpa/map-with-arrow.png" 
            alt="Telpa" 
            className="w-full h-auto rounded-lg shadow-md"
            width={1000}
            height={1000}
          />
        </div>
      </div>
    </div>
  );
}
