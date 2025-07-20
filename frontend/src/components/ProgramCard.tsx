'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ProgramItem } from '@/types/program';

export default function ProgramCard({ item }: { item: ProgramItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-[3pt] border-black bg-black text-[#f5f5dc] p-6 md:p-8 max-w-3xl w-full mx-auto mb-8">
      {/* Image on click open / push item.url */}
      <div className="w-full mb-4">
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          <Image
            src={item.image}
            alt={item.title}
            width={800}
            height={450}
            sizes="100vw"
            loading="lazy"
            className="w-full h-auto border border-black object-contain mx-auto"
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
