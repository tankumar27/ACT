import Link from 'next/link';

import { getQuestionsForSection, isActSection, sectionMeta } from '@/lib/act-content';

type SubjectPageProps = {
  params: Promise<{ subject: string }>;
};

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { subject } = await params;

  if (!isActSection(subject)) {
    return (
      <main className="min-h-screen px-4 py-10 text-white">
        <div className="panel mx-auto max-w-3xl rounded-[2rem] p-8" data-reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-zinc-400">Subject page</p>
          <h1 className="mt-4 text-3xl font-semibold">That ACT section is not available.</h1>
          <p className="mt-4 leading-8 text-zinc-300">
            Use Math, Science, English, or Reading from the homepage cards.
          </p>
        </div>
      </main>
    );
  }

  const meta = sectionMeta[subject];
  const questions = getQuestionsForSection(subject);

  return (
    <main className="min-h-screen px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <section className="panel rounded-[2rem] p-8" data-reveal>
          <div className={`inline-flex rounded-full bg-gradient-to-r ${meta.accent} px-4 py-2 text-sm font-semibold text-black`}>
            {meta.name}
          </div>
          <h1 className="mt-6 text-4xl font-semibold md:text-5xl">{meta.name} section focus</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-300">{meta.summary}</p>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">
            Build speed without losing accuracy: start with the fastest question types, bank the direct points,
            and use review to turn repeated misses into a short strategy list you can recognize on test day.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {meta.strategies.map((strategy) => (
              <div key={strategy} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-400">Strategy</p>
                <p className="mt-3 text-sm leading-7 text-zinc-200">{strategy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          {questions.map((question) => (
            <article key={question.id} className="panel rounded-[2rem] p-6" data-reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-400">{question.skill}</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">{question.title}</h2>
              <p className="mt-4 text-sm leading-7 text-zinc-200">{question.prompt}</p>
            </article>
          ))}
        </section>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/practice" className="button-primary">
            Practice this section
          </Link>
          <Link href="/chat" className="button-secondary">
            Ask the ACT chatbot
          </Link>
        </div>
      </div>
    </main>
  );
}
