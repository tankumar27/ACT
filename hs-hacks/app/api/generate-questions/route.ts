import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextRequest } from 'next/server';

import type { ActSection, PracticeQuestion } from '@/data/act-practice';
import { getQuestionsForSection, isActSection } from '@/lib/act-content';

const KNOWLEDGE_PATH = path.join(process.cwd(), 'data', 'act-knowledge.txt');
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

function normalizeQuestion(
  section: ActSection,
  index: number,
  raw: Partial<PracticeQuestion>,
): PracticeQuestion {
  const letters = ['A', 'B', 'C', 'D'];
  const rawChoices = Array.isArray(raw.choices) ? raw.choices.slice(0, 4) : [];
  const choices = letters.map((letter, choiceIndex) => {
    const value = rawChoices[choiceIndex] ?? `Placeholder option ${letter}`;
    return value.match(/^[A-D]\.\s/) ? value : `${letter}. ${value}`;
  });

  const answer = typeof raw.answer === 'string' ? raw.answer.trim().charAt(0).toUpperCase() : 'A';

  return {
    id: `${section}-ai-${index + 1}`,
    section,
    title: raw.title?.trim() || `${section} question ${index + 1}`,
    prompt: raw.prompt?.trim() || 'Question unavailable.',
    choices,
    answer: letters.includes(answer) ? answer : 'A',
    explanation: raw.explanation?.trim() || 'No explanation was returned.',
    skill: raw.skill?.trim() || 'ACT strategy',
  };
}

function fallback(section: ActSection, count: number) {
  return getQuestionsForSection(section).slice(0, count).map((question, index) => ({
    ...question,
    id: `${section}-fallback-${index + 1}`,
  }));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sectionParam = searchParams.get('section') ?? '';
  const count = Math.max(1, Math.min(10, Number.parseInt(searchParams.get('count') || '10', 10)));

  if (!isActSection(sectionParam)) {
    return Response.json({ error: 'Invalid section' }, { status: 400 });
  }

  const section = sectionParam as ActSection;
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    return Response.json({ questions: fallback(section, count), source: 'fallback' });
  }

  try {
    const knowledgeBase = await readFile(KNOWLEDGE_PATH, 'utf8');
    const prompt = [
      'You are generating ACT-style practice questions for a premium prep platform.',
      `Return exactly ${count} ${section} questions.`,
      'Each question must have four answer choices and only one correct answer.',
      'Keep the difficulty realistic for ACT students and vary the skills.',
      'Avoid duplicate prompts and avoid markdown code fences.',
      'Use the knowledge base as context for tone, skills, and section framing.',
      'Return strict JSON matching this shape:',
      '{"questions":[{"title":"","prompt":"","choices":["","","",""],"answer":"A","explanation":"","skill":""}]}',
      '',
      `Section: ${section}`,
      '',
      'Knowledge base:',
      knowledgeBase,
    ].join('\n');

    const geminiResponse = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.85,
          topP: 0.95,
          maxOutputTokens: 2400,
          responseMimeType: 'application/json',
          thinkingConfig: {
            thinkingBudget: 0,
          },
        },
      }),
    });

    if (!geminiResponse.ok) {
      return Response.json({ questions: fallback(section, count), source: 'fallback' });
    }

    const data = (await geminiResponse.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };

    const rawText =
      data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? '')
        .join('')
        .trim() ?? '';

    if (!rawText) {
      return Response.json({ questions: fallback(section, count), source: 'fallback' });
    }

    const parsed = JSON.parse(rawText) as { questions?: Array<Partial<PracticeQuestion>> };
    const generated = Array.isArray(parsed.questions)
      ? parsed.questions.slice(0, count).map((question, index) => normalizeQuestion(section, index, question))
      : [];

    if (generated.length !== count) {
      return Response.json({ questions: fallback(section, count), source: 'fallback' });
    }

    return Response.json({ questions: generated, source: 'ai' });
  } catch {
    return Response.json({ questions: fallback(section, count), source: 'fallback' });
  }
}
