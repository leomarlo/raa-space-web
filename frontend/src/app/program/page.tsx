import type { Metadata } from "next";
import ProgramPageClient from '@/components/ProgramPageClient';

export const metadata: Metadata = {
  title: "Program | RAA SPACE",
  description: "Explore our program of performances, exhibitions, and workshops at RAA SPACE in Riga. Discover upcoming events and cultural experiences.",
  openGraph: {
    title: "Program | RAA SPACE",
    description: "Explore our program of performances, exhibitions, and workshops at RAA SPACE in Riga. Discover upcoming events and cultural experiences.",
    url: "https://raa.space/program",
    siteName: "RAA SPACE",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "RAA SPACE Program",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Program | RAA SPACE",
    description: "Explore our program of performances, exhibitions, and workshops at RAA SPACE in Riga. Discover upcoming events and cultural experiences.",
    images: ["/opengraph-image.png"],
  },
};

export default function ProgramPage() {
  return <ProgramPageClient />;
}
