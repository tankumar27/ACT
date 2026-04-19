import PracticeClient from '@/app/components/PracticeClient';
import SectionShell from '@/app/components/SectionShell';

export default function PracticePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.24),_transparent_35%),linear-gradient(180deg,#020617_0%,#0f172a_52%,#020617_100%)] px-4 py-24 text-white">
      <div className="mx-auto max-w-6xl">
        <SectionShell
          eyebrow="Practice lab"
          title="Timed ACT-style reps with instant feedback"
          description="Choose a section, answer a quick set, and open the AI clarification page whenever a miss needs more explanation."
        />
        <PracticeClient />
      </div>
    </main>
  );
}
