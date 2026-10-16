import Redis from 'ioredis';
import type { HitResult, RateStore } from '@/lib/rateLimit/store';

const SLIDE = `
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local member = ARGV[4]
redis.call('ZREMRANGEBYSCORE', key, '-inf', now - window)
local count = redis.call('ZCARD', key)
if count >= limit then
  local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
  local oldestScore = tonumber(oldest[2]) or now
  local retryMs = oldestScore + window - now
  if retryMs < 1000 then retryMs = 1000 end
  return {0, math.ceil(retryMs / 1000)}
end
redis.call('ZADD', key, now, member)
redis.call('PEXPIRE', key, window)
return {1, 0}
`;

let client: Redis | null = null;

function redis(): Redis {
  if (!process.env.REDIS_URL) throw new Error('REDIS_URL is not set');
  if (!client) {
    client = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      connectTimeout: 400,
      enableOfflineQueue: false,
      lazyConnect: true,
    });
    client.on('error', () => {
      /* consume() alerts and fails open for cart and checkout */
    });
  }
  return client;
}

/** Shared sliding window. One count across every app server that uses the same REDIS_URL. */
export class RedisRateStore implements RateStore {
  async blockRemaining(key: string, now: number): Promise<number> {
    const until = await redis().get(this.blockKey(key));
    if (!until) return 0;
    const ms = Number(until) - now;
    return ms > 0 ? Math.max(1, Math.ceil(ms / 1000)) : 0;
  }

  async hit(key: string, limit: number, windowMs: number, now: number): Promise<HitResult> {
    const member = `${now}:${Math.random().toString(36).slice(2, 10)}`;
    const result = (await redis().eval(SLIDE, 1, this.windowKey(key), String(now), String(windowMs), String(limit), member)) as [number, number];
    const allowed = Number(result[0]) === 1;
    return { allowed, retryAfterSec: allowed ? 0 : Number(result[1]) || 1, member: allowed ? member : '' };
  }

  async release(key: string, member: string): Promise<void> {
    if (!member) return;
    await redis().zrem(this.windowKey(key), member);
  }

  async strike(key: string, now: number): Promise<number> {
    const id = this.strikeKey(key);
    const count = await redis().incr(id);
    await redis().pexpire(id, 2 * 60 * 60 * 1000);
    void now;
    return count;
  }

  async block(key: string, seconds: number, now: number): Promise<void> {
    await redis().set(this.blockKey(key), String(now + seconds * 1000), 'PX', seconds * 1000);
  }

  private windowKey(key: string) {
    return `rl:win:${key}`;
  }
  private blockKey(key: string) {
    return `rl:block:${key}`;
  }
  private strikeKey(key: string) {
    return `rl:strike:${key}`;
  }
}
