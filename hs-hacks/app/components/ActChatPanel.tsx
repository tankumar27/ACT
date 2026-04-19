'use client';

import { useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  text: string;
};

type ActChatPanelProps = {
  heading: string;
  intro: string;
  placeholder: string;
  problemId?: string;
  studentAnswer?: string;
};

export default function ActChatPanel({
  heading,
  intro,
  placeholder,
  problemId,
  studentAnswer,
}: ActChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: intro },
  ]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const question = draft.trim();

    if (!question || loading) {
      return;
    }

    const userMessage: Message = { role: 'user', text: question };

    setMessages((current) => [...current, userMessage]);
    setDraft('');
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/act-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          problemId,
          studentAnswer,
        }),
      });

      const data = (await response.json()) as { reply?: string; error?: string };

      if (!response.ok || !data.reply) {
        throw new Error(data.error ?? 'Unable to get a response right now.');
      }

      setMessages((current) => [...current, { role: 'assistant', text: data.reply ?? '' }]);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : 'Something went wrong while contacting the ACT coach.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.45)] backdrop-blur">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">{heading}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">{intro}</p>
        </div>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-200">
          Knowledge-file only
        </span>
      </div>

      <div className="space-y-4">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`rounded-3xl px-4 py-3 text-sm leading-7 ${
              message.role === 'assistant'
                ? 'bg-white/8 text-slate-100'
                : 'ml-auto max-w-xl bg-sky-500/20 text-sky-50'
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>

      {error ? (
        <p className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </p>
      ) : null}

      <form onSubmit={submit} className="mt-6 space-y-3">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={4}
          placeholder={placeholder}
          className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-4 text-sm text-white outline-none transition focus:border-sky-400/70"
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
            Answers are limited to the site knowledge file and stored practice records.
          </p>
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Thinking...' : 'Ask the coach'}
          </button>
        </div>
      </form>
    </div>
  );
}
