import { NextRequest } from 'next/server';
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { credentialsRateLimit } from '@/lib/auth/loginLimit';

const handler = NextAuth(authOptions);

export { handler as GET };

export async function POST(req: NextRequest) {
  if (req.nextUrl.pathname.includes('callback/credentials')) {
    const text = await req.clone().text();
    const email = new URLSearchParams(text).get('email')?.toLowerCase().trim();
    const blocked = await credentialsRateLimit(req.nextUrl.pathname, req.headers, email);
    if (blocked) return blocked;
  }
  return handler(req);
}
