'use client';

import Image from 'next/image';
import { ProgramItem } from '@/types/program';

interface EventPageContentProps {
  event: ProgramItem;
  children?: React.ReactNode;
}

function renderDescription(text: string) {
  const pattern = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[0].startsWith('**')) {
      parts.push(<strong key={key++}>{match[1]}</strong>);
    } else {
      parts.push(
        <a
          key={key++}
          href={match[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-80"
        >
          {match[2]}
        </a>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
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
          {renderDescription(event.description)}
        </div>
        <div className="clear-both" />
      </div>

      {children}
    </div>
  );
}
