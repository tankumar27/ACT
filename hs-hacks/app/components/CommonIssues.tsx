'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { sectionMeta, sectionOrder } from '@/lib/act-content';

gsap.registerPlugin(ScrollTrigger);

export default function CommonIssues() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLAnchorElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="issues" ref={sectionRef} className="bg-slate-900 py-20 px-4">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center text-4xl font-bold text-white">Explore the four ACT sections</h2>
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {sectionOrder.map((section, index) => {
            const subject = sectionMeta[section];

            return (
              <Link
                key={subject.name}
                href={`/subjects/${section}`}
                ref={(element) => {
                  if (element) {
                    cardsRef.current[index] = element;
                  }
                }}
                className={`rounded-3xl bg-gradient-to-br ${subject.accent} p-[1px] shadow-lg transition-shadow duration-300 hover:shadow-xl`}
              >
                <div className="h-full rounded-3xl bg-slate-950/85 p-6">
                  <h3 className="mb-3 text-xl font-semibold text-white">{subject.name}</h3>
                  <p className="leading-7 text-slate-300">{subject.summary}</p>
                  <p className="mt-5 text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">
                    Open section page
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
