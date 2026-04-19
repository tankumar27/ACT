'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const tips = [
  {
    title: 'Review every miss',
    description:
      'A wrong answer becomes useful only after you label the skill and compare your choice with the correct one.',
    icon: '01',
  },
  {
    title: 'Train with short timers',
    description: 'Use compact practice sets so pacing feels normal before you move to longer ACT sections.',
    icon: '02',
  },
  {
    title: 'Track recurring traps',
    description: 'Write down if you missed because of vocabulary, units, transitions, or unsupported inference.',
    icon: '03',
  },
  {
    title: 'Use the graph before the paragraph',
    description: 'In Science, titles, axes, and units often answer the question faster than the full passage.',
    icon: '04',
  },
  {
    title: 'Return to evidence',
    description:
      'In Reading and English, the best answer is the one the text actually supports, not the one that sounds impressive.',
    icon: '05',
  },
  {
    title: 'Ask for simpler clarity',
    description:
      'Use the AI review page after a miss when you need the same idea explained in plainer language.',
    icon: '06',
  },
];

export default function Tips() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const tipsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      tipsRef.current.forEach((tip, index) => {
        gsap.fromTo(
          tip,
          { opacity: 0, y: 100, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: index * 0.15,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: tip,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="tips" ref={sectionRef} className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 py-20 px-4">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center text-4xl font-bold text-white">Habits that lift ACT scores</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tips.map((tip, index) => (
            <div
              key={tip.title}
              ref={(element) => {
                if (element) {
                  tipsRef.current[index] = element;
                }
              }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/10 text-sm font-semibold tracking-[0.22em] text-sky-200">
                {tip.icon}
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">{tip.title}</h3>
              <p className="leading-7 text-slate-300">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
