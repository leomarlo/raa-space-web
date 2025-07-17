'use client';

import Image from 'next/image';
import { useState } from 'react';

interface PersonItem {
  id: string;
  image: string;
  name: string;
  role: string;
  description: string;
}

export default function PersonCard({ person }: { person: PersonItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto mb-8 gap-8">
      {/* Left: Square Image Box */}
      <div className="relative w-full md:w-1/5 aspect-square border-[3pt] border-black">
        <Image
          src={person.image}
          alt={person.name}
          fill
          loading="lazy"
          className="object-cover"
        />
      </div>

      {/* Right: Wide Rectangle Text Box */}
      <div className="flex-1 border-[3pt] border-black bg-black text-[#f5f5dc] p-6 md:p-8 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">{person.name}</h2>
          <p className="text-lg font-semibold mb-2">{person.role}</p>
          {expanded && (
            <p className="mt-2 text-justify leading-relaxed whitespace-pre-line">
              {person.description}
            </p>
          )}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 self-start px-4 py-2 border border-[#8B0000] text-[#f5f5dc] rounded-full hover:bg-[#8B0000] transition"
        >
          {expanded ? 'Less' : 'More'}
        </button>
      </div>
    </div>
  );
}
