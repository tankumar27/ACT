import { readFile } from 'node:fs/promises';
import path from 'node:path';

type ChatRequest = {
  question?: string;
  problemId?: string;
  studentAnswer?: string;
};

const KNOWLEDGE_PATH = path.join(process.cwd(), 'data', 'act-knowledge.txt');
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY ?? process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: 'Gemini API key is not configured on the server.' },
        { status: 500 },
      );
    }

    const body = (await request.json()) as ChatRequest;
    const question = body.question?.trim();

    if (!question) {
      return Response.json({ error: 'A question is required.' }, { status: 400 });
    }

    const knowledgeBase = await readFile(KNOWLEDGE_PATH, 'utf8');

    const prompt = [
      'You are an ACT learning coach for this website.',
      'Use only the knowledge base below.',
      'Do not use outside facts, memory, or web knowledge.',
      'If the answer is not supported by the knowledge base, say that clearly.',
      'When a problemId is provided, prioritize the matching practice problem record.',
      'Be concise, supportive, and educational.',
      '',
      `Student question: ${question}`,
      `Problem id: ${body.problemId ?? 'none'}`,
      `Student answer choice: ${body.studentAnswer ?? 'not provided'}`,
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
          temperature: 0.2,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      return Response.json(
        { error: `Gemini request failed: ${errorText}` },
        { status: geminiResponse.status },
      );
    }

    const data = (await geminiResponse.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };

    const reply =
      data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? '')
        .join('')
        .trim() ?? '';

    if (!reply) {
      return Response.json(
        { error: 'Gemini returned an empty response.' },
        { status: 502 },
      );
    }

    return Response.json({ reply });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : 'Unexpected server error while generating a reply.',
      },
      { status: 500 },
    );
  }
}
