'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { sectionMeta, sectionOrder } from '@/lib/act-content';

const primaryLinks = [
  { href: '/#overview', label: 'Overview' },
  { href: '/#sections', label: 'Platform' },
  { href: '/practice', label: 'Practice' },
  { href: '/chat', label: 'Coach' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActiveLink = (href: string) => {
    if (href.startsWith('/#')) {
      return pathname === '/';
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="fixed top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div
          className={`rounded-[1.7rem] border px-4 py-3 transition-all duration-300 ${
            isScrolled
              ? 'border-white/12 bg-black/72 shadow-[0_18px_50px_rgba(0,0,0,0.34)] backdrop-blur-xl'
              : 'border-white/8 bg-black/42 backdrop-blur-md'
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-sm font-semibold uppercase tracking-[0.38em] text-white">
                ACT Forge
              </Link>
              <span className="hidden rounded-full border border-cyan-300/20 bg-cyan-300/8 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-cyan-200 lg:inline-flex">
                Live prep system
              </span>
            </div>

            <div className="hidden items-center gap-7 md:flex">
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-semibold uppercase tracking-[0.24em] transition-colors ${
                    isActiveLink(link.href) ? 'text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/practice" className="button-primary button-primary-sm">
                Launch App
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((current) => !current)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white md:hidden"
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
            >
              <span className="space-y-1.5">
                <span className="block h-px w-4 bg-current" />
                <span className="block h-px w-4 bg-current" />
                <span className="block h-px w-4 bg-current" />
              </span>
            </button>
          </div>

          <div className="mt-3 hidden items-center gap-2 xl:flex">
            {sectionOrder.map((section) => (
              <Link
                key={section}
                href={`/subjects/${section}`}
                className={`rounded-full border px-3 py-1.5 text-[0.64rem] font-semibold uppercase tracking-[0.24em] transition-all ${
                  pathname === `/subjects/${section}`
                    ? 'border-white/22 bg-white text-black'
                    : 'border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.12] hover:border-white/16'
                }`}
              >
                {sectionMeta[section].name}
              </Link>
            ))}
          </div>

          {mobileOpen ? (
            <div className="mt-4 space-y-4 border-t border-white/8 pt-4 md:hidden">
              <div className="grid gap-2">
                {primaryLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] ${
                      isActiveLink(link.href)
                        ? 'border-white/20 bg-white text-black'
                        : 'border-white/10 bg-white/5 text-zinc-200'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {sectionOrder.map((section) => (
                  <Link
                    key={section}
                    href={`/subjects/${section}`}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-zinc-200"
                  >
                    {sectionMeta[section].name}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
