import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authorizeAdmin, isAdminActor } from '@/lib/auth/guard';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  status: z.enum(['OPEN', 'SOLVED']),
});

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const gate = await authorizeAdmin(req);
  if (!isAdminActor(gate)) return gate;

  const { id } = await context.params;
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: { message: 'Choose open or solved.' } }, { status: 400 });
  }

  const status = parsed.data.status;
  const updated = await prisma.$executeRaw`
    UPDATE site_messages
    SET status = ${status},
        "solvedAt" = CASE WHEN ${status} = 'SOLVED' THEN NOW() ELSE NULL END
    WHERE id = ${id}
  `;
  if (updated === 0) {
    return NextResponse.json({ error: { message: 'That report was not found.' } }, { status: 404 });
  }
  return NextResponse.json({ data: { id, status } });
}
