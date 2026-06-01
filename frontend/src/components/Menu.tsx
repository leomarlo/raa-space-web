'use client';

import { useRouter } from 'next/navigation';
import useGenerateMenuItems from '@/components/generateMenuItems';
import { MenuItem } from '@/types/main';


interface MenuProps {
  isOpen: boolean;
  setNavOpen: (open: boolean) => void;
  activeItem: string | null;
  itemArrangement: number;
}

const VISIBLE_KEYS = ['space', 'program', 'times', 'calls', 'contact', 'team', 'mezaBars', 'donations']; // subset of menu

export default function Menu({ isOpen, setNavOpen, activeItem, itemArrangement }: MenuProps) {   
  const router = useRouter();
  const itemsMap = useGenerateMenuItems(itemArrangement);



  if (!isOpen) return null;

  const handleItemClick = (item: MenuItem) => {
    // setActiveItem(item.label);
    setNavOpen(false);
    router.push(`/${item.route}`);
  };

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">

      {/* Menu Grid */}
      <div
        className="grid w-full h-full z-10"
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
