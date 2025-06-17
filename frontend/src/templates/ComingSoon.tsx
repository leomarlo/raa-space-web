'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import { useEffect } from 'react';
import { RaaHieroglyphMatrixProps } from '@/types/main';
import { useRouter } from 'next/navigation';


export default function ComingSoon() {
  const router = useRouter();

  useEffect(() => {
    console.log('ComingSoon mounted');
  }, []);

  const handleEnter = () => {
    router.push('/enter');
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-black text-[#f5f5dc] px-4 overflow-hidden">
      <RaaHieroglyphMatrix frequency={1300} initialState={0}/>

      {/* Foreground Content with White Border */}
      <div className="border-white border-[3pt] p-8 rounded-lg z-10 bg-black">
        <h1 className="text-4xl font-bold mb-6 text-center">ENTER RAA SPACE</h1>

        <button
          onClick={handleEnter}
          className="px-6 py-3 border border-[#f5f5dc] bg-transparent text-[#f5f5dc] font-semibold rounded-full hover:bg-[#f5f5dc] hover:text-black transition"
        >
          ENTER
        </button>
      </div>
    </div>
  );
}
