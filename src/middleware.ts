import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { siteUrl } from '@/lib/launch/site';

function allowedOrigin(origin: string | null): boolean {
  if (!origin) return true;
  try {
    return new URL(origin).origin === new URL(siteUrl()).origin;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
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
  return response;
}

export const config = {
  matcher: ['/api/:path*', '/admin', '/admin/:path*'],
};
