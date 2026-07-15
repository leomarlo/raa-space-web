'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function BackToProgram() {
  const { t } = useLanguage();

  return (
    <div className="mt-8 clear-both">
      <Link
        href="/program"
        className="inline-block rounded border border-current px-4 py-2 transition-colors hover:bg-[#f5f5dc] hover:text-black"
      >
        ← {t.backToProgram}
      </Link>
    </div>
  );
}
