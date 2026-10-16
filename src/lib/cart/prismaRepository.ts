import { prisma } from '@/lib/prisma';
import type { CartLine, CartRepository } from '@/lib/cart/repository';

function lineOf(cartKey: string, item: { productId: string; variant: string; quantity: number }): CartLine {
  return { cartKey, productId: item.productId, variant: item.variant, quantity: item.quantity };
}

export function prismaCartRepository(): CartRepository {
  return {
    async findIdempotent(key) {
      const write = await prisma.cartWrite.findUnique({
        where: { idempotencyKey: key },
        include: { item: { include: { cart: true } } },
      });
      if (!write?.item) return null;
      const cartKey = write.item.cart.userId || write.item.cart.guestKey || write.item.cartId;
      return lineOf(cartKey, write.item);
    },
    async upsert(line, idempotencyKey) {
      const saved = await prisma.$transaction(async (tx) => {
        const cart = line.cartKey.startsWith('guest:')
          ? await tx.cart.upsert({
              where: { guestKey: line.cartKey },
              create: { guestKey: line.cartKey },
              update: {},
            })
          : await tx.cart.upsert({
              where: { userId: line.cartKey },
              create: { userId: line.cartKey },
              update: {},
            });
        const item = await tx.cartItem.upsert({
          where: {
            cartId_productId_variant: {
              cartId: cart.id,
              productId: line.productId,
              variant: line.variant,
            },
          },
          create: {
            cartId: cart.id,
            productId: line.productId,
            variant: line.variant,
            quantity: line.quantity,
          },
          update: { quantity: { increment: line.quantity } },
        });
        await tx.cartWrite.create({
          data: { idempotencyKey, cartItemId: item.id },
        });
        return item;
      });
      return lineOf(line.cartKey, saved);
    },
    async countLines(cartKey) {
      const cart = cartKey.startsWith('guest:')
        ? await prisma.cart.findUnique({ where: { guestKey: cartKey }, include: { items: true } })
        : await prisma.cart.findUnique({ where: { userId: cartKey }, include: { items: true } });
      return cart?.items.length || 0;
    },
  };
}
