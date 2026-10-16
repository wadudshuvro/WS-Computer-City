import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { sameOrigin } from '@/lib/auth/guard';
import { prisma } from '@/lib/prisma';
import { securityLog } from '@/lib/auth/securityLog';

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) {
    return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Not allowed' } }, { status: 403 });
  }
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (email) {
    await prisma.user.update({
      where: { email },
      data: { sessionVersion: { increment: 1 } },
    });
    securityLog('logout', { email });
  }
  return NextResponse.json({ ok: true });
}
