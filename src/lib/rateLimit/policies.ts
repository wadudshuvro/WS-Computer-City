/** Per-action sliding windows. Each limit is well above a person shopping. There is no daily cap. */
export const RATE_POLICIES = {
  read: { limit: 600, windowMs: 60_000, ipLimit: 600, failOpen: false },
  search: { limit: 40, windowMs: 60_000, ipLimit: 40, failOpen: false },
  suggest: { limit: 120, windowMs: 60_000, ipLimit: 120, failOpen: false },
  cart: { limit: 24, windowMs: 60_000, ipLimit: 24, failOpen: true },
  login: { limit: 8, windowMs: 15 * 60_000, ipLimit: 8, failOpen: false },
  signup: { limit: 8, windowMs: 15 * 60_000, ipLimit: 8, failOpen: false },
  reset: { limit: 8, windowMs: 15 * 60_000, ipLimit: 8, failOpen: false },
  order: { limit: 8, windowMs: 60 * 60_000, ipLimit: 60, failOpen: true },
  feedback: { limit: 5, windowMs: 15 * 60_000, ipLimit: 5, failOpen: false },
} as const;

export type RateAction = keyof typeof RATE_POLICIES;

export const MAX_PAGE_SIZE = 48;
export const MAX_ORDER_BODY_BYTES = 100_000;
export const MAX_CART_BODY_BYTES = 32_000;

export function boundPageSize(raw: number, fallback = 20): number {
  if (!Number.isFinite(raw) || raw < 1) return fallback;
  return Math.min(Math.floor(raw), MAX_PAGE_SIZE);
}
