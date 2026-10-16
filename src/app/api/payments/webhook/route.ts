import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { applyPaymentNotice, signaturesMatch, webhookSecret } from '@/lib/payments/webhook';
import { captureException } from '@/lib/launch/sentry';
import { securityLog } from '@/lib/auth/securityLog';

const noticeSchema = z.object({
  id: z.string().min(8).max(120),
  type: z.enum(['payment_succeeded', 'payment_failed']),
  orderNumber: z.string().min(4).max(40),
  amount: z.number().positive(),
});

export async function POST(req: NextRequest) {
  const raw = await req.text();
  let secret = '';
  try {
    secret = webhookSecret();
  } catch {
    return NextResponse.json(
      { error: { code: 'NOT_CONFIGURED', message: 'Payment webhook secret is not set' } },
      { status: 503 }
    );
  }

  if (!signaturesMatch(raw, req.headers.get('x-payment-signature'), secret)) {
    securityLog('webhook_rejected', { reason: 'bad_signature' });
    return NextResponse.json({ error: { code: 'INVALID_SIGNATURE', message: 'Signature rejected' } }, { status: 401 });
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid JSON' } }, { status: 400 });
  }
  const parsed = noticeSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Invalid payment notice', details: parsed.error.flatten().fieldErrors } },
      { status: 400 }
    );
  }

  try {
    const result = await applyPaymentNotice(parsed.data);
    return NextResponse.json({ data: { result } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not apply payment';
    if (/not found|does not match/i.test(message)) {
      securityLog('webhook_rejected', { reason: 'notice_rejected' });
      return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'Could not apply payment' } }, { status: 400 });
    }
    await captureException(error, { route: 'payments/webhook' });
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'Could not apply payment' } }, { status: 500 });
  }
}
