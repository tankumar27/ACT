'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import PracticeSphere from '@/app/components/PracticeSphere';
import { sectionMeta, type ActSection, type PracticeQuestion } from '@/lib/act-content';

const sectionFilters: Array<ActSection | 'all'> = ['all', 'math', 'science', 'english', 'reading'];

export default function PracticeClient() {
  const [filter, setFilter] = useState<ActSection | 'all'>('all');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<'ai' | 'fallback'>('fallback');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const fetchQuestions = async (section: ActSection | 'all') => {
    setLoading(true);
    setCurrentQuestionIndex(0);
    try {
      if (section === 'all') {
        const responses = await Promise.all(
          (['math', 'science', 'english', 'reading'] as ActSection[]).map((sec) =>
            fetch(`/api/generate-questions?section=${sec}&count=10`).then((response) => response.json()),
          ),
        );

        const allQuestions: PracticeQuestion[] = responses.flatMap((data) =>
          Array.isArray(data.questions) ? data.questions : [],
        );

        setSource(responses.some((entry) => entry.source === 'ai') ? 'ai' : 'fallback');
        setQuestions(allQuestions);
      } else {
        const response = await fetch(`/api/generate-questions?section=${section}&count=10`);
        const data = await response.json();

        if (data.questions && Array.isArray(data.questions)) {
          setSource(data.source === 'ai' ? 'ai' : 'fallback');
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

  const answerQuestion = (questionId: string, choice: string) => {
    const next = { ...selectedAnswers, [questionId]: choice };
    setSelectedAnswers(next);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('act-practice-progress', JSON.stringify(next));
    }
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="panel rounded-[2rem] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-zinc-500">Generation mode</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                {filter === 'all' ? 'Full ACT drill stack' : `${sectionMeta[filter].name} focus set`}
              </h3>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-zinc-300">
              {source === 'ai' ? 'AI generated' : 'Fallback set'}
            </span>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {sectionFilters.map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => setFilter(section)}
                className={`rounded-[1.5rem] border px-4 py-4 text-left transition-all ${
                  filter === section
                    ? 'border-white/20 bg-white text-black'
                    : 'border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10'
                }`}
              >
                <p className="text-xs uppercase tracking-[0.28em]">
                  {section === 'all' ? 'Combined' : sectionMeta[section].name}
                </p>
                <p className="mt-2 text-sm leading-6 opacity-80">
                  {section === 'all'
                    ? '10 questions per section for a complete 40-question session.'
                    : sectionMeta[section].deck}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="panel rounded-[2rem] p-6">
          <PracticeSphere />
          <div className="mt-4 grid gap-3">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Flow</p>
              <p className="mt-2 text-sm leading-6 text-zinc-200">
                Navigate questions using arrows or click directly on question numbers.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Progress</p>
              <p className="mt-2 text-sm leading-6 text-zinc-200">
                {answeredCount} of {questions.length} questions answered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="py-10 text-center">
          <p className="text-white">Generating your question set...</p>
        </div>
      ) : questions.length > 0 ? (
        <div className="space-y-6">
          <div className="panel sticky top-20 z-40 rounded-[2rem] p-4">
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => goToQuestion(currentQuestionIndex - 1)}
                disabled={currentQuestionIndex === 0}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex flex-wrap justify-center gap-2 max-w-[70%] overflow-x-auto px-2">
                {questions.map((q, idx) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isCurrent = idx === currentQuestionIndex;

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => goToQuestion(idx)}
                      className={`flex h-9 min-w-[2.25rem] items-center justify-center rounded-full border px-2 text-xs font-semibold uppercase tracking-[0.1em] transition-all ${
                        isCurrent
                          ? 'border-white/30 bg-white text-black'
                          : isAnswered
                            ? 'border-white/15 bg-white/10 text-zinc-200 hover:bg-white/15'
                            : 'border-white/10 bg-white/5 text-zinc-400 hover:border-white/15 hover:bg-white/10'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => goToQuestion(currentQuestionIndex + 1)}
                disabled={currentQuestionIndex === questions.length - 1}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {currentQuestion && (
            <article className="panel rounded-[2rem] p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-400">
                    {sectionMeta[currentQuestion.section].name}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    {currentQuestion.title}
                  </h2>
                  <p className="mt-2 text-sm text-zinc-400">
                    Skill focus: {currentQuestion.skill}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs uppercase tracking-[0.24em] text-zinc-300">
                  {currentQuestionIndex + 1} / {questions.length}
                </span>
              </div>

              <p className="text-base leading-8 text-zinc-100">{currentQuestion.prompt}</p>

              <div className="mt-6 grid gap-3">
                {currentQuestion.choices.map((choice) => {
                  const label = choice.split('.')[0];
                  const isPicked = selectedAnswers[currentQuestion.id] === label;
                  const isCorrect = currentQuestion.answer === label;
                  const answered = selectedAnswers[currentQuestion.id] !== undefined;

                  let choiceClass =
                    'border border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10';

                  if (answered && isCorrect) {
                    choiceClass = 'border border-emerald-300/40 bg-emerald-300/12 text-emerald-50';
                  } else if (answered && isPicked && !isCorrect) {
                    choiceClass = 'border border-rose-300/40 bg-rose-300/12 text-rose-50';
                  }

                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => answerQuestion(currentQuestion.id, label)}
                      className={`rounded-2xl px-4 py-3 text-left text-sm leading-7 transition-all ${choiceClass}`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>

              {selectedAnswers[currentQuestion.id] !== undefined ? (
                <div className="mt-6 rounded-3xl border border-white/10 bg-black/70 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-400">
                    {selectedAnswers[currentQuestion.id] === currentQuestion.answer
                      ? 'Nice work'
                      : 'Review this miss'}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-zinc-200">
                    Correct answer: {currentQuestion.answer}. {currentQuestion.explanation}
                  </p>
                  {selectedAnswers[currentQuestion.id] !== currentQuestion.answer ? (
                    <Link
                      href={`/review/${currentQuestion.id}?answer=${selectedAnswers[currentQuestion.id]}`}
                      className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-zinc-200"
                    >
                      Clarify further with AI
                    </Link>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-6 flex justify-between gap-4">
                <button
                  type="button"
                  onClick={() => goToQuestion(currentQuestionIndex - 1)}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 transition-all hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() => goToQuestion(currentQuestionIndex + 1)}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 transition-all hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </article>
          )}
        </div>
      ) : null}
    </div>
  );
}
