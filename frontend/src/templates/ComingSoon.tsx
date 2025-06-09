'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import { useEffect } from 'react';

export default function ComingSoon() {
  useEffect(() => {
    console.log('ComingSoon mounted');
  }, []);
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-black text-[#f5f5dc] px-4 overflow-hidden">
      <RaaHieroglyphMatrix />

      {/* Foreground Content with White Border */}
      <div className="border-white border-[3pt] p-8 rounded-lg z-10 bg-black">
        <h1 className="text-4xl font-bold mb-6 text-center">ENTER RAA SPACE</h1>

        <form
          action="https://formspree.io/f/xkgbwlyr"
          method="POST"
          className="flex flex-col sm:flex-row items-center gap-2"
        >
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            className="px-4 py-2 bg-transparent border border-[#f5f5dc] rounded-full text-[#f5f5dc] placeholder-[#f5f5dc]/70 focus:outline-none focus:ring-2 focus:ring-[#f5f5dc]"
          />
          <button
            type="submit"
            className="px-4 py-2 border border-[#f5f5dc] bg-transparent text-[#f5f5dc] font-semibold rounded-full hover:bg-[#f5f5dc] hover:text-black transition"
          >
            ENTER
          </button>
        </form>
      </div>
    </div>
  );
}
