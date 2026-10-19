import { NextRequest, NextResponse } from 'next/server';
import { guardAction } from '@/lib/rateLimit/http';
import { searchCatalogProducts } from '@/lib/search/catalogSearch';
import { searchCatalogCategories } from '@/lib/search/categorySearch';
import { MAX_QUERY_LENGTH, isSearchable } from '@/lib/search/text';

export const dynamic = 'force-dynamic';

/**
 * GET /api/search/suggest?q=mouse
 * Header search dropdown: matching products (with image and price) and matching categories.
 */
export async function GET(req: NextRequest) {
  const limited = await guardAction(req, 'suggest');
  if (limited) return limited;

  const q = (req.nextUrl.searchParams.get('q') ?? '').trim().slice(0, MAX_QUERY_LENGTH);
  const empty = { query: q, products: [], productTotal: 0, categories: [], approximate: false };
  if (!isSearchable(q)) {
    return NextResponse.json({ data: empty }, { headers: { 'Cache-Control': 'no-store' } });
  }

  try {
    const [products, rawCategories] = await Promise.all([
      searchCatalogProducts(q, { limit: 8 }),
      searchCatalogCategories(q, 8),
    ]);
    const categories =
      rawCategories.length === 0 && products.correctedQuery
        ? await searchCatalogCategories(products.correctedQuery, 8)
        : rawCategories;
    return NextResponse.json(
      {
        data: {
          query: q,
          products: products.hits,
          productTotal: products.total,
          approximate: products.approximate,
          correctedQuery: products.correctedQuery,
          categories,
        },
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Search suggest failed:', error);
    return NextResponse.json({ data: empty }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  }
}
