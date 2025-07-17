import { MenuItem } from '@/types/main';


const MENU_ITEMS: MenuItem[] = [
    {
      label: 'RAA SPACE',
      route: 'telpa',
      positions: Array.from({ length: 9 }, (_, i) => [i + 3, 1]), // vertical starting at row 2, col 1
    },
    {
      label: 'Program',
      route: 'program',
      positions: Array.from({ length: 7 }, (_, i) => [10, i + 3]), // horizontal at row 10, cols 2–8
    },
    {
      label: 'Register',
      route: 'register',
      positions: Array.from({ length: 8 }, (_, i) => [i + 4, 11]), // vertical starting at row 4, col 10
    },
    {
      label: 'Contact',
      route: 'contact',
      positions: Array.from({ length: 7 }, (_, i) => [13, i + 8]), // horizontal at row 13, cols 12–18
    },
    {
      label: 'Team',
      route: 'team',
      positions: Array.from({ length: 4 }, (_, i) => [i + 9, 17]), // vertical starting at row 6, col 21
    },
  ];
  
  const MENU_ITEMS_2: MenuItem[] = [
      {
        label: 'RAA SPACE',
        route: 'telpa',
        positions: Array.from({ length: 9 }, (_, i) => [3, i + 1]), // row 3, columns 1–9
      },
      {
        label: 'Program',
        route: 'program',
        positions: Array.from({ length: 7 }, (_, i) => [5, i + 1]), // row 5, columns 1–7
      },
      {
        label: 'Register',
        route: 'register',
        positions: Array.from({ length: 8 }, (_, i) => [7, i + 1]), // row 7, columns 1–8
      },
      {
        label: 'Contact',
        route: 'contact',
        positions: Array.from({ length: 7 }, (_, i) => [9, i + 1]), // row 9, columns 1–7
      },
      {
        label: 'Team',
        route: 'team',
        positions: Array.from({ length: 4 }, (_, i) => [11, i + 1]), // row 11, columns 1–8
      },
    ];
    
export { MENU_ITEMS, MENU_ITEMS_2 };