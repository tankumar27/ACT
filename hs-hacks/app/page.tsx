import Link from 'next/link';

import { sectionMeta, sectionOrder } from '@/lib/act-content';

const statCards = [
  { label: 'Enhanced timing', value: '35-50 min', detail: 'Practice against the current ACT pacing windows.' },
  { label: 'AI drill sets', value: '10 fresh', detail: 'Generate section-specific question sets on demand.' },
  { label: 'Review flow', value: 'Instant', detail: 'Open clarification right after a miss instead of losing momentum.' },
];

const systemCards = [
  {
    title: 'Sharper Section Navigation',
    text: 'Move between home, practice, chat, and subject pages from the same fixed header without backtracking.',
  },
  {
    title: 'Real ACT Framing',
    text: 'Math, English, Reading, and Science stay visible as separate tracks with strategy-first summaries.',
  },
  {
    title: 'Live Depth Background',
    text: 'The background now behaves like a proper moving field instead of a static decorative panel.',
  },
];

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <section
        id="overview"
        className="relative flex min-h-screen items-center px-4 pb-20 pt-28 md:pt-32"
      >
        <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="max-w-4xl" data-reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.42em] text-cyan-300/80">
              ACT Forge
            </p>
            <h1 className="mt-6 max-w-5xl text-5xl font-semibold leading-[0.92] tracking-[-0.055em] text-white md:text-7xl xl:text-[5.8rem]">
              Clean ACT prep with a moving cube field, better structure, and AI review that actually works.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-200 md:text-[1.08rem]">
              Study from one calm front page, jump into timed section work, and ask follow-up questions in a
              focused ACT coach flow. The experience is built to feel modern, not crowded.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/practice" className="button-primary">
                Open Practice Lab
              </Link>
              <Link href="/chat" className="button-secondary">
                Ask the ACT Coach
              </Link>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {statCards.map((card) => (
                <article key={card.label} className="hero-chip rounded-[1.6rem] p-5" data-reveal>
                  <p className="text-[0.68rem] uppercase tracking-[0.28em] text-zinc-400">{card.label}</p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">{card.value}</p>
                  <p className="mt-3 text-sm leading-6 text-zinc-300">{card.detail}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-4" data-reveal>
            <article className="hero-panel rounded-[2rem] p-6">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-zinc-400">
                Section Map
              </p>
              <div className="mt-5 grid gap-3">
                {sectionOrder.map((section, index) => (
                  <Link
                    key={section}
                    href={`/subjects/${section}`}
                    className="group flex items-center justify-between rounded-[1.35rem] border border-white/10 bg-white/[0.04] px-4 py-4 transition hover:bg-white/[0.09]"
                  >
                    <div>
                      <p className="text-[0.62rem] uppercase tracking-[0.28em] text-zinc-500">
                        0{index + 1}
                      </p>
                      <h2 className="mt-1 text-xl font-semibold text-white">{sectionMeta[section].name}</h2>
                      <p className="mt-1 max-w-md text-sm leading-6 text-zinc-300">
                        {sectionMeta[section].summary}
                      </p>
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-zinc-200 transition group-hover:bg-white group-hover:text-black">
                      Open
                    </span>
                  </Link>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="sections" className="relative px-4 pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl" data-reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.42em] text-zinc-500">Platform</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-white md:text-5xl">
              Built to feel clear at first glance and faster after ten minutes of use.
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <article className="hero-panel rounded-[2.2rem] p-7" data-reveal>
              <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-zinc-500">
                    Why it feels better
                  </p>
                  <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">
                    The page stays minimal while the background carries the motion.
                  </h3>
                  <p className="mt-4 text-base leading-8 text-zinc-300">
                    Instead of stacking heavy boxes everywhere, the content now sits in a few strong anchors:
                    a hero message, a section map, and quick links into practice and AI review.
                  </p>
                </div>

                <div className="grid gap-4">
                  {systemCards.map((card) => (
                    <article key={card.title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                      <p className="text-lg font-semibold text-white">{card.title}</p>
                      <p className="mt-3 text-sm leading-7 text-zinc-300">{card.text}</p>
                    </article>
                  ))}
                </div>
              </div>
            </article>

            <div className="grid gap-5">
              <article className="hero-panel rounded-[2rem] p-6" data-reveal>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-zinc-500">
                  Practice Flow
                </p>
                <div className="mt-5 space-y-4">
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">1. Pick a track</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">Choose one subject or generate a full mixed drill.</p>
                  </div>
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">2. Answer quickly</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">Keep the UI focused on the question and answer choice.</p>
                  </div>
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">3. Review with AI</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">Ask follow-up questions without losing the local ACT context.</p>
                  </div>
                </div>
              </article>

              <article className="hero-panel rounded-[2rem] p-6" data-reveal>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-zinc-500">
                  Quick Actions
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/practice" className="button-primary button-primary-sm">
                    Generate Questions
                  </Link>
                  <Link href="/chat" className="button-secondary button-secondary-sm">
                    Open Coach
                  </Link>
                  <Link href="/subjects/math" className="button-secondary button-secondary-sm">
                    Math Strategy
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
