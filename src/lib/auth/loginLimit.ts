import { NextResponse } from 'next/server';
import { clientIp, consume } from '@/lib/rateLimit/limit';
import { rateLimited } from '@/lib/rateLimit/http';
import type { RateAction } from '@/lib/rateLimit/policies';

/** Login, signup, and password reset share this shape. Signup and reset routes do not exist yet. */
export async function limitAuthAction(action: Extract<RateAction, 'login' | 'signup' | 'reset'>, ip: string, account?: string) {
  return consume(action, { ip, account });
}

export async function credentialsRateLimit(pathname: string, headers: Headers, account?: string): Promise<NextResponse | null> {
  if (!pathname.includes('callback/credentials')) return null;
  const decision = await limitAuthAction('login', clientIp(headers), account);
  if (decision.ok) return null;
  return rateLimited(decision.retryAfterSec, 'Too many attempts. Please wait.');
}
