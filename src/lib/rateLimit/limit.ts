import { createHash } from 'crypto';
import { securityLog } from '@/lib/auth/securityLog';
import { captureException } from '@/lib/launch/sentry';
import { RATE_POLICIES, type RateAction } from '@/lib/rateLimit/policies';
import { MemoryRateStore } from '@/lib/rateLimit/memoryStore';
import { RedisRateStore } from '@/lib/rateLimit/redisStore';
import { escalatedRetry, type RateStore } from '@/lib/rateLimit/store';

export type LimitDecision = { ok: true; retryAfterSec: 0; failOpen?: boolean } | { ok: false; retryAfterSec: number };

const memoryStore = new MemoryRateStore();
const redisStore = new RedisRateStore();
let override: RateStore | null = null;
let redisPausedUntil = 0;

export function setRateStore(store: RateStore | null) {
  override = store;
}

export function activeRateStore(): RateStore {
  if (override) return override;
  if (!process.env.REDIS_URL || process.env.RATE_LIMIT_DRIVER === 'memory') return memoryStore;
  if (Date.now() < redisPausedUntil) return memoryStore;
  return redisStore;
}

function digest(value: string): string {
  return createHash('sha256').update(value).digest('hex').slice(0, 24);
}

function subjects(action: RateAction, input: { ip: string; userId?: string; account?: string }): { key: string; limit: number }[] {
  const policy = RATE_POLICIES[action];
  const account = input.userId || input.account;
  if (action === 'read' || action === 'search') {
    return [{ key: `${action}:ip:${digest(input.ip)}`, limit: policy.limit }];
  }
  if (action === 'cart' || action === 'order') {
    if (input.userId) {
      return [
        { key: `${action}:user:${digest(input.userId)}`, limit: policy.limit },
        { key: `${action}:ip:${digest(input.ip)}`, limit: policy.ipLimit },
      ];
    }
    return [{ key: `${action}:guest:${digest(input.ip)}`, limit: policy.limit }];
  }
  const keys = [{ key: `${action}:ip:${digest(input.ip)}`, limit: policy.ipLimit }];
  if (account) keys.push({ key: `${action}:acct:${digest(account)}`, limit: policy.limit });
  return keys;
}

/**
 * Sliding-window check for one action. A 429 on search does not consume the cart or order window.
 * Cart and checkout allow the request when the store cannot be reached.
 */
export async function consume(
  action: RateAction,
  input: { ip: string; userId?: string; account?: string },
  now = Date.now()
): Promise<LimitDecision> {
  const policy = RATE_POLICIES[action];
  const store = activeRateStore();
  const checks = subjects(action, input);
  try {
    return await take(store, action, checks, now);
  } catch (error) {
    if (store === redisStore) redisPausedUntil = Date.now() + 30_000;
    securityLog('rate_limit_store_down', { action, failOpen: policy.failOpen });
    await captureException(error, { action, limiter: 'redis' });
    if (policy.failOpen) return { ok: true, retryAfterSec: 0, failOpen: true };
    if (store !== memoryStore) {
      try {
        return await take(memoryStore, action, checks, now);
      } catch {
        return { ok: false, retryAfterSec: 60 };
      }
    }
    return { ok: false, retryAfterSec: 60 };
  }
}

async function take(
  store: RateStore,
  action: RateAction,
  checks: { key: string; limit: number }[],
  now: number
): Promise<LimitDecision> {
  const policy = RATE_POLICIES[action];
  const taken: { key: string; member: string }[] = [];
  for (const check of checks) {
    const remaining = await store.blockRemaining(check.key, now);
    if (remaining > 0) {
      await rollback(store, taken);
      return { ok: false, retryAfterSec: remaining };
    }
  }
  for (const check of checks) {
    const hit = await store.hit(check.key, check.limit, policy.windowMs, now);
    if (!hit.allowed) {
      await rollback(store, taken);
      const strikes = await store.strike(check.key, now);
      const retryAfterSec = escalatedRetry(strikes, hit.retryAfterSec);
      await store.block(check.key, retryAfterSec, now);
      return { ok: false, retryAfterSec };
    }
    taken.push({ key: check.key, member: hit.member });
  }
  return { ok: true, retryAfterSec: 0 };
}

async function rollback(store: RateStore, taken: { key: string; member: string }[]) {
  for (const item of taken) {
    await store.release(item.key, item.member);
  }
}

export function clientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return headers.get('x-real-ip') || 'unknown';
}
