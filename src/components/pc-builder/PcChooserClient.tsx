'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { compatibilityFor, type BuilderProduct } from '@/lib/pcBuilder/compat';
import { SLOT_BY_ID, type SlotId } from '@/lib/pcBuilder/slots';
import { groupBySlot, usePcBuilderStore } from '@/store/pcBuilderStore';
import { categorySortOptions } from '@/lib/filterConfig';

type ChooserData = {
  products: BuilderProduct[];
  total: number;
  page: number;
  pages: number;
  brands: { slug: string; name: string; count: number }[];
  facets: { key: string; label: string; options: { value: string; count: number }[] }[];
  priceBounds: { min: number; max: number } | null;
};

const money = (n: number) => `${n.toLocaleString('en-US')}৳`;

function FilterBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-gray-200 py-3">
      <h3 className="mb-2 text-sm font-semibold text-gray-800">{title}</h3>
      {children}
    </div>
  );
}

export default function PcChooserClient({ slotId }: { slotId: SlotId }) {
  const slot = SLOT_BY_ID[slotId];
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lines = usePcBuilderStore((s) => s.lines);
  const addPart = usePcBuilderStore((s) => s.addPart);

  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<ChooserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => setMounted(true), []);

  const swapId = searchParams.get('swap');
  const showAll = searchParams.get('all') === '1';
  const sort = searchParams.get('sort') ?? 'default';

  // What the parts already chosen require. Swapping a part ignores that part itself.
  const compat = useMemo(() => {
    const others = swapId ? lines.filter((l) => l.lineId !== swapId) : lines;
    return compatibilityFor(slotId, groupBySlot(others));
  }, [lines, slotId, swapId]);
  const hasCompat = Boolean(compat.socket || compat.memoryTypes.length || compat.maker);
  const compatText = [compat.reason.socket, compat.reason.memory, compat.reason.maker].filter(Boolean).join(' and ');

  const inSlot = lines.filter((l) => l.slot === slotId);
  const full = !swapId && slot.max > 1 && inSlot.length >= slot.max;

  const setParam = useCallback(
    (mutate: (p: URLSearchParams) => void, keepPage = false) => {
      const p = new URLSearchParams(searchParams.toString());
      mutate(p);
      if (!keepPage) p.delete('page');
      const qs = p.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const toggleMulti = (key: string, value: string) =>
    setParam((p) => {
      const current = p.getAll(key);
      p.delete(key);
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      next.forEach((v) => p.append(key, v));
    });

  // Fetch whenever the URL filters or the compatibility context change.
  const apiQuery = useMemo(() => {
    const p = new URLSearchParams();
    p.set('slot', slotId);
    for (const key of ['q', 'min', 'max', 'sort', 'page']) {
      const v = searchParams.get(key);
      if (v) p.set(key, v);
    }
    searchParams.getAll('brand').forEach((b) => p.append('brand', b));
    for (const facet of slot.facets) {
      searchParams.getAll(`f_${facet.key}`).forEach((v) => p.append(`f_${facet.key}`, v));
    }
    if (!showAll) {
      if (compat.socket) p.set('socket', compat.socket);
      if (compat.memoryTypes.length) p.set('memory', compat.memoryTypes.join(','));
      if (compat.maker) p.set('maker', compat.maker);
    }
    return p.toString();
  }, [searchParams, slotId, slot.facets, compat, showAll]);

  useEffect(() => {
    if (!mounted) return;
    const controller = new AbortController();
    setLoading(true);
    setFailed(false);
    fetch(`/api/pc-builder/products?${apiQuery}`, { signal: controller.signal })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error('failed');
        setData(json.data as ChooserData);
        setLoading(false);
      })
      .catch((error) => {
        if ((error as Error).name === 'AbortError') return;
        setFailed(true);
        setLoading(false);
      });
    return () => controller.abort();
  }, [apiQuery, mounted]);

  // Search box and price inputs wait briefly so typing does not reload on every key.
  const [q, setQ] = useState(searchParams.get('q') ?? '');
  const [min, setMin] = useState(searchParams.get('min') ?? '');
  const [max, setMax] = useState(searchParams.get('max') ?? '');
  useEffect(() => {
    const t = setTimeout(() => {
      if (q !== (searchParams.get('q') ?? '')) setParam((p) => (q.trim() ? p.set('q', q.trim()) : p.delete('q')));
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);
  useEffect(() => {
    const t = setTimeout(() => {
      if (min !== (searchParams.get('min') ?? '') || max !== (searchParams.get('max') ?? '')) {
        setParam((p) => {
          min ? p.set('min', min) : p.delete('min');
          max ? p.set('max', max) : p.delete('max');
        });
      }
    }, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [min, max]);

  const choose = (product: BuilderProduct) => {
    addPart(product, swapId);
    router.push('/pc-builder');
  };

  const filterCount =
    searchParams.getAll('brand').length +
    slot.facets.reduce((n, f) => n + searchParams.getAll(`f_${f.key}`).length, 0) +
    (searchParams.get('min') || searchParams.get('max') ? 1 : 0);

  const sidebar = data && (
    <div>
      {filterCount > 0 && (
        <button
          type="button"
          onClick={() => {
            setMin('');
            setMax('');
            setParam((p) => {
              for (const key of Array.from(p.keys())) {
                if (key === 'brand' || key === 'min' || key === 'max' || key.startsWith('f_')) p.delete(key);
              }
            });
          }}
          className="mb-1 text-xs font-medium text-indigo-700 hover:underline"
        >
          Clear all filters
        </button>
      )}

      <FilterBox title="Price Range">
        <div className="flex items-center gap-2">
          <input
            inputMode="numeric"
            value={min}
            onChange={(e) => setMin(e.target.value.replace(/\D/g, ''))}
            placeholder={data.priceBounds ? String(data.priceBounds.min) : 'Min'}
            aria-label="Minimum price"
            className="h-8 w-full rounded border border-gray-300 px-2 text-sm"
          />
          <span className="text-gray-400">-</span>
          <input
            inputMode="numeric"
            value={max}
            onChange={(e) => setMax(e.target.value.replace(/\D/g, ''))}
            placeholder={data.priceBounds ? String(data.priceBounds.max) : 'Max'}
            aria-label="Maximum price"
            className="h-8 w-full rounded border border-gray-300 px-2 text-sm"
          />
        </div>
      </FilterBox>

      {data.facets.map((facet) => (
        <FilterBox key={facet.key} title={facet.label}>
          <ul className="space-y-1.5">
            {facet.options.map((opt) => (
              <li key={opt.value}>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={searchParams.getAll(`f_${facet.key}`).includes(opt.value)}
                    onChange={() => toggleMulti(`f_${facet.key}`, opt.value)}
                    className="h-3.5 w-3.5 rounded border-gray-300"
                  />
                  <span className="flex-1">{opt.value}</span>
                  <span className="text-xs text-gray-400">({opt.count})</span>
                </label>
              </li>
            ))}
          </ul>
        </FilterBox>
      ))}

      {data.brands.length > 1 && (
        <FilterBox title="Brand">
          <ul className="max-h-64 space-y-1.5 overflow-y-auto">
            {data.brands.map((brand) => (
              <li key={brand.slug}>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={searchParams.getAll('brand').includes(brand.slug)}
                    onChange={() => toggleMulti('brand', brand.slug)}
                    className="h-3.5 w-3.5 rounded border-gray-300"
                  />
                  <span className="flex-1">{brand.name}</span>
                  <span className="text-xs text-gray-400">({brand.count})</span>
                </label>
              </li>
            ))}
          </ul>
        </FilterBox>
      )}
    </div>
  );

  const pageLink = (n: number) => {
    const p = new URLSearchParams(searchParams.toString());
    if (n > 1) p.set('page', String(n));
    else p.delete('page');
    const qs = p.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  return (
    <div className="bg-gray-100 pb-10">
      <div className="container mx-auto px-4">
        <nav className="py-3 text-xs text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-800">
            Home
          </Link>{' '}
          /{' '}
          <Link href="/pc-builder" className="hover:text-gray-800">
            PC Builder
          </Link>{' '}
          / <span>Choose a {slot.noun}</span>
        </nav>

        <div className="flex flex-col gap-4 lg:flex-row">
          <aside className="hidden w-60 shrink-0 rounded border border-gray-200 bg-white p-4 lg:block">{sidebar}</aside>

          <main className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-3 rounded border border-gray-200 bg-white p-3">
              <button
                type="button"
                onClick={() => setShowFilters(true)}
                className="inline-flex items-center gap-1.5 rounded border border-gray-300 px-3 py-1.5 text-sm lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters{filterCount > 0 ? ` (${filterCount})` : ''}
              </button>
              <h1 className="mr-auto text-base font-semibold text-gray-900">Choose a {slot.noun}</h1>
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search"
                  aria-label={`Search ${slot.label}`}
                  className="h-9 w-48 rounded border border-gray-300 pl-8 pr-2 text-sm sm:w-60"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                Sort:
                <select
                  value={sort}
                  onChange={(e) =>
                    setParam((p) => (e.target.value === 'default' ? p.delete('sort') : p.set('sort', e.target.value)))
                  }
                  className="h-9 rounded border border-gray-300 bg-white px-2 text-sm"
                >
                  {categorySortOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {hasCompat && !showAll && (
              <p className="mb-3 flex flex-wrap items-center gap-2 rounded bg-indigo-50 px-3 py-2 text-xs text-indigo-900">
                Showing only {slot.label.toLowerCase()} that fit {compatText}.
                <button
                  type="button"
                  onClick={() => setParam((p) => p.set('all', '1'))}
                  className="font-semibold underline"
                >
                  Show all
                </button>
              </p>
            )}
            {hasCompat && showAll && (
              <p className="mb-3 flex flex-wrap items-center gap-2 rounded bg-amber-50 px-3 py-2 text-xs text-amber-900">
                Showing every {slot.label.toLowerCase()}, including ones that may not fit {compatText}.
                <button
                  type="button"
                  onClick={() => setParam((p) => p.delete('all'))}
                  className="font-semibold underline"
                >
                  Only compatible
                </button>
              </p>
            )}
            {full && (
              <p className="mb-3 rounded bg-amber-50 px-3 py-2 text-xs text-amber-900">
                You already added {slot.max} {slot.label}. Remove one on the builder page to add another.
              </p>
            )}

            <div className={`rounded border border-gray-200 bg-white ${loading ? 'opacity-60' : ''}`}>
              {failed && (
                <p className="p-8 text-center text-sm text-red-600">Could not load products. Please try again.</p>
              )}

              {!failed && data && slot.facets.length === 0 && data.total === 0 && slot.id !== 'cpu' && (
                <p className="p-8 text-center text-sm text-gray-600">
                  {filterCount > 0 || searchParams.get('q')
                    ? 'No products match these filters.'
                    : `No ${slot.label} products are available right now.`}
                </p>
              )}
              {!failed && data && data.total === 0 && (slot.facets.length > 0 || slot.id === 'cpu') && (
                <p className="p-8 text-center text-sm text-gray-600">
                  No products match. Try clearing a filter{hasCompat && !showAll ? ' or choosing Show all' : ''}.
                </p>
              )}

              {data && data.products.length > 0 && (
                <ul>
                  {data.products.map((product) => (
                    <li
                      key={product.id}
                      className="flex flex-col gap-3 border-b border-gray-100 p-4 last:border-b-0 sm:flex-row sm:items-center"
                    >
                      <Link
                        href={product.href}
                        target="_blank"
                        className="flex h-28 w-28 shrink-0 items-center justify-center self-center overflow-hidden"
                      >
                        {product.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-contain"
                          />
                        ) : null}
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={product.href}
                          target="_blank"
                          className="text-sm font-semibold text-gray-900 hover:text-indigo-700"
                        >
                          {product.name}
                        </Link>
                        {product.bullets.length > 0 && (
                          <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-xs text-gray-600">
                            {product.bullets.map((b) => (
                              <li key={b}>{b}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="flex shrink-0 flex-row items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
                        <div className="sm:text-right">
                          <p className="text-base font-bold text-destructive">{money(product.price)}</p>
                          {product.compareAtPrice && (
                            <p className="text-xs text-gray-400 line-through">{money(product.compareAtPrice)}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          disabled={full}
                          onClick={() => choose(product)}
                          className="rounded bg-indigo-700 px-8 py-1.5 text-sm font-medium text-white hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                          Add
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {!data && loading && <p className="p-8 text-center text-sm text-gray-500">Loading…</p>}
            </div>

            {data && data.pages > 1 && (
              <nav className="mt-4 flex items-center justify-center gap-3 text-sm" aria-label="Pagination">
                {data.page > 1 && (
                  <Link href={pageLink(data.page - 1)} className="rounded border border-gray-300 bg-white px-3 py-1.5">
                    Previous
                  </Link>
                )}
                <span className="text-gray-600">
                  Page {data.page} of {data.pages} ({data.total} products)
                </span>
                {data.page < data.pages && (
                  <Link href={pageLink(data.page + 1)} className="rounded border border-gray-300 bg-white px-3 py-1.5">
                    Next
                  </Link>
                )}
              </nav>
            )}
          </main>
        </div>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-[400] flex lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
          <div className="relative ml-auto h-full w-80 max-w-[90vw] overflow-y-auto bg-white p-4">
            <button
              type="button"
              onClick={() => setShowFilters(false)}
              aria-label="Close filters"
              className="mb-2 ml-auto block rounded p-1 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </div>
        </div>
      )}
    </div>
  );
}
