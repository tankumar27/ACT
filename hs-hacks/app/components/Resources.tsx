'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const resources = [
  {
    title: 'ACT practice arena',
    description: 'A dedicated practice page with instant answer checking and section filters.',
    link: '/practice',
    type: 'Practice',
  },
  {
    title: 'ACT chatbot',
    description: 'A Gemini-powered coach that responds only from the ACT knowledge text file.',
    link: '/chat',
    type: 'AI help',
  },
  {
    title: 'Math and Science review',
    description: 'Fast reinforcement for equations, geometry, graphs, controls, and data trends.',
    link: '/subjects/math',
    type: 'STEM',
  },
  {
    title: 'English and Reading review',
    description: 'Target transitions, grammar, main idea, and evidence-based elimination.',
    link: '/subjects/english',
    type: 'Verbal',
  },
  {
    title: 'Missed-question recovery',
    description: 'Any wrong answer can open its own explanation route with extra AI clarification.',
    link: '/review/english-transition?answer=A',
    type: 'Review',
  },
  {
    title: 'Editable knowledge source',
    description: 'All AI responses are grounded in a backend-friendly text file that can be updated later.',
    link: '/chat',
    type: 'Backend',
  },
];

export default function Resources() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLAnchorElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        },
      );

      cardsRef.current.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, rotateY: -90 },
          {
            opacity: 1,
            rotateY: 0,
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
    <section id="resources" ref={sectionRef} className="bg-slate-950 py-20 px-4">
      <div className="mx-auto max-w-6xl">
        <h2 ref={titleRef} className="mb-12 text-center text-4xl font-bold text-white">
          Built-in ACT tools
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource, index) => (
            <Link
              key={resource.title}
              href={resource.link}
              ref={(element) => {
                if (element) {
                  cardsRef.current[index] = element;
                }
              }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="mb-3 flex items-start justify-between">
                <h3 className="text-lg font-semibold text-white">{resource.title}</h3>
                <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-2 py-1 text-xs text-sky-200">
                  {resource.type}
                </span>
              </div>
              <p className="mb-4 leading-7 text-slate-300">{resource.description}</p>
              <span className="font-medium text-sky-300">Open tool →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
