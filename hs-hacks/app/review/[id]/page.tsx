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
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_30%),linear-gradient(180deg,#020202_0%,#050505_55%,#020202_100%)] px-4 py-24">
        <div className="panel mx-auto max-w-3xl rounded-[2rem] p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-zinc-400">Review page</p>
          <h1 className="mt-4 text-3xl font-semibold">That practice question was not found.</h1>
          <p className="mt-4 leading-8 text-zinc-300">
            Head back to the practice page and open AI clarification from a question card.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_30%),linear-gradient(180deg,#020202_0%,#050505_55%,#020202_100%)] px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <ReviewClient question={question} studentAnswer={query.answer} />
      </div>
    </main>
  );
}
