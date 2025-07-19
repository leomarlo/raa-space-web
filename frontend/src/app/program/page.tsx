'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ProgramItem } from '@/types/program';
import CalendarView from '@/components/CalendarView';
import ProgramListView from '@/components/ProgramListView';

export default function ProgramPage() {
  const [navOpen, setNavOpen] = useState(false);
  const [view, setView] = useState<'list' | 'calendar'>('calendar');
  const { t } = useLanguage();

  const startDate = new Date('2025-07-01T00:00:00Z');
  const endDate = new Date('2025-09-01T23:59:59Z');

  const programItems: ProgramItem[] = Object.values(t.program.items).sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

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
            <CalendarView items={programItems} startDate={startDate} endDate={endDate} />
          )}
        </div>
      </div>
    </div>
  );
}
