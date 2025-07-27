'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { RegisterFormWithDifferentLinks } from '@/components/RegisterForm';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { RegisterFormProps, RegisterFormPropsWithLink } from '@/types/main';

export default function FireWorkshopWithArteRaitumaPage() {
    const [navOpen, setNavOpen] = useState(false);
    const { t } = useLanguage();

    const event = t.program.items.fireWorkshop;
    const regForm2ndOfAugust: RegisterFormProps = {
      title: t.program.items.fireWorkshop.title,
      description: t.program.items.fireWorkshop.shortDescription,
      placeholder: t.registerWorkshop.placeholder,
      submit: `${event.registerFor2ndOfAugust}. ${event.times}`,
    };
    const regForm3rdOfAugust: RegisterFormProps = {
      title: '',
      description: '',
      placeholder: t.registerWorkshop.placeholder,
      submit: `${event.registerFor3rdOfAugust}. ${event.times}`,
    };
    const formWithLinks: RegisterFormPropsWithLink[] = [
      { registerFormProps: regForm2ndOfAugust, link: "https://formspree.io/f/mzzvddrk" },
      { registerFormProps: regForm3rdOfAugust, link: "https://formspree.io/f/xnnzdkzg" },
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