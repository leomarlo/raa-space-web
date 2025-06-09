'use client';

import { useEffect, useState } from 'react';

const ROWS = 20;
const COLS = 35;

const IMAGE_MAP: Record<CellValue, string | null> = {
    0: null,
    1: '/assets/raa-hieroglyphs/bird_v1_white.svg',
    2: '/assets/raa-hieroglyphs/counterfeit_v2_white.svg',
    3: '/assets/raa-hieroglyphs/hand_v1_white.svg',
  };

  
type CellValue = 0 | 1 | 2 | 3;

const generateInitialGrid = (): CellValue[][] => {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () =>
      Math.floor(Math.random() * 4) as CellValue
    )
  );
};

const updateGrid = (prev: CellValue[][]): CellValue[][] => {
    const newGrid = prev.map(row => [...row]);
    for (let i = 0; i < Math.floor(ROWS * COLS * 0.55); i++) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      newGrid[r][c] = Math.floor(Math.random() * 4) as CellValue;
    }
    return newGrid;
  };

export default function RaaHieroglyphMatrix() {
  const [grid, setGrid] = useState<CellValue[][] | null>(null);


  useEffect(() => {
    console.log('RaaHieroglyphMatrix');
    const initial = generateInitialGrid();
    setGrid(initial);

    const interval = setInterval(() => {
      console.log('updateGrid');
      setGrid(prev => (prev ? updateGrid(prev) : prev));
    }, 1300);

    return () => clearInterval(interval);
  }, []);

  if (!grid) return null;

  return (
    <div className="absolute inset-0 grid grid-cols-35 grid-rows-15">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className="w-full h-full flex items-center justify-center bg-black"
            style={{ aspectRatio: '1 / 1' }}
          >
            {IMAGE_MAP[cell] && (
            <img
              src={IMAGE_MAP[cell]}
              alt="Bird"
              className="max-w-full max-h-full object-contain"
              style={{ 
                width: '80%', 
                height: '80%',
                filter: 'contrast(1)'
              }}
              onLoad={() => console.log('Image loaded')}
              onError={(e) => console.log('Image failed to load:', e)}
            />
            )}
          </div>
        ))
      )}
    </div>
  );
}
