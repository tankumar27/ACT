import Link from 'next/link';

import { getQuestionsForSection, isActSection, sectionMeta } from '@/lib/act-content';

type SubjectPageProps = {
  params: Promise<{ subject: string }>;
};

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { subject } = await params;

  if (!isActSection(subject)) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_30%),linear-gradient(180deg,#020617_0%,#111827_48%,#020617_100%)] px-4 py-24 text-white">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">Subject page</p>
          <h1 className="mt-4 text-3xl font-semibold">That ACT section is not available.</h1>
          <p className="mt-4 leading-8 text-slate-300">
            Use Math, Science, English, or Reading from the homepage cards.
          </p>
        </div>
      </main>
    );
  }

  const meta = sectionMeta[subject];
  const questions = getQuestionsForSection(subject);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_30%),linear-gradient(180deg,#020617_0%,#111827_48%,#020617_100%)] px-4 py-24 text-white">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.45)]">
          <div className={`inline-flex rounded-full bg-gradient-to-r ${meta.accent} px-4 py-2 text-sm font-semibold text-white`}>
            {meta.name}
          </div>
          <h1 className="mt-6 text-4xl font-semibold md:text-5xl">{meta.name} section focus</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">{meta.summary}</p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {meta.strategies.map((strategy) => (
              <div key={strategy} className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">Strategy</p>
                <p className="mt-3 text-sm leading-7 text-slate-200">{strategy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          {questions.map((question) => (
            <article key={question.id} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">{question.skill}</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">{question.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-200">{question.prompt}</p>
            </article>
          ))}
        </section>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/practice"
            className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white"
          >
            Practice this section
          </Link>
          <Link
            href="/chat"
            className="rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold text-white"
          >
            Ask the ACT chatbot
          </Link>
        </div>
      </div>
    </main>
  );
}
