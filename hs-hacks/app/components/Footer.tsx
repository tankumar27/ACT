import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 py-12 px-4 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-xl font-bold">ACT Forge</h3>
            <p className="text-gray-300">
              Furnished ACT prep with subject pages, practice drills, and AI-guided clarification.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#about" className="hover:text-white">Blueprint</a></li>
              <li><a href="#issues" className="hover:text-white">Subjects</a></li>
              <li><a href="#resources" className="hover:text-white">Tools</a></li>
              <li><a href="#tips" className="hover:text-white">Habits</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Study Paths</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/practice" className="hover:text-white">Practice</Link></li>
              <li><Link href="/chat" className="hover:text-white">Chatbot</Link></li>
              <li><Link href="/subjects/math" className="hover:text-white">Math</Link></li>
              <li><Link href="/subjects/reading" className="hover:text-white">Reading</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">AI Guardrail</h4>
            <p className="mb-2 text-gray-300">Gemini responses are constrained to:</p>
            <p className="text-lg font-bold">data/act-knowledge.txt</p>
            <p className="mt-2 text-gray-300">Update that file later to change the assistant&apos;s knowledge.</p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-300">
          <p>&copy; 2026 ACT Forge. Built for ACT learning, guided review, and knowledge-file-based AI help.</p>
        </div>
      </div>
    </footer>
  );
}
