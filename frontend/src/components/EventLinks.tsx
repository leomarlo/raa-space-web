'use client';

import { ProgramItem } from '@/types/program';

interface EventLinksProps {
  event: ProgramItem;
}

export default function EventLinks({ event }: EventLinksProps) {
  const hasLinks = event.instaLink || event.fbLink || event.externalLink;

  if (!hasLinks) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-4 mt-6 justify-center">
      {event.instaLink && (
        <a
          href={event.instaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 border border-[#f5f5dc] text-[#f5f5dc] rounded-full hover:bg-[#f5f5dc] hover:text-black transition"
        >
          Instagram
        </a>
      )}
      {event.fbLink && (
        <a
          href={event.fbLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 border border-[#f5f5dc] text-[#f5f5dc] rounded-full hover:bg-[#f5f5dc] hover:text-black transition"
        >
          Facebook
        </a>
      )}
      {event.externalLink && (
        <a
          href={event.externalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 border border-[#f5f5dc] text-[#f5f5dc] rounded-full hover:bg-[#f5f5dc] hover:text-black transition"
        >
          {event.externalLinkText || 'External Link'}
        </a>
      )}
    </div>
  );
}

