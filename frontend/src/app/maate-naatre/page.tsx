'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useState, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function MaateNaatrePage() {
  const [navOpen, setNavOpen] = useState(false);
  const { locale } = useLanguage();

  const isClosedPeriod = useMemo(() => {
    const today = new Date();
    const start = new Date(2026, 4, 25); // May 25, 2026
    const end   = new Date(2026, 5, 25, 23, 59, 59); // Jun 25, 2026
    return today >= start && today <= end;
  }, []);

  const isLat = locale === 'lat';

  return (
    <div className="relative w-full min-h-screen text-[#f5f5dc]">
      <div className="fixed inset-0 -z-10">
        <RaaHieroglyphMatrix frequency={0} initialState={0} />
      </div>

      {navOpen && (
        <div className="absolute inset-0 bg-black/70 z-30 pointer-events-auto" />
      )}

      <Entrance
        initialMenuSelection="Meža Bārs"
        itemArrangement={2}
        navOpen={navOpen}
        setNavOpen={setNavOpen}
      />

      <div className="relative z-10 py-20 px-4 sm:px-8 pointer-events-auto flex justify-center">
        <div className="max-w-2xl w-full bg-black/80 p-8 sm:p-12 rounded-lg shadow-lg flex flex-col gap-8">

          <h1 className="text-4xl font-bold text-center tracking-wide">
            Meža Bārs
          </h1>

          {isClosedPeriod && (
            <div className="border-[3pt] border-green-500 bg-black p-6 rounded-lg text-center green-glow-box">
              <p className="text-green-400 font-bold text-lg mb-1">
                {locale === 'lat' ? 'Meža Bārs būs slēgts' : 'Forest Bar will be closed'}
              </p>
              <p className="text-[#f5f5dc]">
                {locale === 'lat'
                  ? '8. – 25. jūnijs (vasaras atvaļinājums)'
                  : '8 – 25 June (summer leave)'}
              </p>
            </div>
          )}

          <div className="leading-relaxed text-justify text-lg">
            {isLat ? (
              <>
                <p>
                  Māte Nātre ir meža bārs RAA telpā — mazs, klusāks stūrītis Matīsa ielā 8,
                  kur Latvijas meža gars ir nonācis Rīgas centrā.
                </p>
                <p className="mt-4">
                  Bārs piedāvā dabas iedvesmotas dziras — zāļu tējas, augļu un ogu dzērienus un
                  citus mājīgus meža gardumus — ko baudīt starp izstādēm, izrādēm un ikdienas
                  burzmas pauzēs.
                </p>
                <p className="mt-4">
                  Māte Nātre ir daļa no RAA — kultūras telpas, kas mājo Veldzes radošajā rūpnīcā.
                  Te vari ienākt, palikt un sajust Latvijas dabu pat neizejot no pilsētas.
                </p>
              </>
            ) : (
              <>
                <p>
                  Māte Nātre is a forest bar inside RAA — a small, unhurried corner at Matīsa iela 8,
                  where a little bit of the Latvian forest has found its way into the centre of Riga.
                </p>
                <p className="mt-4">
                  The bar offers nature-inspired drinks — herbal teas, fruit and berry concoctions,
                  and other quietly delicious things — to savour between exhibitions, performances,
                  and the pauses that everyday life sometimes needs.
                </p>
                <p className="mt-4">
                  Māte Nātre is part of RAA, a cultural space inside the Veldze Creative Factory.
                  Come in, stay a while, and take in the forest without leaving the city.
                </p>
              </>
            )}
          </div>

          <a
            href="https://maatenaatre.lv"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-[#8B0000] hover:bg-[#a00000] text-[#f5f5dc] font-extrabold text-2xl uppercase tracking-widest py-5 px-8 transition-colors"
            style={{ border: '2px solid #f5f5dc' }}
          >
            maatenaatre.lv
          </a>

        </div>
      </div>
    </div>
  );
}
