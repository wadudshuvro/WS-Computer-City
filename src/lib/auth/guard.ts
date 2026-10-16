import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/prisma';
import { securityLog } from '@/lib/auth/securityLog';
import { siteUrl } from '@/lib/launch/site';

export type AdminActor = { id: string; role: 'ADMIN' | 'SUPER_ADMIN' };

function denied(status: 401 | 403, code: string) {
  return NextResponse.json({ error: { code, message: 'Not allowed' } }, { status });
}

export function sameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(siteUrl()).origin;
  } catch {
    return false;
  }
}

/** Loads the user from the database. The token role is not trusted. */
export async function authorizeAdmin(req: NextRequest): Promise<AdminActor | NextResponse> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) {
    securityLog('admin_denied', { reason: 'no_session', path: req.nextUrl.pathname });
    return denied(401, 'UNAUTHORIZED');
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    securityLog('admin_denied', { reason: 'not_admin', path: req.nextUrl.pathname });
    return denied(403, 'FORBIDDEN');
  }
  if (session.user?.sessionVersion !== user.sessionVersion) {
    securityLog('admin_denied', { reason: 'session_rotated', path: req.nextUrl.pathname, userId: user.id });
    return denied(401, 'UNAUTHORIZED');
  }
  if (req.method !== 'GET' && req.method !== 'HEAD' && !sameOrigin(req)) {
    securityLog('csrf_denied', { path: req.nextUrl.pathname, userId: user.id });
    return denied(403, 'FORBIDDEN');
  }
  return { id: user.id, role: user.role };
}

export function isAdminActor(value: AdminActor | NextResponse): value is AdminActor {
  return !(value instanceof NextResponse);
}
