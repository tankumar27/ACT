'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import PracticeSphere from '@/app/components/PracticeSphere';
import { sectionMeta, type ActSection, type PracticeQuestion } from '@/lib/act-content';

const sectionFilters: Array<ActSection | 'all'> = ['all', 'math', 'science', 'english', 'reading'];

export default function PracticeClient() {
  const [filter, setFilter] = useState<ActSection | 'all'>('math');
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
    if (!loading && questions.length === 0) {
      fetchQuestions('math');
    }
  }, []);

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
  const progressPercent = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  return (
    <div className="space-y-8">
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
          <div className="mt-4 space-y-4">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Progress</p>
                <p className="text-xs font-semibold text-zinc-300">{answeredCount} / {questions.length}</p>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-zinc-400 to-zinc-200 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Current Section</p>
              <p className="mt-2 text-sm leading-6 text-zinc-200">
                {currentQuestion ? sectionMeta[currentQuestion.section].name : 'Select questions to begin'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="py-16 text-center">
          <div className="inline-block animate-pulse">
            <p className="text-white text-lg">Generating your question set...</p>
          </div>
        </div>
      ) : questions.length > 0 ? (
        <div className="space-y-6">
          <div className="panel rounded-[2rem] p-4">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-zinc-300">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-xs text-zinc-500">
                  ({progressPercent}% complete)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToQuestion(currentQuestionIndex - 1)}
                  disabled={currentQuestionIndex === 0}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => goToQuestion(currentQuestionIndex + 1)}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {questions.map((q, idx) => {
                const isAnswered = selectedAnswers[q.id] !== undefined;
                const isCurrent = idx === currentQuestionIndex;

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => goToQuestion(idx)}
                    className={`flex h-10 min-w-[2.5rem] items-center justify-center rounded-lg border text-sm font-semibold transition-all ${
                      isCurrent
                        ? 'border-white/40 bg-white text-black'
                        : isAnswered
                          ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20'
                          : 'border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {currentQuestion && (
            <article className="panel rounded-[2rem] p-8">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-zinc-300">
                    {sectionMeta[currentQuestion.section].name}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {currentQuestion.skill}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-white leading-relaxed">
                  {currentQuestion.title}
                </h2>
              </div>

              <div className="mb-8 text-base leading-7 text-zinc-200 whitespace-pre-wrap">
                {currentQuestion.prompt}
              </div>

              <div className="space-y-3">
                {currentQuestion.choices.map((choice) => {
                  const label = choice.split('.')[0];
                  const isPicked = selectedAnswers[currentQuestion.id] === label;
                  const isCorrect = currentQuestion.answer === label;
                  const answered = selectedAnswers[currentQuestion.id] !== undefined;

                  let choiceClass =
                    'border border-white/10 bg-white/[0.02] text-zinc-200 hover:bg-white/10 hover:border-white/20';

                  if (answered && isCorrect) {
                    choiceClass = 'border border-emerald-400/50 bg-emerald-400/10 text-emerald-200';
                  } else if (answered && isPicked && !isCorrect) {
                    choiceClass = 'border border-rose-400/50 bg-rose-400/10 text-rose-200';
                  }

                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => answerQuestion(currentQuestion.id, label)}
                      disabled={answered}
                      className={`w-full rounded-xl px-5 py-4 text-left text-sm leading-relaxed transition-all ${choiceClass} ${answered ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>

              {selectedAnswers[currentQuestion.id] !== undefined ? (
                <div className="mt-8 rounded-2xl border border-white/10 bg-black/60 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {selectedAnswers[currentQuestion.id] === currentQuestion.answer ? (
                      <>
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
                          Correct
                        </p>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-300">
                          Incorrect
                        </p>
                      </>
                    )}
                  </div>
                  <p className="text-sm leading-7 text-zinc-300">
                    <span className="text-zinc-400">Correct answer: </span>
                    <span className="font-semibold text-white">{currentQuestion.answer}</span>
                    {' - '}
                    {currentQuestion.explanation}
                  </p>
                  {selectedAnswers[currentQuestion.id] !== currentQuestion.answer ? (
                    <Link
                      href={`/review/${currentQuestion.id}?answer=${selectedAnswers[currentQuestion.id]}`}
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-zinc-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      Ask AI for explanation
                    </Link>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-8 flex items-center justify-between gap-4 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => goToQuestion(currentQuestionIndex - 1)}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() => goToQuestion(currentQuestionIndex + 1)}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
