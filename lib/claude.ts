import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const MODEL = 'claude-opus-4-5';

// ─── Retry Logic for Anthropic API ────────────────────────────────────────────
async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelayMs = 1000,
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      const e = err as { status?: number; message?: string; code?: string };
      // 529 = API overloaded; other errors may include timeout or connection issues
      const isRetryable = e.status === 529 || ['ETIMEDOUT', 'ECONNRESET'].includes(e.code ?? '');
      const isLastAttempt = attempt === maxAttempts;

      if (!isRetryable || isLastAttempt) throw err;

      // Exponential backoff: 1s, 2s, 4s
      const delayMs = baseDelayMs * Math.pow(2, attempt - 1);
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
  throw new Error('withRetry: max attempts exhausted');
}

// ─── System Prompt Builder ────────────────────────────────────────────────────
export function buildSystemPrompt(
  board: string,
  classLevel: string,
  language: string,
  childName?: string
): string {
  const isYoung = ['LKG', 'UKG', '1', '2', '3', '4'].includes(classLevel);
  const name = childName ? `The student's name is ${childName}.` : '';

  return `You are Niche Tutor – a warm, patient and encouraging AI home tutor for students in India.
You are teaching a ${classLevel} student following the ${board} syllabus. ${name}
Respond ENTIRELY in ${language} language, using the correct script for that language.
${
  isYoung
    ? `Use playful stories, rhymes, songs and very simple vocabulary suitable for a ${classLevel} child aged 4–8 years. Keep sentences short. Use emojis occasionally to keep it fun.`
    : `Use clear, structured explanations with diagrams described in text, worked examples, and exam-focused tips for ${board} Class ${classLevel}.`
}
Format your lecture clearly with headings (##) and bullet points where appropriate.
Keep the total lecture content appropriate for approximately 30 minutes when read aloud.
At the very end of every lecture, always add this line exactly:
"📌 Please verify this content with your child's textbook and school teacher."`;
}

// ─── Quiz Prompt Builder ──────────────────────────────────────────────────────
export function buildQuizPrompt(topic: string, chapter: string, board: string, classLevel: string, language: string): string {
  return `Generate exactly 5 multiple-choice questions to test understanding of the topic: "${topic}" from chapter "${chapter}" (${board} Class ${classLevel}).
Language: ${language}

Return ONLY a valid JSON array with this exact structure (no markdown, no extra text):
[
  {
    "q": "Question text",
    "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
    "answer": "A",
    "explanation": "Brief explanation why A is correct"
  }
]`;
}

// ─── Non-streaming: quiz generation, doubt answers, plan overview ─────────────
export async function claudeComplete(
  system: string,
  user: string,
  maxTokens = 4096
): Promise<string> {
  const response = await withRetry(() =>
    client.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: user }],
    })
  );
  const block = response.content[0];
  if (block.type !== 'text') throw new Error('Unexpected content type');
  return block.text;
}

// ─── Streaming: lecture display ───────────────────────────────────────────────
export async function claudeStream(
  system: string,
  user: string,
  maxTokens = 8192
): Promise<ReadableStream<Uint8Array>> {
  const stream = await withRetry(async () =>
    client.messages.stream({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: user }],
    })
  ) as AsyncIterable<any>;

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(new TextEncoder().encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}

// ─── Parse Quiz JSON safely ───────────────────────────────────────────────────
export function parseQuizJSON(raw: string): import('@/types').QuizQuestion[] | null {
  try {
    // Strip markdown code fences if present
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}
