import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  isGeminiConfigured,
  runCatalogAgent,
  type ChatTurn,
} from '@/lib/ai/gemini';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1).max(4000),
      })
    )
    .min(1)
    .max(20),
});

const rateBucket = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

function clientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'local'
  );
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateBucket.get(ip);
  if (!entry || now > entry.resetAt) {
    rateBucket.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    if (!isGeminiConfigured()) {
      return NextResponse.json(
        {
          error: 'AI chat is not configured',
          reply:
            'Product advisor is not set up yet. Add GEMINI_API_KEY to your .env file (Google AI Studio free key), then restart npm run dev.',
          products: [],
          configured: false,
        },
        { status: 503 }
      );
    }

    const ip = clientIp(req);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute.' },
        { status: 429 }
      );
    }

    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const messages = parsed.data.messages as ChatTurn[];
    const last = messages[messages.length - 1];
    if (!last || last.role !== 'user') {
      return NextResponse.json(
        { error: 'Last message must be from the user' },
        { status: 400 }
      );
    }

    const { reply, products } = await runCatalogAgent(messages);

    return NextResponse.json({
      reply,
      products,
      configured: true,
    });
  } catch (error) {
    console.error('[agent/chat]', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Agent failed',
        reply: `Sorry — the advisor hit an error. ${message.includes('API') || message.includes('GEMINI') ? 'Check your GEMINI_API_KEY and AI_MODEL.' : 'Please try again.'}`,
        products: [],
      },
      { status: 500 }
    );
  }
}
