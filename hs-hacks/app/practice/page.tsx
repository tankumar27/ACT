import PracticeClient from '@/app/components/PracticeClient';
import SectionShell from '@/app/components/SectionShell';

export default function PracticePage() {
  return (
    <main className="min-h-screen px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <SectionShell
          eyebrow="Practice lab"
          title="A cleaner ACT workspace with live AI-generated sets"
          description="Generate 10 fresh questions for each section, answer in place, and jump into clarification mode whenever a miss needs a better explanation."
        />
        <PracticeClient />
      </div>
    </main>
  );
}
