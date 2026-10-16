import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth/options';
import { addCartLine } from '@/lib/cart/addCartLine';
import { prismaCartRepository } from '@/lib/cart/prismaRepository';
import { prisma } from '@/lib/prisma';
import { clientIp } from '@/lib/rateLimit/limit';
import { guardCatalogRead, rateLimited } from '@/lib/rateLimit/http';
import { MAX_CART_BODY_BYTES } from '@/lib/rateLimit/policies';

const addSchema = z.object({
  productId: z.string().min(1).max(80),
  quantity: z.number().int().positive().max(99).default(1),
  variant: z.string().max(40).optional(),
});

function guestKey(req: NextRequest): { key: string; fresh: boolean } {
  const existing = req.cookies.get('lb_cart')?.value;
  if (existing && /^[a-zA-Z0-9_-]{16,80}$/.test(existing)) return { key: `guest:${existing}`, fresh: false };
  return { key: `guest:${crypto.randomUUID().replace(/-/g, '')}`, fresh: true };
}

function withGuestCookie(res: NextResponse, key: string, fresh: boolean) {
  if (!fresh) return res;
  res.cookies.set('lb_cart', key.replace(/^guest:/, ''), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

export async function GET(req: NextRequest) {
  const limited = await guardCatalogRead(req);
  if (limited) return limited;
  const session = await getServerSession(authOptions);
  const user = session?.user?.email
    ? await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } })
    : null;
  const cookie = req.cookies.get('lb_cart')?.value;
  const cart = user
    ? await prisma.cart.findUnique({ where: { userId: user.id }, include: { items: true } })
    : cookie
      ? await prisma.cart.findUnique({ where: { guestKey: `guest:${cookie}` }, include: { items: true } })
      : null;
  return NextResponse.json({ data: cart?.items || [] });
}

export async function POST(req: NextRequest) {
  const declared = Number(req.headers.get('content-length') || 0);
  if (declared > MAX_CART_BODY_BYTES) {
    return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'Request is too large' } }, { status: 413 });
  }
  const session = await getServerSession(authOptions);
  const user = session?.user?.email
    ? await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } })
    : null;
  const guest = guestKey(req);
  const cartKey = user?.id || guest.key;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid JSON' } }, { status: 400 });
  }
  const parsed = addSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid cart item' } }, { status: 400 });
  }
  const idempotencyKey = req.headers.get('idempotency-key')?.trim().slice(0, 80);
  if (!idempotencyKey) {
    return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'Idempotency-Key is required' } }, { status: 400 });
  }
  const result = await addCartLine(prismaCartRepository(), {
    cartKey,
    productId: parsed.data.productId,
    variant: parsed.data.variant,
    quantity: parsed.data.quantity,
    idempotencyKey,
    ip: clientIp(req.headers),
    userId: user?.id,
  });
  if (result.status === 429) {
    return withGuestCookie(rateLimited(result.retryAfterSec || 1, 'Too many cart updates. Please wait a minute.'), cartKey, !user && guest.fresh);
  }
  return withGuestCookie(
    NextResponse.json({ data: { line: result.line, replayed: result.replayed } }, { status: result.status }),
    cartKey,
    !user && guest.fresh
  );
}
