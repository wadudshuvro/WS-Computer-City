import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { isProduction, siteUrl } from '@/lib/launch/site';
import { listingShouldNoindex } from '@/lib/seo/catalogSeo';

function allowedOrigin(origin: string | null): boolean {
  if (!origin) return true;
  try {
    return new URL(origin).origin === new URL(siteUrl()).origin;
  } catch {
    return false;
  }
}

function hostRedirect(req: NextRequest): NextResponse | null {
  if (!isProduction()) return null;
  const host = req.headers.get('host') || '';
  if (!host || host.startsWith('localhost') || host.startsWith('127.0.0.1')) return null;
  const expected = new URL(siteUrl());
  const proto = req.headers.get('x-forwarded-proto') || 'https';
  if (proto === 'http' || host !== expected.host) {
    const destination = `${expected.origin}${req.nextUrl.pathname}${req.nextUrl.search}`;
    return NextResponse.redirect(destination, 301);
  }
  return null;
}

export async function middleware(req: NextRequest) {
  const redirected = hostRedirect(req);
  if (redirected) return redirected;

  const path = req.nextUrl.pathname;
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const role = token?.role;
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  const origin = req.headers.get('origin');
  if (path.startsWith('/api') && !path.startsWith('/api/payments/webhook') && !allowedOrigin(origin)) {
    return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Not allowed' } }, { status: 403 });
  }

  const response = NextResponse.next();
  if (origin && allowedOrigin(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Vary', 'Origin');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Idempotency-Key, x-payment-signature');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  }

  const privatePath = ['/cart', '/checkout', '/account', '/admin', '/search'].some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );
  const listingParams = Object.fromEntries(req.nextUrl.searchParams.entries());
  const filteredListing = path === '/products' && listingShouldNoindex(listingParams);
  if (privatePath || filteredListing || path === '/products') {
    response.headers.set('X-Robots-Tag', 'noindex, follow');
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|uploads|favicon.ico|icon.svg).*)'],
};
