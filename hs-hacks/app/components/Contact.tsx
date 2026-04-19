'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: -50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        },
      );

      gsap.fromTo(
        formRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          delay: 0.3,
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    alert(
      'Study plan captured. Keep your target section and biggest blocker in one note, then start a short practice block.',
    );
  };

  return (
    <section id="contact" ref={sectionRef} className="bg-slate-900 py-20 px-4">
      <div className="mx-auto max-w-4xl">
        <h2 ref={titleRef} className="mb-12 text-center text-4xl font-bold text-white">
          Build your next ACT study block
        </h2>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-300">
                  Student name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">
                  Target score
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  required
                  className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="mb-2 block text-sm font-medium text-slate-300">
                Priority section
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-300">
                Biggest blocker right now
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 font-semibold text-white transition-colors duration-300 hover:brightness-110"
            >
              Save study intent
            </button>
          </form>
        </div>
        <div className="mt-12 text-center">
          <p className="mb-4 text-slate-300">A simple weekly rhythm works well for most students:</p>
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <p className="font-semibold text-white">2 section drills</p>
              <p className="text-sky-300">Practice under a short timer</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-white">1 review block</p>
              <p className="text-sky-300">Clarify missed questions with AI</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
