'use client';

import Head from 'next/head';
import RaaHieroglyphMatrix from '@/components/RaaHieroglyphMatrix';
import Entrance from '@/components/Entrance';
import RegisterForm from '@/components/RegisterForm';
import { useState } from 'react';

export default function RaaPage() {
    const [navOpen, setNavOpen] = useState(false);
  
    return (
      <div className="relative w-full h-screen overflow-hidden">
        <Head>
            <title>RAA SPACE | Enter</title>
        </Head>
        <RaaHieroglyphMatrix frequency={0} initialState={0} />
        <Entrance
          initialNavOpen={false}
          initialMenuSelection={null}
          itemArrangement={1}
          navOpen={navOpen}
          setNavOpen={setNavOpen}
        />
      </div>
    );
  }