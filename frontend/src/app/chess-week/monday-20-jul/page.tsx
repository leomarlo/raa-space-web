'use client';

import ChessWeekEventLayout from '@/components/ChessWeekEventLayout';
import { useLanguage } from '@/context/LanguageContext';

type ChessWeekEvent = {
  time: string;
  title: string;
  details: string;
};

export default function Monday20JulyPage() {
  const { t } = useLanguage();
  const monday = t.program.features.chessWeek.days[0];

  return (
    <ChessWeekEventLayout date={monday.date} title={monday.day}>
      <div className="bg-black rounded-lg p-4 sm:p-5">
        {(monday.events as ChessWeekEvent[]).map((event) => (
          <div
            key={`${event.time}-${event.title}`}
            className="grid grid-cols-[6rem_1fr] gap-x-3 py-4 border-b border-[#f5f5dc]/20 last:border-b-0"
          >
            <span className="tabular-nums text-[#f5f5dc]/70">{event.time}</span>
            <div>
              <p className="font-semibold">{event.title}</p>
              {event.details && (
                <p className="mt-1 text-sm text-[#f5f5dc]/65">{event.details}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </ChessWeekEventLayout>
  );
}
