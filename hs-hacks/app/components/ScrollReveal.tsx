'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ScrollReveal() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (mediaQuery.matches) {
      return undefined;
    }

    const elements = gsap.utils.toArray<HTMLElement>('[data-reveal]');
    const triggers: ScrollTrigger[] = [];

    elements.forEach((element, index) => {
      gsap.set(element, {
        autoAlpha: 0,
        y: 40,
      });

      const animation = gsap.fromTo(
        element,
        {
          autoAlpha: 0,
          y: 40,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          delay: index % 3 === 0 ? 0 : 0.05,
          ease: 'power2.out',
          overwrite: 'auto',
        },
      );

      triggers.push(
        ScrollTrigger.create({
          trigger: element,
          start: 'top 85%',
          animation,
          once: true,
        }),
      );
    });

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  return null;
}
