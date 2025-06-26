'use client';

import { useRouter } from 'next/navigation';
import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import { useLanguage } from '@/context/LanguageContext';

export default function ComingSoon() {
  const router = useRouter();
  const { locale, setLocale, t } = useLanguage();

  const handleEnter = () => {
    router.push('/enter');
  };

  const toggleLabel = locale === 'eng' ? 'Latviski, lūdzu' : 'In British English, please';
  const toggleBgColor = locale === 'eng' ? '#8B0000' : '#00008B'; // red or blue

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-black text-[#f5f5dc] px-4 overflow-hidden">
      <RaaHieroglyphMatrix frequency={1300} initialState={0} />

      {/* Language Toggle */}
      <div className="fixed top-6 right-6 z-20">
        <button
          onClick={() => setLocale(locale === 'eng' ? 'lat' : 'eng')}
          className="px-4 py-2 border border-white rounded-md uppercase font-semibold text-[#f5f5dc]"
          style={{ backgroundColor: toggleBgColor }}
        >
          {toggleLabel}
        </button>
      </div>

      {/* Main Content */}
      <div className="border-white border-[3pt] p-8 rounded-lg z-10 bg-black w-full max-w-3xl">
        <h1 className="text-4xl font-bold mb-6 text-center">{t.title}</h1>
        <p className="text-center mb-6">
          {t.description}
          <br /><br /><br /><br />
          {t.openingNote}
        </p>
        <div className="flex justify-center">
          <button
            onClick={handleEnter}
            className="px-6 py-3 border border-[#f5f5dc] bg-transparent text-[#f5f5dc] font-semibold rounded-full hover:bg-[#f5f5dc] hover:text-black transition"
          >
            {t.enterButton}
          </button>
        </div>
      </div>
    </div>
  );
}
