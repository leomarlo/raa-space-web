'use client';

import { useEffect, useState } from 'react';

const ROWS = 20;
const COLS = 35;

type CellValue = 0 | 1 | 2 | 3;
type OverrideMap = Record<string, boolean>; // e.g., "2-1": true

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
  const [showForm, setShowForm] = useState(false);

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
        const letters = 'REGISTER';
        for (let r = 2; r < 2 + letters.length; r++) {
          newOverrides[`${r}-1`] = true;
        }
      }
      setOverrides(newOverrides);
    } else if (overrides[`${row}-${col}`]) {
      setShowForm(true);
    }
  };

  function getArrow(i: number, j: number): string | null {
    const a = 1, b = 1;
    const dx = -(a - i);
    const dy = -(b - j);
    if (dx === 0 && dy === 0) return null;
    if (dx === 0) return dy > 0 ? '⬅' : '➡';
    if (dy === 0) return dx > 0 ? '⬆' : '⬇';
    if (dx > 0 && dy > 0) return '↖';
    if (dx > 0 && dy < 0) return '↗';
    if (dx < 0 && dy > 0) return '↙';
    if (dx < 0 && dy < 0) return '↘';
    return null;
  }

  if (!grid) return null;

  return (
    <>
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
            const letter = isRedCell ? 'REGISTER'[rowIndex - 2] : null;

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
                  <div className="w-full h-full bg-red-500 flex items-center justify-center text-white font-bold">
                    {letter}
                  </div>
                ) : hovered?.[0] === rowIndex && hovered?.[1] === colIndex ? (
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
                )}
              </div>
            );
          })
        )}
      </div>

      {showForm && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="border-white border-[3pt] p-8 rounded-lg z-10 bg-black text-[#f5f5dc]">
            <h1 className="text-4xl font-bold mb-6 text-center">REGISTER AT RAA SPACE</h1>
            <form
              action="https://formspree.io/f/xkgbwlyr"
              method="POST"
              className="flex flex-col sm:flex-row items-center gap-2"
            >
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="px-4 py-2 bg-transparent border border-[#f5f5dc] rounded-full text-[#f5f5dc] placeholder-[#f5f5dc]/70 focus:outline-none focus:ring-2 focus:ring-[#f5f5dc]"
              />
              <button
                type="submit"
                className="px-4 py-2 border border-[#f5f5dc] bg-transparent text-[#f5f5dc] font-semibold rounded-full hover:bg-[#f5f5dc] hover:text-black transition"
              >
                ENTER
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
