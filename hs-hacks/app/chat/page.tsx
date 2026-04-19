import ActChatPanel from '@/app/components/ActChatPanel';
import SectionShell from '@/app/components/SectionShell';

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.2),_transparent_28%),linear-gradient(180deg,#020617_0%,#0f172a_50%,#020617_100%)] px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <SectionShell
          eyebrow="ACT chatbot"
          title="Ask ACT questions with a knowledge-file-grounded coach"
          description="This chatbot answers from the site knowledge file only, so the guidance stays easy to update from the backend later."
          ctaLabel="Open practice"
          ctaHref="/practice"
        />
        <ActChatPanel
          heading="ACT coach"
          intro="Ask about Math, Science, English, Reading, pacing habits, or how to review missed questions."
          placeholder="How should I approach Science graphs on the ACT?"
        />
      </div>
    </main>
  );
}
