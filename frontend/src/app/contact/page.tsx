'use client';

import Head from 'next/head';
import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import RegisterForm from '@/components/RegisterForm';
import { useState } from 'react';

export default function ContactPage() {
    const [navOpen, setNavOpen] = useState(true);
  
    return (
      <div className="relative w-full h-screen overflow-hidden">
        <Head>
            <title>RAA SPACE | Contact</title>
        </Head>
        <RaaHieroglyphMatrix frequency={0} initialState={0} />
        <Entrance
          initialNavOpen={true}
          initialMenuSelection={'Contact'}
          itemArrangement={2}
          navOpen={navOpen}
          setNavOpen={setNavOpen}
        />
      </div>
    );
  }