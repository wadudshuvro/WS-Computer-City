import { NextRequest, NextResponse } from 'next/server';
import { clientIp, consume } from '@/lib/rateLimit/limit';
import type { RateAction } from '@/lib/rateLimit/policies';

export function rateLimited(retryAfterSec: number, message = 'Too many requests. Please wait and try again.') {
  return NextResponse.json(
    { error: { code: 'RATE_LIMITED', message } },
    { status: 429, headers: { 'Retry-After': String(retryAfterSec) } }
  );
}

export async function guardAction(
  req: NextRequest,
  action: RateAction,
  subject?: { userId?: string; account?: string }
): Promise<NextResponse | null> {
  const decision = await consume(action, { ip: clientIp(req.headers), ...subject });
  if (decision.ok) return null;
  return rateLimited(decision.retryAfterSec);
}

/** Cached catalog reads are generous. A search query uses the tighter search window. */
export async function guardCatalogRead(req: NextRequest): Promise<NextResponse | null> {
  const searching = Boolean(req.nextUrl.searchParams.get('search')?.trim());
  return guardAction(req, searching ? 'search' : 'read');
}
