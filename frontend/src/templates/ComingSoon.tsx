'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import Link from 'next/link';
import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import { useLanguage } from '@/context/LanguageContext';
import { ProgramItem } from '@/types/program';

export default function ComingSoon() {
  const router = useRouter();
  const { locale, setLocale, t } = useLanguage();

  const handleEnter = () => {
    router.push('/program');
  };

  const toggleLabel = locale === 'eng' ? 'Latviski, lūdzu' : 'In British English, please';
  const toggleBgColor = locale === 'eng' ? '#8B0000' : '#00008B'; // red or blue

  // Pinned event for the flashing box
  const upcomingEvent = useMemo(() => {
    const programItems = t.program.items as Record<string, ProgramItem>;
    return programItems['item'] ?? null;
  }, [t.program.items]);

  const isSpecialPeriod = useMemo(() => {
    const today = new Date();
    const start = new Date(2026, 4, 28); // May 28, 2026 (2 weeks before)
    const end   = new Date(2026, 5, 24, 23, 59, 59);
    return today >= start && today <= end;
  }, []);

  // Show flashing box from Jun 1, 2026 through Jul 10, 2026
  const isActivePeriod = useMemo(() => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startDate = new Date(2026, 5, 1); // Jun 1, 2026
    const endDate = new Date(2026, 6, 10, 23, 59, 59); // Jul 10, 2026
    return todayStart >= startDate && todayStart <= endDate;
  }, []);

  const shouldShowFlashingBox = isActivePeriod && upcomingEvent && upcomingEvent.externalLink;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-black text-[#f5f5dc] px-4 overflow-hidden">
      <RaaHieroglyphMatrix frequency={1300} initialState={0} />

      {/* Language Toggle */}
      <div className="fixed top-6 right-6 z-20">
        <button
          onClick={() => setLocale(locale === 'eng' ? 'lat' : 'eng')}
          className="px-4 py-2 border border-white rounded-md uppercase font-semibold text-[#f5f5dc]"
          style={{ backgroundColor: toggleBgColor }}
        >
          {toggleLabel}
        </button>
      </div>

      {/* Main Content Container */}
      <div className="flex flex-col items-center gap-6 z-10 w-full max-w-3xl">
        {/* Main Content */}
        <div className="border-white border-[3pt] p-8 rounded-lg bg-black w-full">
          <h1 className="text-4xl font-bold mb-6 text-center">{t.title}</h1>
          <p className="text-center mb-6">
            {t.description}
            <br /><br /><br /><br />
            {t.openingNote}
          </p>
          <div className="flex justify-center">
            <button
              onClick={handleEnter}
              className="px-6 py-3 border border-[#f5f5dc] bg-transparent text-[#f5f5dc] font-semibold rounded-full hover:bg-[#f5f5dc] hover:text-black transition"
            >
              {t.enterButton}
            </button>
          </div>
        </div>

        {/* Flashing Event Box */}
        {shouldShowFlashingBox && (
          <div className="relative w-full">
            <div className="border-[#8B0000] border-[3pt] p-8 rounded-lg bg-black w-full flashing-box">
              <h2 className="text-3xl font-bold mb-4 text-center text-[#f5f5dc]">
                {upcomingEvent.title}
              </h2>
              <p className="text-center text-[#f5f5dc] mb-6 leading-relaxed">
                {t.calls.items.item.shortDescription}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/calls/item"
                  className="px-6 py-3 border border-[#f5f5dc] bg-transparent text-[#f5f5dc] font-semibold rounded-full hover:bg-[#f5f5dc] hover:text-black transition"
                >
                  Open Call
                </Link>
                {upcomingEvent.externalLink && (
                  <a
                    href={upcomingEvent.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 border border-[#f5f5dc] bg-transparent text-[#f5f5dc] font-semibold rounded-full hover:bg-[#f5f5dc] hover:text-black transition"
                  >
                    {upcomingEvent.externalLinkText || 'Learn More'}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Opening Hours strip */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-black text-[#f5f5dc] text-xs text-center py-2 opacity-80">
        {t.times.openingLabel}: {t.times.days}, {t.times.hours} &middot; {t.times.note}
        {isSpecialPeriod && (
          <>
            {' '}&middot;{' '}
            <Link href="/times" className="underline hover:text-[#8B0000] transition-colors">
              {locale === 'lat'
                ? '11.–24.06. izmainīti darba laiki'
                : '11–24 Jun different opening times'}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
