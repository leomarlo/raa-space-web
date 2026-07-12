'use client';

import ChessWeekEventLayout from '@/components/ChessWeekEventLayout';
import { useLanguage } from '@/context/LanguageContext';

type ChessWeekEvent = {
  time: string;
  title: string;
  details: string;
  registrationUrl: string;
  registrationLabel: string;
};

export default function HandsAndBrainPage() {
  const { t } = useLanguage();
  const event = t.program.features.chessWeek.days[1].events[1] as ChessWeekEvent;

  return (
    <ChessWeekEventLayout date="21.07.2026" time={event.time} title={event.title}>
      <div className="text-center">
        <p className="text-[#f5f5dc]/80 leading-relaxed">{event.details}</p>
        {event.registrationUrl ? (
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 border border-[#f5f5dc] px-5 py-2 text-sm hover:bg-[#f5f5dc] hover:text-black transition-colors"
          >
            {event.registrationLabel}
          </a>
        ) : (
          <span className="inline-block mt-6 border border-[#f5f5dc]/30 px-5 py-2 text-sm text-[#f5f5dc]/55">
            {event.registrationLabel}
          </span>
        )}
      </div>
    </ChessWeekEventLayout>
  );
}
