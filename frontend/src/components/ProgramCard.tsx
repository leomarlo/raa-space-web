'use client';

import { useState } from 'react';
import Image from 'next/image';
import type ProgramItem from '@/types/program';

export default function ProgramCard({ item }: { item: ProgramItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-[3pt] border-white bg-black text-[#f5f5dc] p-6 md:p-8 max-w-3xl w-full mx-auto mb-8">
      {/* Image */}
      <div className="w-full h-64 relative mb-4">
        <Image
          src={item.image}
          alt={item.title}
          fill
          loading="lazy"
          className="object-cover border border-white w-full h-auto"
        />
      </div>

      {/* Basic Info */}
      <h2 className="text-3xl font-bold mb-2">{item.title}</h2>
      <p className="mb-1"><strong>{item.shortDescription}</strong></p>
      <p className="mb-1"><strong>{item.when}</strong></p>
      <p className="mb-4"><strong>{item.price}</strong></p>

      {/* Buttons */}
      <div className="flex flex-wrap gap-4 mt-4">
        <a
          href={item.registrationLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 border border-[#f5f5dc] text-[#f5f5dc] rounded-full hover:bg-[#f5f5dc] hover:text-black transition"
        >
          Register
        </a>

        <button
          onClick={() => setExpanded(!expanded)}
          className="px-4 py-2 border border-[#8B0000] text-[#f5f5dc] rounded-full hover:bg-[#8B0000] transition"
        >
          {expanded ? 'Less' : 'More'}
        </button>
      </div>

      {/* Expandable Description */}
      {expanded && (
        <p className="mt-4 text-justify leading-relaxed">
          {item.description}
        </p>
      )}
    </div>
  );
}
