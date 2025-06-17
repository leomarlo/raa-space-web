'use client';

import { useRouter } from 'next/navigation';
import { MENU_ITEMS, MENU_ITEMS_2 } from '@/lib/MenuItems';
import { MenuItem } from '@/types/main';

interface MenuProps {
  isOpen: boolean;
  activeItem: string | null;
  setActiveItem: (item: string | null) => void;
  itemArrangement: number;
}

export default function Menu({ isOpen, activeItem, setActiveItem, itemArrangement }: MenuProps) {
  const menuItems = itemArrangement === 1 ? MENU_ITEMS : MENU_ITEMS_2;
  const router = useRouter();

  if (!isOpen) return null;

  const handleItemClick = (item: MenuItem) => {
    setActiveItem(item.label);
    router.push(`/${item.route}`);
  };

  return (
    <div className="absolute inset-0 z-40 pointer-events-none">
      <div
        className="grid w-full h-full"
        style={{
          gridTemplateColumns: `repeat(35, 1fr)`,
          gridTemplateRows: `repeat(20, 1fr)`
        }}
      >
        {menuItems.map((item) =>
          item.positions.map(([row, col], idx) => {
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
                onMouseEnter={e => (e.currentTarget.style.cursor = 'pointer')}
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
