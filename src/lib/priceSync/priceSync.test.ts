import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { applyPriceRule, sellingPrice } from './applyPriceRule';
import { parseSourcePriceHtml, robotsDisallowsProductPages } from './fetchSourcePrice';

const fixture = (name: string) =>
  fs.readFileSync(path.join(__dirname, 'fixtures', name), 'utf8');

describe('parseSourcePriceHtml', () => {
  it('reads the JSON-LD selling price in taka', () => {
    const result = parseSourcePriceHtml(fixture('priced.html'));
    expect(result).toEqual({ ok: true, price: 10500, currency: 'BDT', availability: 'IN_STOCK' });
  });

  it('does not invent a price for a call-for-price page', () => {
    expect(parseSourcePriceHtml(fixture('call-for-price.html'))).toEqual({
      ok: false,
      error: 'Call for price',
    });
  });

  it('does not invent a price when the page has none', () => {
    expect(parseSourcePriceHtml(fixture('no-price.html')).ok).toBe(false);
  });

  it('treats HTTP 404 as unreadable', () => {
    expect(parseSourcePriceHtml(fixture('priced.html'), 404)).toEqual({
      ok: false,
      error: 'Page not found',
    });
  });
});

describe('applyPriceRule', () => {
  const base = {
    sourcePrice: 10000,
    previousSourcePrice: 10000,
    currentPrice: 10000,
    compareAtPrice: 12000,
    currentStock: 'IN_STOCK' as const,
    nextStock: 'IN_STOCK' as const,
    rule: 'MATCH' as const,
    ruleValue: null,
  };

  it('matches the source price', () => {
    expect(sellingPrice(10000, 'MATCH', null)).toBe(10000);
  });

  it('subtracts a fixed taka amount', () => {
    expect(sellingPrice(10000, 'MINUS_FIXED', 300)).toBe(9700);
  });

  it('subtracts a percent and rounds to whole taka', () => {
    expect(sellingPrice(10000, 'MINUS_PERCENT', 2.5)).toBe(9750);
  });

  it('skips when the source price and stock are unchanged', () => {
    expect(applyPriceRule(base).status).toBe('unchanged');
  });

  it('flags a source move larger than 15%', () => {
    const decision = applyPriceRule({ ...base, sourcePrice: 12000 });
    expect(decision.status).toBe('flagged');
  });

  it('flags a zero or negative result and does not publish it', () => {
    const decision = applyPriceRule({
      ...base,
      rule: 'MINUS_FIXED',
      ruleValue: 10000,
    });
    expect(decision.status).toBe('flagged');
  });

  it('applies the first read when no source price is stored yet', () => {
    const decision = applyPriceRule({ ...base, previousSourcePrice: null, currentPrice: 9000 });
    expect(decision).toMatchObject({ status: 'update', price: 10000 });
  });
});

describe('robotsDisallowsProductPages', () => {
  it('stops when the whole site is disallowed', () => {
    expect(robotsDisallowsProductPages('User-agent: *\nDisallow: /\n')).toBe(true);
  });

  it('allows product pages when only admin paths are disallowed', () => {
    expect(robotsDisallowsProductPages('User-agent: *\nDisallow: /admin\n')).toBe(false);
  });
});
