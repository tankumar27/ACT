'use client';

import Link from 'next/link';

import type { PracticeQuestion } from '@/data/act-practice';
import ActChatPanel from '@/app/components/ActChatPanel';

type ReviewClientProps = {
  question: PracticeQuestion;
  studentAnswer?: string;
};

export default function ReviewClient({ question, studentAnswer }: ReviewClientProps) {
  const wasWrong = studentAnswer && studentAnswer !== question.answer;

  return (
    <div className="space-y-8">
      <div className="panel rounded-[2rem] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-zinc-400">
          {question.section}
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white">{question.title}</h1>
        <p className="mt-5 text-base leading-8 text-zinc-100">{question.prompt}</p>
        <div className="mt-6 grid gap-3">
          {question.choices.map((choice) => {
            const label = choice.split('.')[0];
            const isStudent = studentAnswer === label;
            const isCorrect = question.answer === label;

            return (
              <div
                key={choice}
                className={`rounded-2xl border px-4 py-3 text-sm leading-7 ${
                  isCorrect
                    ? 'border-emerald-300/40 bg-emerald-300/15 text-emerald-50'
                    : isStudent
                      ? 'border-rose-300/40 bg-rose-300/15 text-rose-50'
                      : 'border-white/10 bg-black/40 text-zinc-200'
                }`}
              >
                {choice}
              </div>
            );
          })}
        </div>
        <div className="mt-6 rounded-3xl border border-white/10 bg-black/60 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-400">
            {wasWrong ? 'Why your choice missed' : 'Solution note'}
          </p>
          <p className="mt-3 text-sm leading-7 text-zinc-200">
            Correct answer: {question.answer}. {question.explanation}
          </p>
        </div>
      </div>

      <ActChatPanel
        heading="AI clarification coach"
        intro="Ask for a simpler explanation, a comparison between answers, or a next-step habit for similar ACT questions."
        placeholder="Why is my answer wrong, and what clue should I watch for next time?"
        problemId={question.id}
        studentAnswer={studentAnswer}
      />

      <div className="flex flex-wrap gap-4">
        <Link
          href="/practice"
          className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Back to practice
        </Link>
        <Link
          href="/chat"
          className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
        >
          Open the full ACT chatbot
        </Link>
      </div>
    </div>
  );
}
