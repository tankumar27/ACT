import ReviewClient from '@/app/components/ReviewClient';
import { getQuestionById } from '@/lib/act-content';

type ReviewPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ answer?: string }>;
};

export default async function ReviewPage({ params, searchParams }: ReviewPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const question = getQuestionById(id);

  if (!question) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.2),_transparent_30%),linear-gradient(180deg,#020617_0%,#111827_55%,#020617_100%)] px-4 py-24">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">Review page</p>
          <h1 className="mt-4 text-3xl font-semibold">That practice question was not found.</h1>
          <p className="mt-4 leading-8 text-slate-300">
            Head back to the practice page and open AI clarification from a question card.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.2),_transparent_30%),linear-gradient(180deg,#020617_0%,#111827_55%,#020617_100%)] px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <ReviewClient question={question} studentAnswer={query.answer} />
      </div>
    </main>
  );
}
