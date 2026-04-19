import { practiceQuestions, sectionMeta, type ActSection } from '@/data/act-practice';

export { practiceQuestions, sectionMeta, type ActSection };

export const sectionOrder: ActSection[] = ['math', 'science', 'english', 'reading'];

export const homepageStats = [
  { label: 'Core ACT tracks', value: '4' },
  { label: 'Targeted practice drills', value: '6' },
  { label: 'AI clarification flow', value: '24/7' },
];

export const studyPath = [
  {
    title: 'Learn the pattern',
    text: 'Start with strategy cards for English, Math, Reading, and Science so every section feels predictable.',
  },
  {
    title: 'Practice under pressure',
    text: 'Move into short drills with instant grading and clear signals about the skill behind each miss.',
  },
  {
    title: 'Clarify the miss',
    text: 'Open the AI review page for any wrong answer and get a simpler explanation grounded in the site knowledge base.',
  },
];

export function getQuestionsForSection(section: ActSection) {
  return practiceQuestions.filter((question) => question.section === section);
}

export function getQuestionById(id: string) {
  return practiceQuestions.find((question) => question.id === id);
}

export function isActSection(value: string): value is ActSection {
  return value in sectionMeta;
}
