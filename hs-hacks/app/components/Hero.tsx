'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { homepageStats } from '@/lib/act-content';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
      );
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power2.out' },
      );

      cardsRef.current.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40, rotateX: -12 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            delay: 0.45 + index * 0.12,
            ease: 'power2.out',
          },
        );
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.24),_transparent_30%),linear-gradient(135deg,#020617_0%,#0f172a_48%,#1e1b4b_100%)]"
    >
      <div className="absolute inset-0 opacity-50">
        <div className="absolute left-[12%] top-[18%] h-48 w-48 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="absolute right-[10%] top-[22%] h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-[12%] left-[28%] h-56 w-56 rounded-full bg-fuchsia-500/15 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="text-center lg:text-left">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.38em] text-sky-300">
              ACT Learning Platform
            </p>
            <h1 ref={titleRef} className="mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl">
              Keep the immersive landing page. Turn the rest into your{' '}
              <span className="bg-gradient-to-r from-sky-300 via-cyan-200 to-indigo-200 bg-clip-text text-transparent">
                ACT command center
              </span>
              .
            </h1>
            <p ref={subtitleRef} className="mb-8 max-w-3xl text-xl leading-9 text-slate-300 md:text-2xl">
              Learn Math, Science, English, and Reading with structured guides, practice drills, and
              an AI coach that answers only from your editable ACT knowledge file.
            </p>
            <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
              <Link
                href="/practice"
                className="rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-500 px-8 py-3 text-lg font-semibold text-white transition hover:brightness-110"
              >
                Start practice
              </Link>
              <Link
                href="/chat"
                className="rounded-full border border-white/15 bg-white/10 px-8 py-3 text-lg font-semibold text-white transition hover:bg-white/15"
              >
                Ask the ACT chatbot
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {homepageStats.map((stat, index) => (
              <div
                key={stat.label}
                ref={(element) => {
                  if (element) {
                    cardsRef.current[index] = element;
                  }
                }}
                className="rounded-[2rem] border border-white/10 bg-white/8 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.35)] backdrop-blur"
              >
                <p className="text-sm uppercase tracking-[0.26em] text-slate-400">{stat.label}</p>
                <p className="mt-3 text-4xl font-semibold text-white">{stat.value}</p>
              </div>
            ))}
            <div className="rounded-[2rem] border border-sky-400/20 bg-sky-400/10 p-6 text-left shadow-[0_20px_80px_rgba(14,165,233,0.18)]">
              <p className="text-sm uppercase tracking-[0.26em] text-sky-200">Built for review</p>
              <p className="mt-3 text-base leading-8 text-slate-100">
                Wrong-answer recovery now has its own route, so students can slow down, compare answers,
                and ask for a simpler explanation before moving on.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
