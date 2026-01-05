'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
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

  // Get upcoming event
  const upcomingEvent = useMemo(() => {
    const programItems: ProgramItem[] = Object.values(t.program.items);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for comparison
    
    // Find the closest future event (including today)
    const futureEvents = programItems
      .filter(item => {
        const eventDate = new Date(item.startDate);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    
    return futureEvents.length > 0 ? futureEvents[0] : null;
  }, [t.program.items]);

  // Check if we're in the active date range (Jan 5, 2025 to Feb 20, 2025)
  const isActivePeriod = useMemo(() => {
    const today = new Date();
    // Set to start of day in local timezone for comparison
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startDate = new Date(2026, 0, 4); // Jan 5, 2025 (month is 0-indexed)
    const endDate = new Date(2026, 1, 20, 23, 59, 59); // Feb 20, 2025, 23:59:59
    const inRange = todayStart >= startDate && todayStart <= endDate;
    return inRange;
  }, []);

  const shouldShowFlashingBox = isActivePeriod && upcomingEvent && upcomingEvent.externalLink;
  
  // Debug logging (remove in production)
  if (typeof window !== 'undefined') {
    console.log('Flashing box debug:', {
      isActivePeriod,
      hasUpcomingEvent: !!upcomingEvent,
      hasExternalLink: !!(upcomingEvent?.externalLink),
      shouldShow: shouldShowFlashingBox,
      upcomingEventTitle: upcomingEvent?.title
    });
  }

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
              <h2 className="text-3xl font-bold mb-6 text-center text-[#f5f5dc]">
                {upcomingEvent.title}
              </h2>
              {upcomingEvent.externalLink && (
                <div className="flex justify-center">
                  <a
                    href={upcomingEvent.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 border border-[#f5f5dc] bg-transparent text-[#f5f5dc] font-semibold rounded-full hover:bg-[#f5f5dc] hover:text-black transition"
                  >
                    {upcomingEvent.externalLinkText || 'Learn More'}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
