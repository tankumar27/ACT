'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { sectionMeta, type ActSection, type PracticeQuestion } from '@/lib/act-content';

const sectionFilters: Array<ActSection | 'all'> = ['all', 'math', 'science', 'english', 'reading'];

export default function PracticeClient() {
  const [filter, setFilter] = useState<ActSection | 'all'>('all');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async (section: ActSection | 'all') => {
    setLoading(true);
    try {
      if (section === 'all') {
        const allQuestions: PracticeQuestion[] = [];
        for (const sec of ['math', 'science', 'english', 'reading'] as ActSection[]) {
          const response = await fetch(`/api/generate-questions?section=${sec}&count=10`);
          const data = await response.json();
          if (data.questions && Array.isArray(data.questions)) {
            allQuestions.push(...data.questions);
          }
        }
        setQuestions(allQuestions);
      } else {
        const response = await fetch(`/api/generate-questions?section=${section}&count=10`);
        const data = await response.json();
        if (data.questions && Array.isArray(data.questions)) {
          setQuestions(data.questions);
        } else {
          setQuestions([]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(filter);
  }, [filter]);

  const visibleQuestions = questions;

  const answerQuestion = (questionId: string, choice: string) => {
    const next = { ...selectedAnswers, [questionId]: choice };
    setSelectedAnswers(next);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('act-practice-progress', JSON.stringify(next));
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-3">
        {sectionFilters.map((section) => (
          <button
            key={section}
            type="button"
            onClick={() => setFilter(section)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              filter === section
                ? 'bg-white text-slate-950'
                : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            {section === 'all' ? 'All sections' : sectionMeta[section].name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10">
          <p className="text-white">Generating practice questions...</p>
        </div>
      ) : (
        <div className="grid gap-8">
        {visibleQuestions.map((question) => {
          const selected = selectedAnswers[question.id];
          const correct = selected === question.answer;
          const answered = Boolean(selected);

          return (
            <article
              key={question.id}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.35)]"
            >
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
                    {sectionMeta[question.section].name}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">{question.title}</h2>
                  <p className="mt-2 text-sm text-slate-400">Skill focus: {question.skill}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
                  {question.id}
                </span>
              </div>

              <p className="text-base leading-8 text-slate-100">{question.prompt}</p>

              <div className="mt-6 grid gap-3">
                {question.choices.map((choice) => {
                  const label = choice.split('.')[0];
                  const isPicked = selected === label;
                  const isCorrect = question.answer === label;

                  let choiceClass =
                    'border border-white/10 bg-slate-900/60 text-slate-100 hover:bg-slate-900';

                  if (answered && isCorrect) {
                    choiceClass = 'border border-emerald-400/40 bg-emerald-400/15 text-emerald-50';
                  } else if (answered && isPicked && !correct) {
                    choiceClass = 'border border-rose-400/40 bg-rose-400/15 text-rose-50';
                  }

                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => answerQuestion(question.id, label)}
                      className={`rounded-2xl px-4 py-3 text-left text-sm leading-7 transition ${choiceClass}`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>

              {answered ? (
                <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                    {correct ? 'Nice work' : 'Review this miss'}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-200">
                    Correct answer: {question.answer}. {question.explanation}
                  </p>
                  {!correct ? (
                    <Link
                      href={`/review/${question.id}?answer=${selected}`}
                      className="mt-4 inline-flex rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Clarify further with AI
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
      )}
    </div>
  );
}
