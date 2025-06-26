'use client';

import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import useGenerateMenuItems from '@/components/generateMenuItems';
import { MenuItem } from '@/types/main';


interface MenuProps {
  isOpen: boolean;
  activeItem: string | null;
  setActiveItem: (item: string | null) => void;
  itemArrangement: number;
}

const VISIBLE_KEYS = ['space', 'program', 'register', 'contact']; // subset of menu

export default function Menu({ isOpen, activeItem, setActiveItem, itemArrangement }: MenuProps) {
  const router = useRouter();
  const { locale, setLocale } = useLanguage();
  const itemsMap = useGenerateMenuItems(itemArrangement);



  if (!isOpen) return null;

  const handleItemClick = (item: MenuItem) => {
    setActiveItem(item.label);
    router.push(`/${item.route}`);
  };

  const toggleLabel =
    locale === 'eng' ? 'LATVISKI, LŪDZU' : 'IN BRITISH ENGLISH, PLEASE';
  const toggleBgColor = locale === 'eng' ? '#8B0000' : '#1E3A8A'; // dark red or dark blue

  return (
    <div className="absolute inset-0 z-40 pointer-events-none">
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


      {/* Menu Grid */}
      <div
        className="grid w-full h-full"
        style={{
          gridTemplateColumns: `repeat(35, 1fr)`,
          gridTemplateRows: `repeat(20, 1fr)`
        }}
      >
        {VISIBLE_KEYS.flatMap((key) =>
          itemsMap[key].positions.map(([row, col], idx) => {
            const item = itemsMap[key];
            const isVisible = !activeItem || item.label === activeItem;
            return (
              <div
                key={`${item.label}-${idx}`}
                className={`w-full h-full flex items-center justify-center text-[#f5f5dc] font-extrabold text-4xl uppercase pointer-events-auto bg-[#8B0000] transition-opacity duration-300 ${
                  isVisible ? 'opacity-100 cursor-pointer' : 'opacity-0'
                }`}
                style={{
                  gridRowStart: row + 1,
                  gridColumnStart: col + 1
                }}
                onClick={() => handleItemClick(item)}
              >
                {item.label[idx]}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
