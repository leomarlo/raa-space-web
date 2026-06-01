'use client';

import { useLanguage } from '@/context/LanguageContext';
import { MenuItem } from '@/types/main';

const useGenerateMenuItems = (layoutType: number): Record<string, MenuItem> => {
  const { t } = useLanguage();

  const items: Record<string, MenuItem> = {
    space: {
      label: t.menu.raaSpace,
      route: 'telpa',
      positions:
        layoutType === 0
          ? Array.from({ length: 9 }, (_, i): [number, number] => [i + 3, 1]) // vertical
          : Array.from({ length: 9 }, (_, i): [number, number] => [3, i + 1]), // horizontal
    },
    program: {
      label: t.menu.program,
      route: 'program',
      positions:
        layoutType === 0
          ? Array.from({ length: 7 }, (_, i): [number, number] => [10, i + 3])
          : Array.from({ length: 7 }, (_, i): [number, number] => [5, i + 1]),
    },
    times: {
      label: t.menu.times,
      route: 'times',
      positions:
        layoutType === 0
          ? Array.from({ length: 5 }, (_, i): [number, number] => [10, i + 3])
          : Array.from({ length: 5 }, (_, i): [number, number] => [7, i + 1]),
    },
    calls: {
      label: t.menu.openCalls,
      route: 'calls',
      positions:
        layoutType === 0
          ? Array.from({ length: 10 }, (_, i): [number, number] => [i + 4, 11])
          : Array.from({ length: 10 }, (_, i): [number, number] => [9, i + 1]),
    },
    contact: {
      label: t.menu.contact,
      route: 'contact',
      positions:
        layoutType === 0
          ? Array.from({ length: 7 }, (_, i): [number, number] => [13, i + 8])
          : Array.from({ length: 7 }, (_, i): [number, number] => [11, i + 1]),
    },
    team: {
      label: t.menu.team,
      route: 'team',
      positions:
        layoutType === 0
          ? Array.from({ length: 7 }, (_, i): [number, number] => [i + 9, 17])
          : Array.from({ length: 7 }, (_, i): [number, number] => [13, i + 1]),
    },
    opening: {
      label: t.menu.opening,
      route: 'opening',
      positions:
        layoutType === 0
          ? Array.from({ length: 7 }, (_, i): [number, number] => [2 + i, 25])
          : Array.from({ length: 7 }, (_, i): [number, number] => [15, i + 1]),
    },
    members: {
      label: t.menu.members,
      route: 'members',
      positions:
        layoutType === 0
          ? Array.from({ length: 7 }, (_, i): [number, number] => [12 + i, 27])
          : Array.from({ length: 7 }, (_, i): [number, number] => [17, i + 1]),
    },
    location: {
      label: t.menu.location,
      route: 'location',
      positions:
        layoutType === 0
          ? Array.from({ length: 8 }, (_, i): [number, number] => [4 + i, 30])
          : Array.from({ length: 8 }, (_, i): [number, number] => [19, i + 1]),
    },
    mezaBars: {
      label: t.menu.mezaBars,
      route: 'maate-naatre',
      positions:
        layoutType === 0
          ? Array.from({ length: 9 }, (_, i): [number, number] => [5 + i, 20])
          : Array.from({ length: 9 }, (_, i): [number, number] => [15, i + 1]),
    },
    donations: {
      label: t.menu.donations,
      route: 'donations',
      positions:
        layoutType === 0
          ? Array.from({ length: 9 }, (_, i): [number, number] => [5 + i, 24])
          : Array.from({ length: 9 }, (_, i): [number, number] => [17, i + 1]),
    },
  };

  return items;
};

export default useGenerateMenuItems;
