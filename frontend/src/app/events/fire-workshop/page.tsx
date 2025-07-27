'use client';

import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { RegisterFormInline } from '@/components/RegisterForm';
import { RegisterFormProps } from '@/types/main';

export default function FireWorkshopPage() {
  const [navOpen, setNavOpen] = useState(false);
  const { t } = useLanguage();

  const event = t.program.items.fireWorkshop;
  const regForm2ndOfAugust: RegisterFormProps = {
    title: '',
    description: `${event.registerFor2ndOfAugust}. ${event.times}`,
    placeholder: t.registerWorkshop.placeholder,
    submit: t.registerWorkshop.submit,
  };

  const regForm3rdOfAugust: RegisterFormProps = {
    title: '',
    description: `${event.registerFor3rdOfAugust}. ${event.times}`,
    placeholder: t.registerWorkshop.placeholder,
    submit: t.registerWorkshop.submit,
  };

  return (
    <div className="relative w-full min-h-screen text-[#f5f5dc]">
      {/* Background effect */}
      <div className="absolute inset-0 -z-10">
        <RaaHieroglyphMatrix frequency={0} initialState={0} />
      </div>

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
      <div className="relative z-10 py-20 px-4 sm:px-8 pointer-events-auto flex justify-center">
        {/* Black box only for content */}
        <div className="max-w-4xl w-full bg-black p-6 sm:p-8 rounded-lg shadow-lg">
          {/* Event Title */}
          <h1 className="text-4xl font-bold mb-6 text-center">
            {event.title}
          </h1>

          {/* Event Description */}
          <div className="text-justify leading-relaxed whitespace-pre-line">
            {event.description}
          </div>

          {/* Price */}
          <div className="mt-6 text-justify leading-relaxed whitespace-pre-line">
            Price: {event.price}
          </div>

          {/* Register Form */}
          <div className="mt-6">
            <RegisterFormInline
              registerFormProps={regForm2ndOfAugust}
              link={"https://formspree.io/f/mzzvddrk"}
            />
            <RegisterFormInline
              registerFormProps={regForm3rdOfAugust}
              link={"https://formspree.io/f/xnnzdkzg"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
