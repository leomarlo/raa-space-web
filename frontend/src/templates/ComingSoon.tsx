'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import { useEffect } from 'react';
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
        <p className="text-center mb-6 max-w-3xl mx-auto">
        RAA is a pop-up venue that hosts regular theatrical and contemporary performances, exhibitions and workshops. 
        A little herbal bar offers the possibility to take in some Latvian forest in the centre of Riga. <br />
        <br />
        <br />
        <br />
        We are opening on July 11th, 2025.
        </p>
        <div className="flex justify-center">
          <button
            onClick={handleEnter}
            className="px-6 py-3 border border-[#f5f5dc] bg-transparent text-[#f5f5dc] font-semibold rounded-full hover:bg-[#f5f5dc] hover:text-black transition"
          >
            ENTER
          </button>
        </div>
      </div>
    </div>
  );
}
