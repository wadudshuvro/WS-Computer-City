import { NextRequest, NextResponse } from 'next/server';
import { authorizeAdmin, isAdminActor } from '@/lib/auth/guard';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const gate = await authorizeAdmin(req);
  if (!isAdminActor(gate)) return gate;

  const [run, flagged] = await Promise.all([
    prisma.priceSyncRun.findFirst({ orderBy: { startedAt: 'desc' } }),
    prisma.product.findMany({
      where: { priceSyncStatus: 'FLAGGED' },
      select: {
        id: true,
        name: true,
        price: true,
        sourcePrice: true,
        priceFlagReason: true,
      },
      orderBy: { name: 'asc' },
      take: 50,
    }),
  ]);

  return NextResponse.json({
    run,
    flagged: flagged.map((product) => ({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      sourcePrice: product.sourcePrice,
      reason: product.priceFlagReason,
    })),
  });
}
