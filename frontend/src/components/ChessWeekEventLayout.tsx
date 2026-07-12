'use client';

import Entrance from '@/components/Entrance';
import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Link from 'next/link';
import { ReactNode, useState } from 'react';

type ChessWeekEventLayoutProps = {
  date: string;
  time?: string;
  title: string;
  children: ReactNode;
};

export default function ChessWeekEventLayout({
  date,
  time,
  title,
  children,
}: ChessWeekEventLayoutProps) {
  const [navOpen, setNavOpen] = useState(false);

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
        <main className="max-w-4xl w-full bg-black/70 p-6 sm:p-8 rounded-lg shadow-lg">
          <p className="text-xs text-[#f5f5dc]/50 text-center mb-2 tracking-widest uppercase">
            RAA Chess Week &nbsp;·&nbsp; {date}{time ? ` · ${time}` : ''}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">{title}</h1>

          {children}

          <div className="border-t border-[#f5f5dc]/20 pt-6 mt-8 text-center">
            <Link
              href="/events/chess-week"
              className="inline-block border border-[#f5f5dc] px-5 py-2 text-sm hover:bg-[#f5f5dc] hover:text-black transition-colors"
            >
              RAA Chess Week programme
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
