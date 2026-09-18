'use client';

import { useState } from 'react';
import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import PersonCard from '@/components/PersonCard';
import { useLanguage } from '@/context/LanguageContext';
import Person from '@/types/person';

export default function ContactPage() {
  const [navOpen, setNavOpen] = useState(false);
  const { t } = useLanguage();

  const teamItems = Object.values(t.team);

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

      <div className="absolute inset-0 z-10 overflow-auto py-20 px-4 sm:px-8 pointer-events-auto flex justify-center">
        <div className="max-w-4xl w-full">
          {/* Contact details first */}
          <div className="bg-black/90 text-[#f5f5dc] text-lg p-8 rounded-lg text-justify mb-12">
            <p className="mb-4">
              {t.contact.email}{' '}
              <a href="mailto:enter@raa.space" className="underline">
                enter@raa.space
              </a>
              .
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

          {/* then the whole team; /team keeps showing the same cards on its own */}
          <h2 className="text-3xl font-bold text-[#f5f5dc] mb-6">{t.menu.team}</h2>
          {teamItems.map((person: Person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      </div>
    </div>
  );
}
