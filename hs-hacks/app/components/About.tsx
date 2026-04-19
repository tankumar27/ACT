'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { studyPath } from '@/lib/act-content';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, x: -100 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="bg-slate-950 py-20 px-4">
      <div className="mx-auto max-w-6xl">
        <div ref={contentRef} className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.32em] text-sky-300">
              Study blueprint
            </p>
            <h2 className="mb-6 text-4xl font-bold text-white">
              A more furnished ACT experience without losing the front-page feel
            </h2>
            <p className="mb-6 text-lg leading-8 text-slate-300">
              The homepage now introduces a full ACT workflow: section learning, guided practice, and a
              follow-up review path for missed questions. Students can move from overview to action without
              bouncing between unrelated screens.
            </p>
            <p className="text-lg leading-8 text-slate-300">
              The AI support layer is grounded in a local text file so you can update the ACT guidance later
              from the backend and keep answers tightly controlled.
            </p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-sky-500/15 via-slate-900 to-indigo-500/15 p-8">
            <h3 className="mb-4 text-2xl font-semibold text-white">Student flow</h3>
            <div className="space-y-4">
              {studyPath.map((item) => (
                <div key={item.title} className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-200">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
