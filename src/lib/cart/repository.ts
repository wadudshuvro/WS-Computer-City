export type CartLine = {
  cartKey: string;
  productId: string;
  variant: string;
  quantity: number;
};

export interface CartRepository {
  findIdempotent(key: string): Promise<CartLine | null>;
  upsert(line: CartLine, idempotencyKey: string): Promise<CartLine>;
  countLines(cartKey: string): Promise<number>;
}

/** One row per product and variant. A repeated idempotency key returns that row and does not write again. */
export class MemoryCartRepository implements CartRepository {
  private lines = new Map<string, CartLine>();
  private writes = new Map<string, string>();

  async findIdempotent(key: string): Promise<CartLine | null> {
    const id = this.writes.get(key);
    if (!id) return null;
    return this.lines.get(id) || null;
  }

  async upsert(line: CartLine, idempotencyKey: string): Promise<CartLine> {
    const id = `${line.cartKey}|${line.productId}|${line.variant}`;
    const current = this.lines.get(id);
    const next = current
      ? { ...current, quantity: current.quantity + line.quantity }
      : { ...line };
    this.lines.set(id, next);
    this.writes.set(idempotencyKey, id);
    return next;
  }

  async countLines(cartKey: string): Promise<number> {
    let count = 0;
    for (const line of this.lines.values()) {
      if (line.cartKey === cartKey) count += 1;
    }
    return count;
  }
}
