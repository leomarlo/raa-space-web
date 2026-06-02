'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';

function renderLine(line: string, key: number) {
  const parts = line.split(/(RAA\.SPACE|RAA SPACE|RAA space|the space of RAA)/g);
  return (
    <span key={key}>
      {parts.map((part, i) =>
        /RAA\.SPACE|RAA SPACE|RAA space|the space of RAA/.test(part) ? (
          <Link key={i} href="/telpa" className="underline hover:text-[#8B0000] transition-colors">
            {part}
          </Link>
        ) : (
          part
        )
      )}
    </span>
  );
}

function Paragraph({ text, className = '' }: { text: string; className?: string }) {
  const lines = text.split('\n');
  return (
    <p className={`leading-relaxed mb-4 ${className}`}>
      {lines.map((line, i) => (
        <span key={i}>
          {renderLine(line, i)}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </p>
  );
}

export default function ItemCallPage() {
  const [navOpen, setNavOpen] = useState(false);
  const { t } = useLanguage();

  const call = t.calls.items.item;
  const isPast = new Date(call.deadline) < new Date();

  // Split into paragraphs on double newline
  const paragraphs = call.description.split('\n\n');
  // First section: open call info (before the divider "— — —")
  const dividerIndex = paragraphs.findIndex((p) => p.trim().startsWith('—'));
  const openCallSection = dividerIndex > 0 ? paragraphs.slice(0, dividerIndex) : paragraphs;
  const divider = dividerIndex > 0 ? paragraphs[dividerIndex] : null;
  const descSection = dividerIndex > 0 ? paragraphs.slice(dividerIndex + 1) : [];

  return (
    <div className="relative w-full min-h-screen text-[#f5f5dc]">
      <div className="fixed inset-0 -z-10">
        <RaaHieroglyphMatrix frequency={0} initialState={0} />
      </div>

      {navOpen && (
        <div className="absolute inset-0 bg-black/70 z-30 pointer-events-auto" />
      )}

      <Entrance
        initialMenuSelection={null}
        itemArrangement={1}
        navOpen={navOpen}
        setNavOpen={setNavOpen}
      />

      <div className="relative z-10 py-20 px-4 sm:px-8 pointer-events-auto flex justify-center">
        <div className={`max-w-4xl w-full bg-black/70 p-6 sm:p-8 rounded-lg shadow-lg ${isPast ? 'opacity-60' : ''}`}>
          {isPast && (
            <p className="text-center text-[#8B0000] mb-4 font-semibold">This call is now closed.</p>
          )}
          <h1 className="text-4xl font-bold mb-8 text-center">{call.title}</h1>

          {/* Open call info section with poster image floating right */}
          <div className="overflow-hidden mb-6">
            {call.image && (
              <div className="mb-4 md:float-right md:w-2/5 md:ml-6 md:mb-2">
                <Image
                  src={call.image.replace(/(\.[^.]+)$/, '-mid$1')}
                  alt={call.title}
                  width={540}
                  height={675}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}
            {openCallSection.map((para, i) => (
              <Paragraph key={i} text={para} />
            ))}
            <div className="clear-both" />
          </div>

          {/* Divider */}
          {divider && (
            <p className="text-center text-lg mb-6 tracking-widest">{divider}</p>
          )}

          {/* Event description section with telpa image floating left */}
          {descSection.length > 0 && (
            <div className="overflow-hidden">
              <div className="mb-4 md:float-left md:w-2/5 md:mr-6 md:mb-2">
                <Image
                  src="/assets/telpa/raa-galerija-1.jpg"
                  alt="RAA Space"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover rounded-lg"
                />
                <Link
                  href="/telpa"
                  className="block text-center text-xs mt-1 text-[#f5f5dc]/60 hover:text-[#8B0000] transition-colors"
                >
                  RAA.SPACE — Matīsa iela 8
                </Link>
              </div>
              {descSection.map((para, i) => (
                <Paragraph key={i} text={para} />
              ))}
              <div className="clear-both" />
            </div>
          )}

          {/* Links */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            {call.pdfLink && (
              <a
                href={call.pdfLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-[#f5f5dc] px-6 py-2 text-sm hover:bg-[#f5f5dc] hover:text-black transition-colors"
              >
                Open Call Poster (PDF)
              </a>
            )}
            {call.emailAddress && (
              <a
                href={`mailto:${call.emailAddress}`}
                className="inline-block border border-[#f5f5dc] px-6 py-2 text-sm hover:bg-[#f5f5dc] hover:text-black transition-colors"
              >
                {call.emailAddress}
              </a>
            )}
          </div>

          {/* Gallery photo */}
          <div className="w-full mt-10">
            <Image
              src="/assets/item/opencall/raagallery_1505_-172.jpg"
              alt="RAA Gallery"
              width={1200}
              height={800}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
