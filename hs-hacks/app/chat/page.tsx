import ActChatPanel from '@/app/components/ActChatPanel';
import SectionShell from '@/app/components/SectionShell';

export default function ChatPage() {
  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_320px]">
        <div>
        <SectionShell
          eyebrow="ACT chatbot"
          title="Ask the ACT coach for grounded follow-up help"
          description="This chat stays tied to the local knowledge file so your explanations remain controlled, editable, and aligned with the rest of the platform."
          ctaLabel="Open practice"
          ctaHref="/practice"
        />
        <ActChatPanel
          heading="ACT coach"
          intro="Ask about Math, Science, English, Reading, pacing habits, or how to review missed questions."
          placeholder="How should I approach Science graphs on the ACT?"
        />
        </div>

        <aside className="hidden gap-4 lg:grid" data-reveal>
          <article className="hero-panel rounded-[1.8rem] p-5">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-zinc-500">
              Best prompts
            </p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-zinc-300">
              <p className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] p-4">
                Explain why my answer was wrong in simpler words.
              </p>
              <p className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] p-4">
                Give me a fast strategy for Science charts.
              </p>
              <p className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] p-4">
                What trap answers should I watch for in Reading?
              </p>
            </div>
          </article>
          <article className="hero-panel rounded-[1.8rem] p-5">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-zinc-500">
              Use it for
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-300">
              <li>Missed-question walkthroughs</li>
              <li>Pacing advice before practice</li>
              <li>Section-specific review plans</li>
            </ul>
          </article>
        </aside>
      </div>
    </main>
  );
}
