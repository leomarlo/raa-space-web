'use client';

import { useEffect, useState } from 'react';
import Menu from '@/components/Menu';

const ROWS = 20;
const COLS = 35;

interface EntranceProps {
    initialMenuSelection: string | null; // optional;
    itemArrangement: 1 | 2;
    navOpen: boolean;
    setNavOpen: (navOpen: boolean) => void;
  }

export default function Entrance({ initialMenuSelection, itemArrangement, navOpen, setNavOpen }: EntranceProps) {
  const [hovered, setHovered] = useState<[number, number] | null>(null);
  const [activeItem, setActiveItem] = useState<string | null>(initialMenuSelection);

    useEffect(() => {
    if (!navOpen) {
        setActiveItem(null);
    }
    }, [navOpen]);

  const handleClick = (row: number, col: number) => {
    if (row === 1 && col === 1) {
      setNavOpen(!navOpen);
    }
  };

  const getArrow = (i: number, j: number): string | null => {
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
  };

  return (
    <>
    <div
      className="absolute inset-0 grid"
      style={{
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
      }}
    >
      {Array.from({ length: ROWS }).map((_, rowIndex) =>
        Array.from({ length: COLS }).map((_, colIndex) => {
          const isMenuToggle = rowIndex === 1 && colIndex === 1;
          const key = `${rowIndex}-${colIndex}`;

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
              className="w-full h-full flex items-center justify-center"
              style={{ aspectRatio: '1 / 1' }}
            >
              {isMenuToggle ? (
                <div className="bg-black p-1 rounded z-30">
                  {navOpen ? (
                    <div className="flex flex-row gap-[2px]">
                      <div className="w-3 h-9 bg-[#8B0000]" />
                      <div className="w-3 h-9 bg-[#8B0000]" />
                      <div className="w-3 h-9 bg-[#8B0000]" />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-[2px]">
                      <div className="w-9 h-3 bg-[#8B0000]" />
                      <div className="w-9 h-3 bg-[#8B0000]" />
                      <div className="w-9 h-3 bg-[#8B0000]" />
                    </div>
                  )}
                </div>
              ) : hovered?.[0] === rowIndex && hovered?.[1] === colIndex ? (
                <div className="bg-black w-full h-full flex items-center justify-center z-5">
                    <span className="text-[#8B0000] text-3xl font-extrabold select-none">
                    {getArrow(rowIndex, colIndex)}
                    </span>
                </div>
              ) : null}
            </div>
          );
        })
      )}
    </div>
    <Menu 
        isOpen={navOpen} 
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        itemArrangement={itemArrangement}
    />
    </>
  );
}
