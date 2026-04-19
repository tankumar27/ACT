'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-slate-950/80 shadow-lg shadow-slate-950/25 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="text-2xl font-bold text-sky-300">
            ACT Forge
          </Link>
          <div className="hidden space-x-8 md:flex">
            <button onClick={() => scrollToSection('hero')} className="text-slate-200 transition-colors hover:text-sky-300">
              Home
            </button>
            <button onClick={() => scrollToSection('about')} className="text-slate-200 transition-colors hover:text-sky-300">
              Blueprint
            </button>
            <button onClick={() => scrollToSection('issues')} className="text-slate-200 transition-colors hover:text-sky-300">
              Subjects
            </button>
            <button onClick={() => scrollToSection('resources')} className="text-slate-200 transition-colors hover:text-sky-300">
              Tools
            </button>
            <button onClick={() => scrollToSection('tips')} className="text-slate-200 transition-colors hover:text-sky-300">
              Habits
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-slate-200 transition-colors hover:text-sky-300">
              Plan
            </button>
            <Link href="/practice" className="text-slate-200 transition-colors hover:text-sky-300">
              Practice
            </Link>
            <Link href="/chat" className="text-slate-200 transition-colors hover:text-sky-300">
              Chatbot
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
