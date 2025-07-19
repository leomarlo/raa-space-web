'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import ProgramCard from '@/components/ProgramCard';
import {ProgramItem, CalendarViewProps} from '@/types/program';
import CalendarView from '@/components/CalendarView';

export default function ProgramPage() {
  const [navOpen, setNavOpen] = useState(false);
  const [view, setView] = useState<'list' | 'calendar'>('list'); // NEW: toggle state
  const { t } = useLanguage();

  

  // Convert program.items object to array and sort newest -> oldest
  const programItems: ProgramItem[] = Object.values(t.program.items).sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <RaaHieroglyphMatrix frequency={0} initialState={0} />
      {navOpen && (
        <div className="absolute inset-0 bg-black/70 z-30 pointer-events-auto" />
      )}
      <Entrance
        initialMenuSelection={'Program'}
        itemArrangement={2}
        navOpen={navOpen}
        setNavOpen={setNavOpen}
      />

      {/* Fixed Toggle Button */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 flex gap-2 bg-black border border-[#8B0000] px-4 py-2 rounded-full text-[#f5f5dc]">
        <button
          onClick={() => setView('list')}
          className={`px-3 py-1 rounded-full transition ${
            view === 'list' ? 'bg-[#8B0000] text-white' : ''
          }`}
        >
          List View
        </button>
        <button
          onClick={() => setView('calendar')}
          className={`px-3 py-1 rounded-full transition ${
            view === 'calendar' ? 'bg-[#8B0000] text-white' : ''
          }`}
        >
          Calendar View
        </button>
      </div>

      {/* Main Content Area */}
      <div className="absolute inset-0 z-10 overflow-auto py-20 px-4 sm:px-8 pointer-events-auto flex justify-center">
        <div className="max-w-5xl w-full">
          {view === 'list' ? (
            programItems.map((item) => <ProgramCard key={item.id} item={item} />)
          ) : (
            <CalendarView items={programItems} />
          )}
        </div>
      </div>
    </div>
  );
}
