'use client';

import { useEffect, useState } from 'react';

const ROWS = 20;
const COLS = 35;

type CellValue = 0 | 1 | 2 | 3;
type OverrideMap = Record<string, boolean>; // e.g., "2-1": true means cell is overridden

const IMAGE_MAP: Record<CellValue, string | null> = {
  0: null,
  1: '/assets/raa-hieroglyphs/bird_v1_white.svg',
  2: '/assets/raa-hieroglyphs/counterfeit_v2_white.svg',
  3: '/assets/raa-hieroglyphs/hand_v1_white.svg',
};

const generateInitialGrid = (): CellValue[][] => {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () =>
      Math.floor(Math.random() * 4) as CellValue
    )
  );
};

const updateGrid = (prev: CellValue[][], overrides: OverrideMap): CellValue[][] => {
  const newGrid = prev.map(row => [...row]);
  for (let i = 0; i < Math.floor(ROWS * COLS * 0.55); i++) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    const key = `${r}-${c}`;
    if (!overrides[key]) {
      newGrid[r][c] = Math.floor(Math.random() * 4) as CellValue;
    }
  }
  return newGrid;
};

export default function RaaHieroglyphReactive() {
  const [grid, setGrid] = useState<CellValue[][] | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [overrides, setOverrides] = useState<OverrideMap>({});
  const [hovered, setHovered] = useState<[number, number] | null>(null);
  

  
  // Handle grid logic
  useEffect(() => {
    const initial = generateInitialGrid();
    setGrid(initial);

    const interval = setInterval(() => {
      setGrid(prev => (prev ? updateGrid(prev, overrides) : prev));
    }, 1300);

    return () => clearInterval(interval);
  }, [overrides]);

  const handleClick = (row: number, col: number) => {
    if (row === 1 && col === 1) {
      setNavOpen(prev => !prev);
      const newOverrides: OverrideMap = {};
      if (!navOpen) {
        for (let r = 2; r <= 6; r++) {
          newOverrides[`${r}-${1}`] = true;
        }
      }
      setOverrides(newOverrides);
    }
  };


  function getArrow(i: number, j: number): string | null {
    const a = 1, b = 1;
    const dx = - (a - i);
    const dy = - (b - j);
  
    // no arrow at anchor cell
    if (dx === 0 && dy === 0) return null;
  
    if (dx === 0) {
      return dy > 0 ? '←' : '→';
    }
  
    if (dy === 0) {
      return dx > 0 ? '↑' : '↓';
    }
  
    if (dx > 0 && dy > 0) return '↖'; // up-left
    if (dx > 0 && dy < 0) return '↗'; // up-right
    if (dx < 0 && dy > 0) return '↙'; // down-left
    if (dx < 0 && dy < 0) return '↘'; // down-right
  
    return null;
  }
  

  if (!grid) return null;

  return (
    <div
      className="absolute inset-0 grid"
      style={{
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const key = `${rowIndex}-${colIndex}`;
          const isMenuToggle = rowIndex === 1 && colIndex === 1;
          const isRedCell = navOpen && overrides[key];

          return (
            <div
              key={key}
              onClick={() => handleClick(rowIndex, colIndex)}
              onMouseEnter={() => {
                if (!isMenuToggle) setHovered([rowIndex, colIndex]);
              }}
              onMouseLeave={() => {
                if (!isMenuToggle) setHovered(null);
              }}
              className={`w-full h-full flex items-center justify-center bg-black ${
                isMenuToggle ? 'cursor-pointer' : ''
              }`}
              style={{ aspectRatio: '1 / 1' }}
            >
              {isMenuToggle ? (
                <div className="space-y-[2px]">
                  {navOpen ? (
                    <div className="flex flex-row gap-[2px]">
                      <div className="w-3 h-9 bg-white" />
                      <div className="w-3 h-9 bg-white" />
                      <div className="w-3 h-9 bg-white" />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-[2px]">
                      <div className="w-9 h-3 bg-white" />
                      <div className="w-9 h-3 bg-white" />
                      <div className="w-9 h-3 bg-white" />
                    </div>
                  )}
                </div>
              ) : isRedCell ? (
                <div className="w-full h-full bg-red-500" />
              ) : (
                hovered?.[0] === rowIndex && hovered?.[1] === colIndex ? (
                  <span className="text-white text-3xl font-extrabold select-none">
                    {getArrow(rowIndex, colIndex)}
                  </span>
                ) : (
                  IMAGE_MAP[cell] && (
                    <img
                      src={IMAGE_MAP[cell]!}
                      alt=""
                      className="max-w-full max-h-full object-contain"
                      style={{
                        width: '80%',
                        height: '80%',
                        filter: 'contrast(1)',
                      }}
                    />
                  )
                )
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
