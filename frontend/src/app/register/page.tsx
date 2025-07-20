'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { RegisterForm } from '@/components/RegisterForm';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function RegisterPage() {
    const [navOpen, setNavOpen] = useState(false);
    const link = "https://formspree.io/f/xkgbwlyr"
    const { t } = useLanguage();
    return (
      <div className="relative w-full h-screen overflow-hidden">
        <RaaHieroglyphMatrix frequency={0} initialState={0} />
        {navOpen && (
          <div className="absolute inset-0 bg-black/70 z-30 pointer-events-auto" />
        )}
        <Entrance
          initialMenuSelection={'Register'}
          itemArrangement={2}
          navOpen={navOpen}
          setNavOpen={setNavOpen}
        />
        <RegisterForm registerFormProps={t.register} link={link} />
      </div>
    );
  }