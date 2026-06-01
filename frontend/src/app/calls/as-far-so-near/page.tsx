'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';

export default function AsFarSoNearCallPage() {
  const [navOpen, setNavOpen] = useState(false);
  const { t } = useLanguage();

  const call = t.calls.items.asFarSoNear;
  const isPast = new Date(call.deadline) < new Date();

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
        <div className={`max-w-4xl w-full bg-black/70 p-6 sm:p-8 rounded-lg shadow-lg ${isPast ? 'opacity-60' : ''}`}>
          {isPast && (
            <p className="text-center text-[#8B0000] mb-4 font-semibold">This call is now closed.</p>
          )}
          <h1 className="text-4xl font-bold mb-6 text-center">{call.title}</h1>

          <div className="overflow-hidden">
            {call.image && (
              <div className="w-full mb-4 md:float-right md:w-1/3 md:ml-6 md:mb-2">
                <Image
                  src={call.image}
                  alt={call.title}
                  width={600}
                  height={800}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}
            <div className="text-justify leading-relaxed whitespace-pre-line">
              {call.description}
            </div>
            <div className="clear-both" />
          </div>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            {call.emailAddress && (
              <a
                href={`mailto:${call.emailAddress}`}
                className="inline-block border border-[#f5f5dc] px-6 py-2 text-sm hover:bg-[#f5f5dc] hover:text-black transition-colors"
              >
                {call.emailAddress}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
