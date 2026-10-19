import { StockStatus } from '@prisma/client';

/** Identifies this shop's price reader. Do not rotate or hide this agent. */
export const PRICE_SYNC_USER_AGENT =
  'LogicBayPriceSync/1.0 (+mailto:info@wscomputercity.com)';

export const SOURCE_SITE = 'https://www.startech.com.bd';

export type SourcePriceOk = {
  ok: true;
  price: number;
  currency: 'BDT';
  availability: StockStatus | null;
};

export type SourcePriceErr = { ok: false; error: string };

export type SourcePriceResult = SourcePriceOk | SourcePriceErr;

type OfferBits = { price?: string; currency?: string; availability?: string };

function asOffers(node: unknown, found: OfferBits[]) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    node.forEach((item) => asOffers(item, found));
    return;
  }
  const record = node as Record<string, unknown>;
  if (record['@graph']) asOffers(record['@graph'], found);
  const type = String(record['@type'] || '');
  if (type.includes('Offer') || record.price != null || record.lowPrice != null) {
    found.push({
      price: record.price != null ? String(record.price) : record.lowPrice != null ? String(record.lowPrice) : undefined,
      currency: record.priceCurrency != null ? String(record.priceCurrency) : undefined,
      availability: record.availability != null ? String(record.availability) : undefined,
    });
  }
  if (record.offers) asOffers(record.offers, found);
}

function jsonLdOffers(html: string): OfferBits[] {
  const found: OfferBits[] = [];
  const blocks = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  for (const block of blocks) {
    try {
      asOffers(JSON.parse(block[1] || ''), found);
    } catch {
      continue;
    }
  }
  return found;
}

function metaContent(html: string, property: string): string | null {
  const pattern = new RegExp(
    `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']|<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
    'i'
  );
  const match = pattern.exec(html);
  return (match?.[1] || match?.[2] || '').trim() || null;
}

export function availabilityFromText(raw: string | null | undefined): StockStatus | null {
  if (!raw) return null;
  const value = raw.toLowerCase();
  if (/pre-?order|preorder/.test(value)) return 'PRE_ORDER';
  if (/up\s*coming|preorder/.test(value) && /up\s*coming/.test(value)) return 'UPCOMING';
  if (/discontinued/.test(value)) return 'DISCONTINUED';
  if (/out\s*of\s*stock|sold\s*out|outofstock/.test(value)) return 'OUT_OF_STOCK';
  if (/in\s*stock|instock/.test(value)) return 'IN_STOCK';
  return null;
}

function toTaka(raw: string | undefined): number | null {
  if (!raw) return null;
  const amount = Number(String(raw).replace(/,/g, '').trim());
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return Math.round(amount);
}

/**
 * Read the selling price from one product page. Layout changes stay in this file.
 */
export function parseSourcePriceHtml(html: string, statusCode = 200): SourcePriceResult {
  if (statusCode === 404) return { ok: false, error: 'Page not found' };
  if (statusCode >= 400) return { ok: false, error: `HTTP ${statusCode}` };
  if (/call\s*for\s*price/i.test(html) && !/product:price:amount|application\/ld\+json/i.test(html)) {
    return { ok: false, error: 'Call for price' };
  }

  const offers = jsonLdOffers(html).filter((offer) => offer.price);
  const offer = offers.find((item) => item.price) || null;
  const metaPrice = metaContent(html, 'product:price:amount');
  const metaCurrency = metaContent(html, 'product:price:currency');
  const price = toTaka(offer?.price) ?? toTaka(metaPrice || undefined);
  const currency = (offer?.currency || metaCurrency || 'BDT').toUpperCase();

  if (/call\s*for\s*price/i.test(html) && price == null) {
    return { ok: false, error: 'Call for price' };
  }
  if (price == null) return { ok: false, error: 'Price not found' };
  if (currency !== 'BDT') return { ok: false, error: `Currency is ${currency}` };

  const availability =
    availabilityFromText(offer?.availability) ||
    availabilityFromText(metaContent(html, 'product:availability'));

  return { ok: true, price, currency: 'BDT', availability };
}

export function isBlockResponse(statusCode: number, html: string): boolean {
  if (statusCode === 403 || statusCode === 429 || statusCode === 503) return true;
  return /access denied|captcha|unusual traffic|blocked/i.test(html.slice(0, 4000));
}

export async function fetchSourcePrice(url: string): Promise<SourcePriceResult & { blocked?: boolean }> {
  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        'User-Agent': PRICE_SYNC_USER_AGENT,
        Accept: 'text/html',
      },
      redirect: 'follow',
    });
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Fetch failed' };
  }
  const html = await response.text();
  if (isBlockResponse(response.status, html)) {
    return { ok: false, error: `Blocked (${response.status})`, blocked: true };
  }
  return parseSourcePriceHtml(html, response.status);
}

/**
 * True when robots.txt forbids fetching a product path.
 * An empty file or a missing User-agent group is treated as allowed.
 */
export function robotsDisallowsProductPages(robotsTxt: string): boolean {
  const lines = robotsTxt.split(/\r?\n/).map((line) => line.trim());
  let applies = false;
  const disallows: string[] = [];
  for (const line of lines) {
    if (!line || line.startsWith('#')) continue;
    const [rawKey, ...rest] = line.split(':');
    const key = rawKey?.trim().toLowerCase();
    const value = rest.join(':').trim();
    if (key === 'user-agent') {
      applies = value === '*' || /logicbaypricesync/i.test(value);
      continue;
    }
    if (applies && key === 'disallow' && (value === '/' || value === '/*')) {
      disallows.push(value);
    }
  }
  return disallows.length > 0;
}
