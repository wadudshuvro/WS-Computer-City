import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { correctQuery } from '@/lib/search/spell';
import { isSearchable, normalizeText, stem, tokenize } from '@/lib/search/text';

export type SearchProductHit = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  stockStatus: string;
  image: string | null;
  categorySlug: string;
  brand: string | null;
  href: string;
};

type Row = {
  id: string;
  name: string;
  slug: string;
  price: unknown;
  compareAtPrice: unknown;
  stockStatus: string;
  image: string | null;
  categorySlug: string;
  brand: string | null;
};

type Mode = 'and' | 'or';

function scoredCte(tokens: string[], mode: Mode) {
  const patterns = tokens.map((t) => `%${mode === 'or' ? stem(t) : t}%`);
  const score = Prisma.join(
    patterns.map((p) => Prisma.sql`(CASE WHEN hay LIKE ${p} THEN 1 ELSE 0 END)`),
    ' + '
  );
  const min = mode === 'and' ? tokens.length : tokens.length >= 3 ? 2 : 1;
  const cte = Prisma.sql`
    WITH base AS (
      SELECT p.id, p.name, p.slug, p.price, p."compareAtPrice",
             p."stockStatus"::text AS "stockStatus",
             c.slug AS "categorySlug", b.name AS brand,
             regexp_replace(lower(concat_ws(' ', p.name, b.name, p.sku, c.name)), '[^a-z0-9]', '', 'g') AS hay,
             regexp_replace(lower(p.name), '[^a-z0-9]', '', 'g') AS nm
      FROM products p
      JOIN categories c ON c.id = p."categoryId"
      LEFT JOIN brands b ON b.id = p."brandId"
      WHERE p."isActive" = true
    ),
    scored AS (SELECT base.*, (${score}) AS score FROM base)
  `;
  return { cte, min };
}

function toHit(row: Row): SearchProductHit {
  const price = Number(row.price);
  const compare = row.compareAtPrice == null ? null : Number(row.compareAtPrice);
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    price,
    compareAtPrice: compare && compare > price ? compare : null,
    stockStatus: row.stockStatus,
    image: row.image,
    categorySlug: row.categorySlug,
    brand: row.brand,
    href: `/${row.categorySlug}/${row.slug}`,
  };
}

async function runProducts(
  tokens: string[],
  compact: string,
  mode: Mode,
  limit: number,
  offset: number
): Promise<{ hits: SearchProductHit[]; total: number }> {
  const { cte, min } = scoredCte(tokens, mode);
  const startsWith = `${compact}%`;
  const contains = `%${compact}%`;

  const [rows, totals] = await Promise.all([
    prisma.$queryRaw<Row[]>(Prisma.sql`
      ${cte}
      SELECT s.id, s.name, s.slug, s.price, s."compareAtPrice", s."stockStatus",
             s."categorySlug", s.brand,
             (SELECT i.url FROM product_images i WHERE i."productId" = s.id
              ORDER BY i."isPrimary" DESC, i."order" ASC LIMIT 1) AS image
      FROM scored s
      WHERE s.score >= ${min}
      ORDER BY s.score DESC,
               CASE WHEN s.nm LIKE ${startsWith} THEN 0 WHEN s.nm LIKE ${contains} THEN 1 ELSE 2 END,
               CASE WHEN s."stockStatus" = 'IN_STOCK' THEN 0 ELSE 1 END,
               s.price ASC,
               s.name ASC
      LIMIT ${limit} OFFSET ${offset}
    `),
    prisma.$queryRaw<{ total: number }[]>(Prisma.sql`
      ${cte}
      SELECT COUNT(*)::int AS total FROM scored s WHERE s.score >= ${min}
    `),
  ]);

  return { hits: rows.map(toHit), total: totals[0]?.total ?? 0 };
}

/**
 * Partial, case-insensitive product search over name, brand, SKU and category.
 * Spaces and dashes are ignored ("rtx5060" finds "RTX 5060", "12400" finds "i5-12400F").
 * If no product contains every word, it falls back to products that contain some of them,
 * with the best word overlap first, so approximate or misspelled queries still get suggestions.
 */
export async function searchCatalogProducts(
  query: string,
  opts: { limit?: number; offset?: number } = {}
): Promise<{
  hits: SearchProductHit[];
  total: number;
  approximate: boolean;
  /** Set when a typo was fixed from real catalog words, e.g. "keyboard" for "keybord". */
  correctedQuery: string | null;
}> {
  const none = { hits: [], total: 0, approximate: false, correctedQuery: null };
  if (!isSearchable(query)) return none;
  const limit = Math.min(Math.max(opts.limit ?? 8, 1), 48);
  const offset = Math.max(opts.offset ?? 0, 0);
  const tokens = tokenize(query);
  if (tokens.length === 0) return none;
  const compact = normalizeText(query).slice(0, 80);

  const exact = await runProducts(tokens, compact, 'and', limit, offset);
  if (exact.total > 0) return { ...exact, approximate: false, correctedQuery: null };

  const corrected = await correctQuery(query).catch(() => null);
  if (corrected) {
    const fixedTokens = tokenize(corrected);
    const fixed = await runProducts(fixedTokens, normalizeText(corrected), 'and', limit, offset);
    if (fixed.total > 0) return { ...fixed, approximate: true, correctedQuery: corrected };
  }

  const loose = await runProducts(tokens, compact, 'or', limit, offset);
  return { ...loose, approximate: loose.total > 0, correctedQuery: null };
}
