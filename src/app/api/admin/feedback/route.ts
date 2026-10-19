import { NextRequest, NextResponse } from 'next/server';
import { authorizeAdmin, isAdminActor } from '@/lib/auth/guard';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const gate = await authorizeAdmin(req);
  if (!isAdminActor(gate)) return gate;

  const messages = await prisma.$queryRaw<
    Array<{
      id: string;
      name: string;
      phone: string;
      email: string | null;
      subject: string;
      details: string;
      pageUrl: string | null;
      status: string;
      solvedAt: Date | null;
      createdAt: Date;
    }>
  >`
    SELECT id, name, phone, email, subject, details, "pageUrl", status, "solvedAt", "createdAt"
    FROM site_messages
    ORDER BY CASE WHEN status = 'OPEN' THEN 0 ELSE 1 END, "createdAt" DESC
    LIMIT 200
  `;
  const counted = await prisma.$queryRaw<Array<{ count: number }>>`
    SELECT COUNT(*)::int AS count FROM site_messages WHERE status <> 'SOLVED'
  `;
  return NextResponse.json({ data: messages, openCount: counted[0]?.count ?? 0 });
}
