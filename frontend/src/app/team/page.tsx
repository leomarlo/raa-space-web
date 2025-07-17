'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import PersonCard from '@/components/PersonCard';
import Person from '@/types/person';

export default function TeamPage() {
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
        initialMenuSelection={'Curators'}
        itemArrangement={2}
        navOpen={navOpen}
        setNavOpen={setNavOpen}
      />
      <div className="absolute inset-0 z-10 overflow-auto py-20 px-4 sm:px-8 pointer-events-auto flex justify-center">
        <div className="max-w-4xl w-full">
          {teamItems.map((person: Person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      </div>
    </div>
  );
}
