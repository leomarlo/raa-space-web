'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ChessWeekShortRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/events/chess-week');
  }, [router]);

  return null;
}
