import { PriceRule, StockStatus } from '@prisma/client';

/** First successful read is published. Set true to flag every product that has no stored source price. */
export const FIRST_RUN_REQUIRES_REVIEW = false;

export const PRICE_CHANGE_GUARD = 0.15;

export type PriceDecision =
  | { status: 'update'; price: number; stock: StockStatus | null; clearCompareAt: boolean }
  | { status: 'unchanged' }
  | { status: 'flagged'; reason: string }
  | { status: 'error'; reason: string };

export function ruleLabel(rule: PriceRule, value: number | null): string {
  if (rule === 'MINUS_FIXED') return `minus_fixed ${value ?? ''}`.trim();
  if (rule === 'MINUS_PERCENT') return `minus_percent ${value ?? ''}`.trim();
  return 'match';
}

export function sellingPrice(sourcePrice: number, rule: PriceRule, ruleValue: number | null): number | null {
  if (rule === 'MATCH') return sourcePrice;
  if (ruleValue == null || !Number.isFinite(ruleValue)) return null;
  if (rule === 'MINUS_FIXED') return sourcePrice - Math.round(ruleValue);
  const percent = sourcePrice * (1 - ruleValue / 100);
  return Math.round(percent);
}

export function applyPriceRule(input: {
  sourcePrice: number;
  previousSourcePrice: number | null;
  currentPrice: number;
  compareAtPrice: number | null;
  currentStock: StockStatus;
  nextStock: StockStatus | null;
  rule: PriceRule;
  ruleValue: number | null;
}): PriceDecision {
  const previous = input.previousSourcePrice;
  if (previous == null && FIRST_RUN_REQUIRES_REVIEW) {
    return { status: 'flagged', reason: 'First source price needs review' };
  }
  if (previous != null && previous > 0) {
    const delta = Math.abs(input.sourcePrice - previous) / previous;
    if (delta > PRICE_CHANGE_GUARD) {
      return {
        status: 'flagged',
        reason: `Source price changed ${Math.round(delta * 100)}% (limit 15%)`,
      };
    }
  }

  const nextPrice = sellingPrice(input.sourcePrice, input.rule, input.ruleValue);
  if (nextPrice == null) return { status: 'error', reason: 'Price rule value is missing' };
  if (nextPrice <= 0) return { status: 'flagged', reason: 'Rule produced a price of 0 or less' };

  const stockChanged = input.nextStock != null && input.nextStock !== input.currentStock;
  const priceChanged = nextPrice !== Math.round(input.currentPrice);
  if (!priceChanged && !stockChanged && previous === input.sourcePrice) {
    return { status: 'unchanged' };
  }
  if (!priceChanged && !stockChanged) {
    return { status: 'unchanged' };
  }

  const compare = input.compareAtPrice == null ? null : Math.round(input.compareAtPrice);
  return {
    status: 'update',
    price: nextPrice,
    stock: stockChanged ? input.nextStock : null,
    clearCompareAt: compare != null && nextPrice >= compare,
  };
}
