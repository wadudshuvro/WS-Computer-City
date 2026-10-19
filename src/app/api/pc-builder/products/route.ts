import { NextRequest, NextResponse } from 'next/server';
import { guardCatalogRead } from '@/lib/rateLimit/http';
import { isSlotId, SLOT_BY_ID } from '@/lib/pcBuilder/slots';
import { parseMemoryTypes, type CpuMaker } from '@/lib/pcBuilder/compat';
import { productsBySlugs, queryChooser } from '@/lib/pcBuilder/query';
import { MAX_QUERY_LENGTH } from '@/lib/search/text';

export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'no-store' };

function num(value: string | null): number | null {
  if (value == null || value.trim() === '') return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/**
 * GET /api/pc-builder/products?slot=cpu&q=&brand=&min=&max=&sort=&page=&socket=&memory=&maker=&f_<key>=
 * GET /api/pc-builder/products?slugs=a,b,c   (restore a shared build)
 */
export async function GET(req: NextRequest) {
  const limited = await guardCatalogRead(req);
  if (limited) return limited;

  const sp = req.nextUrl.searchParams;

  const slugs = sp.get('slugs');
  if (slugs) {
    const products = await productsBySlugs(slugs.split(',').map((s) => s.trim()).filter(Boolean));
    return NextResponse.json({ data: { products } }, { headers: NO_STORE });
  }

  const slotId = sp.get('slot') ?? '';
  if (!isSlotId(slotId)) {
    return NextResponse.json({ error: { code: 'BAD_SLOT', message: 'Unknown component slot.' } }, { status: 400 });
  }
  const slot = SLOT_BY_ID[slotId];

  const facets: Record<string, string[]> = {};
  for (const facet of slot.facets) {
    const values = sp.getAll(`f_${facet.key}`).filter(Boolean).slice(0, 20);
    if (values.length > 0) facets[facet.key] = values;
  }
  const makerParam = sp.get('maker');
  const maker: CpuMaker | null = makerParam === 'intel' || makerParam === 'amd' ? makerParam : null;

  try {
    const data = await queryChooser({
      slot,
      q: (sp.get('q') ?? '').slice(0, MAX_QUERY_LENGTH),
      brands: sp.getAll('brand').filter(Boolean).slice(0, 20),
      min: num(sp.get('min')),
      max: num(sp.get('max')),
      facets,
      sort: sp.get('sort') === 'price_desc' ? 'price_desc' : 'price_asc',
      page: Math.max(1, Math.floor(num(sp.get('page')) ?? 1)),
      socket: sp.get('socket')?.slice(0, 12) || null,
      memoryTypes: parseMemoryTypes(sp.get('memory')),
      maker,
    });
    return NextResponse.json({ data }, { headers: NO_STORE });
  } catch (error) {
    console.error('PC builder products failed:', error);
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Could not load products.' } },
      { status: 500, headers: NO_STORE }
    );
  }
}
