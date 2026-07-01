'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ItemRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/events/item');
  }, [router]);
  return null;
}
