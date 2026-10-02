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

  const programItems = t.program.items as Record<string, ProgramItem>;

  // Cycled by position, so any number of boxes each get their own glow colour
  // automatically -- add a 6th box and it wraps back to GLOW_COLORS[0].
  const GLOW_COLORS = ['#8B0000', '#22c55e', '#0ea5e9', '#eab308', '#a855f7'];

  const isSpecialPeriod = useMemo(() => {
    const today = new Date();
    const start = new Date(2026, 4, 28); // May 28, 2026 (2 weeks before)
    const end   = new Date(2026, 5, 24, 23, 59, 59);
    return today >= start && today <= end;
  }, []);

  // Boxes are shown top to bottom in this order, each within its own active
  // window (inclusive on both ends). A box with no event is simply skipped.
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const boxes = [
    {
      // RAA Ceturtdienas — 8 October: from the day after 1 October through the event.
      event: programItems['raaCeturtdienasOkt08'] ?? null,
      start: new Date(2026, 9, 2),
      end: new Date(2026, 9, 8, 23, 59, 59),
    },
    {
      // RAA Ceturtdienas — 1 October: live now through the event itself.
      event: programItems['raaCeturtdienasOkt01'] ?? null,
      start: new Date(2026, 8, 24),
      end: new Date(2026, 9, 1, 23, 59, 59),
    },
    {
      // Collapsing Flat Waves: a week before opening through the day after close.
      event: programItems['collapsingFlatWaves'] ?? null,
      start: new Date(2026, 8, 17),
      end: new Date(2026, 9, 15, 23, 59, 59),
    },
  ]
    .filter((b) => b.event && todayStart >= b.start && todayStart <= b.end)
    .map((b, i) => {
      const event = b.event as ProgramItem;
      // externalLink is empty for these events; fall back to their Instagram post.
      const secondaryLink = event.externalLink || event.instaLink || '';
      const secondaryLinkText = event.externalLink
        ? event.externalLinkText || 'Register'
        : 'Instagram';
      const glowColor = GLOW_COLORS[i % GLOW_COLORS.length];
      return { event, secondaryLink, secondaryLinkText, glowColor };
    });

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

      {/* Main Content Container -- wide enough for two glow-box columns; the
          ENTER panel itself stays at its own narrower reading width below. */}
      <div className="flex flex-col items-center gap-6 z-10 w-full max-w-5xl">
        {/* Main Content */}
        <div className="border-white border-[3pt] p-8 rounded-lg bg-black w-full max-w-3xl">
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

        {/* Flashing Event Boxes -- two columns from md up (so a normal desktop
            doesn't have to scroll for two boxes), one column below that; a
            single box stays centred at the ENTER panel's width instead of
            stretching across a now-empty second column. */}
        <div
          className={
            boxes.length > 1
              ? 'grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-start'
              : 'flex w-full justify-center'
          }
        >
          {boxes.map(({ event, secondaryLink, secondaryLinkText, glowColor }) => (
            <div
              key={event.id}
              className={boxes.length > 1 ? 'relative w-full' : 'relative w-full max-w-3xl'}
            >
              <div
                className="border-[3pt] p-8 rounded-lg bg-black w-full h-full glow-box"
                style={{ borderColor: glowColor, ['--glow-color' as string]: glowColor }}
              >
                <h2 className="text-3xl font-bold mb-4 text-center text-[#f5f5dc]">
                  {event.title}
                </h2>
                <p className="text-center text-[#f5f5dc] mb-6 leading-relaxed">
                  {event.shortDescription}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href={event.url}
                    className="px-6 py-3 border border-[#f5f5dc] bg-transparent text-[#f5f5dc] font-semibold rounded-full hover:bg-[#f5f5dc] hover:text-black transition"
                  >
                    {event.title}
                  </Link>
                  {secondaryLink && (
                    <Link
                      href={secondaryLink}
                      target={secondaryLink.startsWith('http') ? '_blank' : undefined}
                      rel={secondaryLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="px-6 py-3 border border-[#f5f5dc] bg-transparent text-[#f5f5dc] font-semibold rounded-full hover:bg-[#f5f5dc] hover:text-black transition"
                    >
                      {secondaryLinkText}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
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
