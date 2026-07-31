'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ProgramItem } from '@/types/program';
import CalendarView from '@/components/CalendarView';
import ProgramListView from '@/components/ProgramListView';

export default function ProgramPageClient() {
  const [navOpen, setNavOpen] = useState(false);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const { t } = useLanguage();

  const startDate = new Date('2025-07-01T00:00:00Z');
  const endDate = new Date('2026-10-31T23:59:59Z');

  const programItems: ProgramItem[] = Object.values(t.program.items).sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  // Calendar: instead of one ITEM block spanning the whole week, place each
  // festival performance on its own day. These are synthesized from the
  // existing sub-event data (no description duplication) and link to /item/<slug>.
  type ItemSubEvent = {
    title: string;
    date: string; // "06.07.2026"
    themeImage: string;
    pageUrl: string;
    slug: string;
  };
  const itemSubEvents: ProgramItem[] = (
    t.program.features.item.events as unknown as ItemSubEvent[]
  ).map((e) => {
    const [dd, mm, yyyy] = e.date.split('.');
    const iso = `${yyyy}-${mm}-${dd}T00:00:00Z`;
    return {
      id: `item-${e.slug}`,
      image: e.themeImage,
      title: e.title,
      url: e.pageUrl,
      startDate: iso,
      endDate: iso,
      color: '7',
      location: '',
      shortDescription: '',
      when: '',
      instaLink: '',
      fbLink: '',
      registrationLink: '',
      price: '',
      description: '',
      showTextOverThumbnail: 0,
      registerPage: '',
      externalLink: '',
      externalLinkText: '',
    };
  });

  // Drop the week-spanning umbrella ITEM entry from the calendar and use the
  // per-day performances instead. The list view keeps the umbrella entry.
  const calendarItems: ProgramItem[] = [
    ...programItems.filter((p) => p.id !== t.program.items.item.id),
    ...itemSubEvents,
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <RaaHieroglyphMatrix frequency={0} initialState={0} />
      {navOpen && <div className="absolute inset-0 bg-black/70 z-30 pointer-events-auto" />}
      <Entrance initialMenuSelection={'Program'} itemArrangement={2} navOpen={navOpen} setNavOpen={setNavOpen} />

      {/* Toggle Button */}
      <div
        className="
          fixed z-40 flex gap-2 bg-black border border-[#8B0000] px-4 py-2 rounded-full text-[#f5f5dc]
          left-1/2 -translate-x-1/2
          sm:top-4 sm:bottom-auto
          top-auto bottom-4
        "
      >
        <button
          onClick={() => setView('list')}
          className={`px-3 py-1 rounded-full transition ${view === 'list' ? 'bg-[#8B0000] text-white' : ''}`}
        >
          {t.calendarToggle.list}
        </button>
        <button
          onClick={() => setView('calendar')}
          className={`px-3 py-1 rounded-full transition ${view === 'calendar' ? 'bg-[#8B0000] text-white' : ''}`}
        >
          {t.calendarToggle.calendar}
        </button>
      </div>

      {/* Content */}
      <div className="absolute inset-0 z-10 overflow-auto py-20 px-4 sm:px-8 pointer-events-auto flex justify-center">
        <div className="max-w-5xl w-full">
          {view === 'list' ? (
            <ProgramListView items={programItems} />
          ) : (
            <CalendarView items={calendarItems} startDate={startDate} endDate={endDate} />
          )}
        </div>
      </div>
    </div>
  );
}
