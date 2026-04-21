import {
  practiceQuestions,
  sectionMeta,
  type ActSection,
  type PracticeQuestion,
} from '@/data/act-practice';

export { practiceQuestions, sectionMeta, type ActSection, type PracticeQuestion };

export const sectionOrder: ActSection[] = ['math', 'english', 'science', 'reading'];

export const homepageStats = [
  { label: 'Core ACT tracks', value: '4' },
  { label: 'Questions per AI set', value: '10' },
  { label: 'AI clarification flow', value: 'Live' },
];

export const studyPath = [
  {
    title: 'Scan the section',
    text: 'Start with a clean section brief so Math, English, Science, and Reading each feel predictable before you practice.',
  },
  {
    title: 'Run an AI set',
    text: 'Generate 10 fresh ACT-style questions per section and get immediate grading with skill tags.',
  },
  {
    title: 'Review the miss',
    text: 'Open AI clarification for any wrong answer and get a simpler explanation grounded in the local ACT knowledge file.',
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
