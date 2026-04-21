'use client';

import Image from 'next/image';
import { ProgramItem } from '@/types/program';

interface EventPageContentProps {
  event: ProgramItem;
  children?: React.ReactNode;
}

export default function EventPageContent({ event, children }: EventPageContentProps) {
  return (
    <div className="max-w-4xl w-full bg-black/70 p-6 sm:p-8 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-6 text-center">{event.title}</h1>

      <div className="overflow-hidden">
        {event.image && (
          <div className="w-full mb-4 md:float-right md:w-1/3 md:ml-6 md:mb-2">
            <Image
              src={event.image}
              alt={event.title}
              width={600}
              height={800}
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}
        <div className="text-justify leading-relaxed whitespace-pre-line">
          {event.description}
        </div>
        <div className="clear-both" />
      </div>

      {children}
    </div>
  );
}
