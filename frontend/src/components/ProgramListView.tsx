'use client';

import { useEffect, useRef } from 'react';
import ProgramCard from '@/components/ProgramCard';
import { ProgramListViewProps } from '@/types/program';


export default function ProgramListView({ items }: ProgramListViewProps) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const closestFutureRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Scroll to the closest future event if available, otherwise to top
    if (closestFutureRef.current) {
      closestFutureRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (listRef.current) {
      listRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [items]);

  const today = new Date();

  // Find the closest future event
  let closestFutureIndex = -1;
  let closestDiff = Infinity;
  items.forEach((item, index) => {
    const startDate = new Date(item.startDate);
    if (startDate >= today) {
      const diff = startDate.getTime() - today.getTime();
      if (diff < closestDiff) {
        closestDiff = diff;
        closestFutureIndex = index;
      }
    }
  });

  return (
    <div ref={listRef} className="flex flex-col items-center w-full">
      {items.map((item, index) => (
        <div
          key={item.id}
          ref={index === closestFutureIndex ? closestFutureRef : null}
          className="w-full"
        >
          <ProgramCard item={item} />
        </div>
      ))}
    </div>
  );
}
