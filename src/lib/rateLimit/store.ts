export type HitResult = { allowed: boolean; retryAfterSec: number; member: string };

export interface RateStore {
  blockRemaining(key: string, now: number): Promise<number>;
  hit(key: string, limit: number, windowMs: number, now: number): Promise<HitResult>;
  release(key: string, member: string): Promise<void>;
  /** Count one exceed episode. The caller must not call this while a block is already active. */
  strike(key: string, now: number): Promise<number>;
  block(key: string, seconds: number, now: number): Promise<void>;
}

export function escalatedRetry(strikes: number, windowRetrySec: number): number {
  if (strikes >= 3) return Math.max(windowRetrySec, 60 * 60);
  if (strikes >= 2) return Math.max(windowRetrySec, 5 * 60);
  return Math.max(1, windowRetrySec);
}
