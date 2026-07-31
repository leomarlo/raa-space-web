'use client';

import Entrance from '@/components/Entrance';
import EventLinks from '@/components/EventLinks';
import EventPageContent from '@/components/EventPageContent';
import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import { useLanguage } from '@/context/LanguageContext';
import { useState } from 'react';

export default function FotoklubsPhotoExhibitionPage() {
  const [navOpen, setNavOpen] = useState(false);
  const { t } = useLanguage();
  const event = t.program.items.fotoklubsPhotoExhibition;
  const eventForPage = {
    ...event,
    image: '/assets/fotoklubs-photo-exhibition/poster-mid.png',
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
        <EventPageContent event={eventForPage}>
          <EventLinks event={event} />
        </EventPageContent>
      </div>
    </div>
  );
}
