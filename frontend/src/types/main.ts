

interface MenuItem {
    label: string;
    route: string;
    positions: [number, number][]; // [row, col]
  }

  interface RaaHieroglyphMatrixProps {
    frequency: number; // in milliseconds, 0 means no updates
    initialState: number; // integer seed
  }

export type { MenuItem, RaaHieroglyphMatrixProps };