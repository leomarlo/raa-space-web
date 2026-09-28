'use client';

import { useEffect, useRef } from 'react';
import ProgramCard from '@/components/ProgramCard';
import { ProgramListViewProps } from '@/types/program';


export default function ProgramListView({ items }: ProgramListViewProps) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const closestFutureRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    // Wait a paint past mount so every card has taken its final layout
    // position before we measure where to scroll -- calling scrollIntoView
    // in the same tick as the list first renders can land on a stale layout.
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (closestFutureRef.current) {
          closestFutureRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (listRef.current) {
          listRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
      })
    );
    return () => cancelAnimationFrame(raf);
    // Re-run only when which event is "closest to today" actually changes,
    // not on every re-render that hands us a same-content-but-new-reference items array.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closestFutureIndex]);

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
