import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import BackgroundVisual from './components/BackgroundVisual';
import Navbar from './components/Navbar';
import ScrollReveal from './components/ScrollReveal';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ACT Forge | Premium ACT Prep With AI Practice',
  description:
    'A polished ACT prep experience with AI-generated section sets, live review flows, and interactive WebGL visuals.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-full flex-col bg-black text-white`}
      >
        <BackgroundVisual />
        <Navbar />
        <ScrollReveal />
        <div className="relative z-10 flex min-h-full flex-col pt-20 md:pt-24">{children}</div>
      </body>
    </html>
  );
}
