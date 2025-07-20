'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { RegisterForm } from '@/components/RegisterForm';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { RegisterFormProps } from '@/types/main';

export default function FireWorkshopWithArteRaitumaPage() {
    const [navOpen, setNavOpen] = useState(false);
    const { t } = useLanguage();
    const link = t.program.items.fireWorkshop.registrationLink;
    const regForm: RegisterFormProps = {
      title: t.program.items.fireWorkshop.title,
      description: t.program.items.fireWorkshop.shortDescription,
      placeholder: t.registerWorkshop.placeholder,
      submit: t.registerWorkshop.submit,
    };
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
        <RegisterForm registerFormProps={regForm} link={link} />
      </div>
    );
  }