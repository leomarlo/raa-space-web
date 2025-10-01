'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { RegisterFormWithDifferentLinks } from '@/components/RegisterForm';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { RegisterFormProps, RegisterFormPropsWithLink } from '@/types/main';

export default function ResTactaPage() {
    const [navOpen, setNavOpen] = useState(false);
    const { t } = useLanguage();

    const event = t.program.items.resTacta;
    const regForm1stOfSeptember: RegisterFormProps = {
      title: t.program.items.resTacta.title,
      description: t.program.items.resTacta.shortDescription,
      placeholder: t.registerWorkshop.placeholder,
      submit: `${event.registerForResTacta}. ${event.times}`,
    };
    const formWithLinks: RegisterFormPropsWithLink[] = [
      { registerFormProps: regForm1stOfSeptember, link: event.registrationLink },
    ];
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
        <RegisterFormWithDifferentLinks formWithLinks={formWithLinks} />
      </div>
    );
  }