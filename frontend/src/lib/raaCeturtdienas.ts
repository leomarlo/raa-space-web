// lib/raaCeturtdienas.ts
// The Thursday schedule for the RAA Ceturtdienas series, shared by the series
// page, the three month pages and the individual event pages.
//
// A Thursday with `itemKey` null has no event; the pages show "no event" for it.
// `itemKey` indexes t.program.items, where the placeholder entries live.
import type { ProgramItem } from '@/types/program';

export type MonthKey = 'october' | 'november' | 'december';

export interface Thursday {
  /** ISO date, used as a stable key and for the displayed day number */
  iso: string;
  day: number;
  /** route under /events, or null when nothing is planned that Thursday */
  slug: string | null;
  /** key into t.program.items, or null when nothing is planned */
  itemKey: string | null;
}

export interface CeturtdienasMonth {
  key: MonthKey;
  /** route segment under /raa-ceturtdienas */
  slug: string;
  thursdays: Thursday[];
}

function planned(iso: string, slug: string): Thursday {
  const [, month, day] = iso.split('-');
  const short = { '10': 'Okt', '11': 'Nov', '12': 'Dec' }[month] ?? month;
  return { iso, day: Number(day), slug, itemKey: `raaCeturtdienas${short}${day}` };
}

function empty(iso: string): Thursday {
  return { iso, day: Number(iso.split('-')[2]), slug: null, itemKey: null };
}

export const CETURTDIENAS_MONTHS: CeturtdienasMonth[] = [
  {
    key: 'october',
    slug: 'oktobris',
    thursdays: [
      planned('2026-10-01', 'raa-ceturtdienas-okt-01'),
      planned('2026-10-08', 'raa-ceturtdienas-okt-08'),
      empty('2026-10-15'),
      planned('2026-10-22', 'raa-ceturtdienas-okt-22'),
      empty('2026-10-29'),
    ],
  },
  {
    key: 'november',
    slug: 'novembris',
    thursdays: [
      planned('2026-11-05', 'raa-ceturtdienas-nov-05'),
      planned('2026-11-12', 'raa-ceturtdienas-nov-12'),
      planned('2026-11-19', 'raa-ceturtdienas-nov-19'),
      empty('2026-11-26'),
    ],
  },
  {
    key: 'december',
    slug: 'decembris',
    thursdays: [
      planned('2026-12-03', 'raa-ceturtdienas-dec-03'),
      planned('2026-12-10', 'raa-ceturtdienas-dec-10'),
      planned('2026-12-17', 'raa-ceturtdienas-dec-17'),
      empty('2026-12-24'),
      empty('2026-12-31'),
    ],
  },
];

export function monthBySlug(slug: string): CeturtdienasMonth | undefined {
  return CETURTDIENAS_MONTHS.find((m) => m.slug === slug);
}

/**
 * t.program.items is typed from the English JSON, so its keys are a fixed union.
 * The schedule addresses them by string, hence the cast in one place rather than
 * at every call site.
 */
export function programItem(
  items: unknown,
  key: string | null
): ProgramItem | undefined {
  if (!key) return undefined;
  return (items as Record<string, ProgramItem>)[key];
}

/** 01.10.2026 */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}
