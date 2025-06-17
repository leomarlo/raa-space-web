import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RAA SPACE",
  description: "Raa is a venue for performances, exhibitions, and workshops in Riga.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "RAA SPACE",
    description: "Raa is a venue for performances, exhibitions, and workshops in Riga.",
    url: "https://raa.space",
    siteName: "RAA SPACE",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "RAA SPACE Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RAA SPACE",
    description: "Raa is a venue for performances, exhibitions, and workshops in Riga.",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>RAA SPACE</title>
        <meta name="description" content="Raa is a venue for performances, exhibitions, and workshops in Riga." />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
