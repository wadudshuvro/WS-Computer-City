import type { HitResult, RateStore } from '@/lib/rateLimit/store';

type Strike = { count: number; expiresAt: number };

/** Sliding window kept in this process. Tests and local dev use it. Production uses Redis when REDIS_URL is set. */
export class MemoryRateStore implements RateStore {
  private events = new Map<string, { at: number; member: string }[]>();
  private blocks = new Map<string, number>();
  private strikes = new Map<string, Strike>();

  async blockRemaining(key: string, now: number): Promise<number> {
    const until = this.blocks.get(key) || 0;
    if (until <= now) {
      this.blocks.delete(key);
      return 0;
    }
    return Math.max(1, Math.ceil((until - now) / 1000));
  }

  async hit(key: string, limit: number, windowMs: number, now: number): Promise<HitResult> {
    const fresh = (this.events.get(key) || []).filter((event) => event.at > now - windowMs);
    if (fresh.length >= limit) {
      const oldest = fresh[0]?.at ?? now;
      const retryAfterSec = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
      this.events.set(key, fresh);
      return { allowed: false, retryAfterSec, member: '' };
    }
    const member = `${now}:${fresh.length}:${Math.random().toString(36).slice(2, 8)}`;
    fresh.push({ at: now, member });
    this.events.set(key, fresh);
    return { allowed: true, retryAfterSec: 0, member };
  }

  async release(key: string, member: string): Promise<void> {
    const fresh = (this.events.get(key) || []).filter((event) => event.member !== member);
    this.events.set(key, fresh);
  }

  async strike(key: string, now: number): Promise<number> {
    const current = this.strikes.get(key);
    const count = current && current.expiresAt > now ? current.count + 1 : 1;
    this.strikes.set(key, { count, expiresAt: now + 2 * 60 * 60 * 1000 });
    return count;
  }

  async block(key: string, seconds: number, now: number): Promise<void> {
    this.blocks.set(key, now + seconds * 1000);
  }
}
