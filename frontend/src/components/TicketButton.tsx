'use client';

import { ProgramItem } from '@/types/program';

/** Red, semi-transparent pill used for ticket links so they stand out. */
export const ticketPillClass =
  'inline-block px-6 py-2 border-[3px] border-[#8B0000] bg-[#8B0000]/40 text-[#f5f5dc] text-lg font-bold tracking-wider rounded-full hover:bg-[#8B0000] transition';

/** Ticket button for an event's externalLink; renders nothing without one. */
export default function TicketButton({ event }: { event: ProgramItem }) {
  if (!event.externalLink) return null;
  return (
    <a href={event.externalLink} target="_blank" rel="noopener noreferrer" className={ticketPillClass}>
      {event.externalLinkText || 'Tickets'}
    </a>
  );
}
