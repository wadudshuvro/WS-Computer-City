import { consume } from '@/lib/rateLimit/limit';
import type { CartLine, CartRepository } from '@/lib/cart/repository';

export type AddCartResult = {
  status: number;
  retryAfterSec?: number;
  line?: CartLine;
  lines: number;
  replayed: boolean;
};

export async function addCartLine(
  repo: CartRepository,
  input: {
    cartKey: string;
    productId: string;
    variant?: string;
    quantity: number;
    idempotencyKey: string;
    ip: string;
    userId?: string;
  }
): Promise<AddCartResult> {
  const replay = await repo.findIdempotent(input.idempotencyKey);
  if (replay) {
    return { status: 200, line: replay, lines: await repo.countLines(replay.cartKey), replayed: true };
  }

  const decision = await consume('cart', { ip: input.ip, userId: input.userId });
  if (!decision.ok) {
    return {
      status: 429,
      retryAfterSec: decision.retryAfterSec,
      lines: await repo.countLines(input.cartKey),
      replayed: false,
    };
  }

  const line = await repo.upsert(
    {
      cartKey: input.cartKey,
      productId: input.productId,
      variant: input.variant || '',
      quantity: Math.min(99, Math.max(1, input.quantity)),
    },
    input.idempotencyKey
  );
  return { status: 201, line, lines: await repo.countLines(input.cartKey), replayed: false };
}
