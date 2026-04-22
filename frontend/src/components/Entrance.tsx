'use client';

import { useEffect, useState } from 'react';
import Menu from '@/components/Menu';
import { useLanguage } from '@/context/LanguageContext';

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

  const { locale, setLocale } = useLanguage();

  useEffect(() => {
  console.log('navOpen changed to', navOpen, ' in Entrance');  
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


  const toggleLabel =
    locale === 'eng' ? 'LATVISKI, LŪDZU' : 'IN BRITISH ENGLISH, PLEASE';
  const toggleBgColor = locale === 'eng' ? '#8B0000' : '#1E3A8A'; // dark red or dark blue


  return (
    <>
          {/* Language Toggle styled like menu items */}
    <div className="fixed top-6 right-6 z-50">
      <button
        onClick={() => setLocale(locale === 'eng' ? 'lat' : 'eng')}
        className="uppercase font-extrabold text-[#f5f5dc] bg-[#8B0000] px-4 py-2 text-sm sm:text-base pointer-events-auto"
        style={{
          backgroundColor: toggleBgColor,
          border: '2px solid #f5f5dc',
          borderRadius: '0px',
        }}
      >
        {toggleLabel}
      </button>
    </div>
    <div
      className="fixed inset-0 grid pointer-events-none z-40"
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
              className={`w-full h-full flex items-center justify-center${isMenuToggle ? ' pointer-events-auto' : ''}`}
              style={{ aspectRatio: '1 / 1' , position: 'relative' }}
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
        setNavOpen={setNavOpen}
        activeItem={activeItem}
        itemArrangement={itemArrangement}
    />
    </>
  );
}
