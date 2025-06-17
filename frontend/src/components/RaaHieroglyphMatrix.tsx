'use client';

import { useEffect, useState } from 'react';
import { keccak256 } from 'js-sha3';
import { RaaHieroglyphMatrixProps } from '@/types/main';

const ROWS = 20;
const COLS = 35;
const TOTAL_CELLS = ROWS * COLS;

const IMAGE_MAP: Record<CellValue, string | null> = {
  0: null,
  1: '/assets/raa-hieroglyphs/bird_v1_white.svg',
  2: '/assets/raa-hieroglyphs/counterfeit_v2_white.svg',
  3: '/assets/raa-hieroglyphs/hand_v1_white.svg',
};

export type CellValue = 0 | 1 | 2 | 3;



function keccakToBigInt(seed: number): bigint {
  const hex = seed.toString(16);
  const hashHex = keccak256(hex);
  return BigInt('0x' + hashHex);
}

function numberToGrid(seed: number): CellValue[][] {
  const values: CellValue[] = new Array(TOTAL_CELLS);
  const digits: CellValue[] = [];

  let current = keccakToBigInt(seed);
  while (current > 0n) {
    digits.push(Number(current % 4n) as CellValue);
    current = current / 4n;
  }

  while (digits.length < TOTAL_CELLS) {
    digits.push(...digits.slice(0, TOTAL_CELLS - digits.length));
  }

  for (let i = 0; i < TOTAL_CELLS; i++) {
    values[i] = digits[i];
  }

  const grid: CellValue[][] = [];
  for (let i = 0; i < ROWS; i++) {
    grid.push(values.slice(i * COLS, (i + 1) * COLS));
  }
  return grid;
}

export default function RaaHieroglyphMatrix({ frequency, initialState }: RaaHieroglyphMatrixProps) {
  const [grid, setGrid] = useState<CellValue[][] | null>(null);
  const [intState, setIntState] = useState<number>(initialState);

  useEffect(() => {
    setGrid(numberToGrid(intState));

    if (frequency === 0) return;

    const interval = setInterval(() => {
      const newInt = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
      setIntState(newInt);
      setGrid(numberToGrid(newInt));
    }, frequency);

    return () => clearInterval(interval);
  }, [frequency, intState]);

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
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className="w-full h-full flex items-center justify-center bg-black"
            style={{ aspectRatio: '1 / 1' }}
          >
            {IMAGE_MAP[cell] && (
              <img
                src={IMAGE_MAP[cell]}
                alt="Hieroglyph"
                className="max-w-full max-h-full object-contain"
                style={{ width: '80%', height: '80%', filter: 'contrast(1)' }}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}
