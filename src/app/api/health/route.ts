import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      ok: true,
      service: 'logicbay',
      env: process.env.APP_ENV || process.env.NODE_ENV || 'development',
      time: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ ok: false, service: 'logicbay' }, { status: 503 });
  }
}
