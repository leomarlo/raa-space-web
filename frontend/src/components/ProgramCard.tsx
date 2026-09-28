'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ProgramItem } from '@/types/program';

export default function ProgramCard({ item }: { item: ProgramItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-[3pt] border-black bg-black text-[#f5f5dc] p-6 md:p-8 max-w-3xl w-full mx-auto mb-8">
      {/* Image on click open / push item.url. A fixed-aspect box (rather than
          fixed width/height matching a single 16:9 shape) reserves the right
          space before the real file loads -- posters here are portrait, so a
          hardcoded landscape box was causing every card to jump taller once
          its image arrived, throwing off anything that scrolls to a card
          shortly after mount (see ProgramListView's scroll-to-today). */}
      <div className="relative w-full aspect-[3/4] mb-4">
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          <Image
            src={item.image.replace(/(\.[^.]+)$/, '-mid$1')}
            alt={item.title}
            fill
            sizes="100vw"
            loading="lazy"
            className="border border-black object-contain mx-auto"
          />
        </a>
      </div>

      {/* Basic Info */}
      <h2 className="text-3xl font-bold mb-2">{item.title}</h2>
      <p className="mb-1"><strong>{item.shortDescription}</strong></p>
      <p className="mb-1"><strong>{item.when}</strong></p>
      <p className="mb-4"><strong>{item.price}</strong></p>

      {/* */}
      <div className="flex flex-wrap gap-4 mt-4">

        {/* If there is a register page, then create a link not in new tab, the button stays the same */}
        {item.registerPage && (
          <a
            href={item.registerPage}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-[#f5f5dc] text-[#f5f5dc] rounded-full hover:bg-[#f5f5dc] hover:text-black transition"
          >
            Register
          </a>
        )}
        {item.instaLink && (
          <a
            href={item.instaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-[#f5f5dc] text-[#f5f5dc] rounded-full hover:bg-[#f5f5dc] hover:text-black transition"
          >
            Instagram
          </a>
        )}
        {item.externalLink && (
          <a
            href={item.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-[#f5f5dc] text-[#f5f5dc] rounded-full hover:bg-[#f5f5dc] hover:text-black transition"
          >
            {item.externalLinkText}
          </a>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-4 py-2 border border-[#8B0000] text-[#f5f5dc] rounded-full hover:bg-[#8B0000] transition"
        >
          {expanded ? 'Less' : 'More'}
        </button>
      </div>

      {/* Expandable Description */}
      {expanded && (
        <p className="mt-4 text-justify leading-relaxed whitespace-pre-line">
          {item.description}
        </p>
      )}
    </div>
  );
}
