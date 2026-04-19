import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'ACT Forge | ACT Prep, Practice, and AI Review',
  description:
    'ACT-focused learning with section guides, practice problems, and an AI clarification coach grounded in a local knowledge file.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-slate-950 text-white">{children}</body>
    </html>
  );
}
