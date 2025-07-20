'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { RegisterFormInline } from '@/components/RegisterForm';
import { RegisterFormProps } from '@/types/main';


export default function FireWorkshopPage() {
  const [navOpen, setNavOpen] = useState(false);
  const { t } = useLanguage(); // Access localized text

  const event = t.program.items.fireWorkshop; // Shortcut
  const regForm: RegisterFormProps = {
    title: "",
    description: "",
    placeholder: t.registerWorkshop.placeholder,
    submit: t.registerWorkshop.submit,
  };
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background effect */}
      <RaaHieroglyphMatrix frequency={0} initialState={0} />
      {navOpen && (
        <div className="absolute inset-0 bg-black/70 z-30 pointer-events-auto" />
      )}
      <Entrance
        initialMenuSelection={null}
        itemArrangement={1}
        navOpen={navOpen}
        setNavOpen={setNavOpen}
      />

      {/* Content area */}
      <div className="absolute inset-0 z-10 overflow-auto py-20 px-4 sm:px-8 pointer-events-auto flex justify-center">
        <div className="w-full sm:w-10/12 md:w-8/12 bg-black text-[#f5f5dc] p-6 sm:p-8 rounded-lg shadow-lg">
          {/* Event Title */}
          <h1 className="text-4xl font-bold mb-6 text-center">
            {event.title}
          </h1>

          {/* Event Description */}
          <div className="text-justify leading-relaxed whitespace-pre-line">
            {event.description}
          </div>
          <br />
          <div className="text-justify leading-relaxed whitespace-pre-line">
            Price: {event.price}
          </div>
          <RegisterFormInline registerFormProps={regForm} link={event.registrationLink} />
        </div>
      </div>
    </div>
  );
}
