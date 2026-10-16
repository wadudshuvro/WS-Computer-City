import { afterEach, describe, expect, it, vi } from 'vitest';
import { addCartLine } from '@/lib/cart/addCartLine';
import { MemoryCartRepository } from '@/lib/cart/repository';
import { credentialsRateLimit, limitAuthAction } from '@/lib/auth/loginLimit';
import { consume, setRateStore } from '@/lib/rateLimit/limit';
import { MemoryRateStore } from '@/lib/rateLimit/memoryStore';
import type { RateStore } from '@/lib/rateLimit/store';

function useMemory() {
  const store = new MemoryRateStore();
  setRateStore(store);
  return store;
}

afterEach(() => {
  setRateStore(null);
  vi.restoreAllMocks();
});

describe('a normal purchase stays under the limits', () => {
  it('browses home, product pages, the cart, and places one order', async () => {
    useMemory();
    const ip = '198.51.100.10';
    const userId = 'shopper-1';
    const repo = new MemoryCartRepository();
    const orders: string[] = [];

    const home = await consume('read', { ip });
    const products = await Promise.all([
      consume('read', { ip }),
      consume('read', { ip }),
      consume('read', { ip }),
    ]);
    const added = await addCartLine(repo, {
      cartKey: userId,
      productId: 'drive-1',
      quantity: 1,
      idempotencyKey: 'add-drive-1',
      ip,
      userId,
    });
    const cartPage = await consume('read', { ip });
    const placed = await consume('order', { ip, userId });
    if (placed.ok) orders.push('LB-1');

    expect(home.ok).toBe(true);
    expect(products.every((step) => step.ok)).toBe(true);
    expect(added.status).not.toBe(429);
    expect(cartPage.ok).toBe(true);
    expect(placed.ok).toBe(true);
    expect(orders).toEqual(['LB-1']);
    expect(await repo.countLines(userId)).toBe(1);
  });

  it('lets many accounts behind one IP each place an order', async () => {
    useMemory();
    const ip = '198.51.100.20';
    const orders: string[] = [];
    for (let i = 0; i < 12; i++) {
      const userId = `shopper-${i}`;
      const decision = await consume('order', { ip, userId });
      if (decision.ok) orders.push(userId);
    }
    expect(orders).toHaveLength(12);
  });
});

describe('bursts are limited without duplicate rows', () => {
  it('returns 429 for extra cart writes and does not add another row', async () => {
    useMemory();
    const repo = new MemoryCartRepository();
    const ip = '203.0.113.50';
    const userId = 'bursty';
    let blocked = 0;
    for (let i = 0; i < 40; i++) {
      const result = await addCartLine(repo, {
        cartKey: userId,
        productId: `sku-${i}`,
        quantity: 1,
        idempotencyKey: `cart-${i}`,
        ip,
        userId,
      });
      if (result.status === 429) {
        blocked += 1;
        expect(result.retryAfterSec).toBeGreaterThan(0);
      }
    }
    expect(blocked).toBeGreaterThan(0);
    expect(await repo.countLines(userId)).toBe(24);

    const replay = await addCartLine(repo, {
      cartKey: userId,
      productId: 'sku-0',
      quantity: 1,
      idempotencyKey: 'cart-0',
      ip,
      userId,
    });
    expect(replay.status).toBe(200);
    expect(replay.replayed).toBe(true);
    expect(await repo.countLines(userId)).toBe(24);
  });

  it('returns 429 for a login burst and for signup and reset', async () => {
    useMemory();
    const headers = new Headers({ 'x-forwarded-for': '203.0.113.77' });
    const path = '/api/auth/callback/credentials';
    for (let i = 0; i < 8; i++) {
      expect(await credentialsRateLimit(path, headers, 'person@example.com')).toBeNull();
    }
    const blocked = await credentialsRateLimit(path, headers, 'person@example.com');
    expect(blocked?.status).toBe(429);
    expect(Number(blocked?.headers.get('Retry-After'))).toBeGreaterThan(0);

    for (const action of ['signup', 'reset'] as const) {
      for (let i = 0; i < 8; i++) {
        expect((await limitAuthAction(action, '203.0.113.88', 'person@example.com')).ok).toBe(true);
      }
      const again = await limitAuthAction(action, '203.0.113.88', 'person@example.com');
      expect(again.ok).toBe(false);
      if (!again.ok) expect(again.retryAfterSec).toBeGreaterThan(0);
    }
  });

  it('does not create a second order when the same checkout is retried or the hourly cap is hit', async () => {
    useMemory();
    const ip = '203.0.113.60';
    const userId = 'repeat-buyer';
    const orders = new Map<string, string>();
    const place = async (key: string) => {
      if (orders.has(key)) return { status: 200, count: orders.size };
      const decision = await consume('order', { ip, userId });
      if (!decision.ok) return { status: 429, retryAfterSec: decision.retryAfterSec, count: orders.size };
      orders.set(key, userId);
      return { status: 201, count: orders.size };
    };

    expect((await place('order-1')).status).toBe(201);
    expect((await place('order-1')).status).toBe(200);
    expect(orders.size).toBe(1);

    for (let i = 2; i <= 8; i++) expect((await place(`order-${i}`)).status).toBe(201);
    const extra = await place('order-9');
    expect(extra.status).toBe(429);
    expect(extra.retryAfterSec).toBeGreaterThan(0);
    expect(orders.size).toBe(8);
  });
});

describe('rate limit store outage', () => {
  it('fails open for cart and checkout and alerts', async () => {
    const down: RateStore = {
      async blockRemaining() {
        throw new Error('redis unavailable');
      },
      async hit() {
        throw new Error('redis unavailable');
      },
      async release() {},
      async strike() {
        throw new Error('redis unavailable');
      },
      async block() {
        throw new Error('redis unavailable');
      },
    };
    setRateStore(down);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const repo = new MemoryCartRepository();
    const added = await addCartLine(repo, {
      cartKey: 'shopper',
      productId: 'drive-1',
      quantity: 1,
      idempotencyKey: 'add-1',
      ip: '198.51.100.30',
      userId: 'shopper',
    });
    const order = await consume('order', { ip: '198.51.100.30', userId: 'shopper' });
    expect(added.status).toBe(201);
    expect(order.ok).toBe(true);
    expect(order.ok && order.failOpen).toBe(true);
    expect(warn.mock.calls.some((call) => String(call[0]).includes('rate_limit_store_down'))).toBe(true);
    expect(await repo.countLines('shopper')).toBe(1);
  });
});
