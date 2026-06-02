'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { OpenCallItem } from '@/types/calls';
import Image from 'next/image';
import Link from 'next/link';

function OpenCallCard({ item }: { item: OpenCallItem }) {
  const [expanded, setExpanded] = useState(false);
  const isPast = new Date(item.deadline) < new Date();

  return (
    <div
      className={`border-[3pt] border-black bg-black text-[#f5f5dc] p-6 md:p-8 max-w-3xl w-full mx-auto mb-8 transition-opacity ${
        isPast ? 'opacity-40' : 'opacity-100'
      }`}
    >
      <div className="w-full mb-4">
        <Link href={item.url}>
          <Image
            src={item.image.replace(/(\.[^.]+)$/, '-mid$1')}
            alt={item.title}
            width={540}
            height={675}
            sizes="100vw"
            loading="lazy"
            className="w-full h-auto object-contain mx-auto cursor-pointer"
          />
        </Link>
      </div>
      <h2 className="text-3xl font-bold mb-2">{item.title}</h2>
      <p className="mb-4 leading-relaxed"><strong>{item.shortDescription}</strong></p>
      {isPast && (
        <p className="text-sm text-[#8B0000] mb-4">This call is closed.</p>
      )}
      <div className="flex flex-wrap gap-4 mt-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-4 py-2 border border-[#8B0000] text-[#f5f5dc] rounded-full hover:bg-[#8B0000] transition"
        >
          {expanded ? 'Less' : 'More'}
        </button>
        {item.pdfLink && (
          <a
            href={item.pdfLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-[#f5f5dc] text-[#f5f5dc] rounded-full hover:bg-[#f5f5dc] hover:text-black transition"
          >
            Open Call (PDF)
          </a>
        )}
        {item.emailAddress && (
          <a
            href={`mailto:${item.emailAddress}`}
            className="px-4 py-2 border border-[#f5f5dc] text-[#f5f5dc] rounded-full hover:bg-[#f5f5dc] hover:text-black transition"
          >
            {item.emailAddress}
          </a>
        )}
      </div>
      {expanded && (
        <p className="mt-4 text-justify leading-relaxed whitespace-pre-line">
          {item.description}
        </p>
      )}
    </div>
  );
}

export default function CallsPageClient() {
  const [navOpen, setNavOpen] = useState(false);
  const { t } = useLanguage();

  const callItems: OpenCallItem[] = Object.values(t.calls.items).sort(
    (a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
  );

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <RaaHieroglyphMatrix frequency={0} initialState={0} />
      {navOpen && <div className="absolute inset-0 bg-black/70 z-30 pointer-events-auto" />}
      <Entrance initialMenuSelection={'Open Calls'} itemArrangement={2} navOpen={navOpen} setNavOpen={setNavOpen} />

      <div className="absolute inset-0 z-10 overflow-auto py-20 px-4 sm:px-8 pointer-events-auto flex justify-center">
        <div className="max-w-5xl w-full">
          <h1 className="text-4xl font-bold text-[#f5f5dc] mb-10 text-center">{t.calls.pageTitle}</h1>
          {callItems.map((item) => (
            <OpenCallCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
