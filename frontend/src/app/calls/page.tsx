import type { Metadata } from "next";
import CallsPageClient from '@/components/CallsPageClient';

export const metadata: Metadata = {
  title: "Open Calls | RAA SPACE",
  description: "Open calls for artists and collaborators at RAA SPACE in Riga, Latvia.",
  openGraph: {
    title: "Open Calls | RAA SPACE",
    description: "Open calls for artists and collaborators at RAA SPACE in Riga, Latvia.",
    url: "https://raa.space/calls",
    siteName: "RAA SPACE",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "RAA SPACE Open Calls",
      },
    ],
    type: "website",
  },
};

export default function CallsPage() {
  return <CallsPageClient />;
}
