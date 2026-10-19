'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Loader2, Search, Tag } from 'lucide-react';

type ProductHit = {
  id: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  stockStatus: string;
  image: string | null;
  href: string;
};

type CategoryHit = { label: string; href: string; trail: string };

type SuggestData = {
  query: string;
  products: ProductHit[];
  productTotal: number;
  categories: CategoryHit[];
  approximate?: boolean;
  correctedQuery?: string | null;
};

type Tab = 'products' | 'categories';

const money = (n: number) => `${n.toLocaleString('en-US')}৳`;

export function HeaderSearch() {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SuggestData | null>(null);
  const [tab, setTab] = useState<Tab>('products');
  const [active, setActive] = useState(-1);

  const trimmed = query.trim();

  useEffect(() => {
    if (trimmed.replace(/[^a-z0-9]/gi, '').length < 2) {
      setData(null);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(String(res.status));
        const json = (await res.json()) as { data: SuggestData };
        setData(json.data);
        setActive(-1);
        // Land on the tab that has something to show.
        setTab(json.data.products.length === 0 && json.data.categories.length > 0 ? 'categories' : 'products');
        setLoading(false);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setData(null);
          setLoading(false);
        }
      }
    }, 180);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed]);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  const resultsHref = `/search?q=${encodeURIComponent(data?.correctedQuery || trimmed)}`;

  const items = useMemo(() => {
    if (!data) return [] as { href: string }[];
    return tab === 'products'
      ? [...data.products.map((p) => ({ href: p.href })), ...(data.productTotal > 0 ? [{ href: resultsHref }] : [])]
      : data.categories.map((c) => ({ href: c.href }));
  }, [data, tab, resultsHref]);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      inputRef.current?.blur();
      router.push(href);
    },
    [router]
  );

  const submit = () => {
    if (trimmed.length < 2) return;
    if (active >= 0 && items[active]) return go(items[active].href);
    go(resultsHref);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (items.length === 0) return;
      e.preventDefault();
      setOpen(true);
      setActive((i) => {
        const next = e.key === 'ArrowDown' ? i + 1 : i - 1;
        if (next >= items.length) return -1;
        if (next < -1) return items.length - 1;
        return next;
      });
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  };

  const showPanel = open && trimmed.length >= 2;
  const productCount = data?.productTotal ?? 0;
  const categoryCount = data?.categories.length ?? 0;
  const nothing = data && data.products.length === 0 && data.categories.length === 0;

  return (
    <div ref={rootRef} className="relative flex min-w-0 flex-1">
      <form
        role="search"
        className="flex min-w-0 flex-1"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <input
          ref={inputRef}
          type="search"
          value={query}
          placeholder="Search"
          aria-label="Search products"
          aria-expanded={showPanel}
          aria-controls={listId}
          autoComplete="off"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="h-10 min-w-0 flex-1 rounded-l-full border-0 bg-white px-5 text-sm text-foreground outline-none placeholder:text-gray-400 [&::-webkit-search-cancel-button]:hidden"
        />
        <button
          type="submit"
          aria-label="Search"
          className="flex h-10 w-11 shrink-0 items-center justify-center rounded-r-full bg-white text-gray-500 hover:text-gray-800"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </button>
      </form>

      {showPanel && (
        <div
          id={listId}
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-[300] overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-900 shadow-2xl"
        >
          <div className="flex border-b border-gray-200 text-sm font-semibold" role="tablist">
            {(['products', 'categories'] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                onClick={() => {
                  setTab(t);
                  setActive(-1);
                }}
                className={`flex-1 px-4 py-2.5 transition-colors ${
                  tab === t
                    ? 'border-b-2 border-destructive text-destructive'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {t === 'products' ? 'Products' : 'Categories'}
                {data && (
                  <span className="ml-1.5 text-xs font-normal text-gray-400">
                    ({t === 'products' ? productCount : categoryCount})
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="max-h-[70vh] overflow-y-auto">
            {!data && loading && <p className="px-4 py-6 text-center text-sm text-gray-500">Searching…</p>}

            {nothing && (
              <p className="px-4 py-6 text-center text-sm text-gray-500">
                No results for <span className="font-semibold text-gray-800">“{trimmed}”</span>. Try a shorter word
                or a model number.
              </p>
            )}

            {data && data.correctedQuery && (tab === 'products' ? productCount : categoryCount) > 0 && (
              <p className="border-b border-gray-100 bg-gray-50 px-4 py-2 text-xs text-gray-500">
                Showing results for <span className="font-semibold text-gray-800">{data.correctedQuery}</span>
              </p>
            )}

            {data && tab === 'products' && data.products.length > 0 && (
              <ul>
                {data.products.map((p, i) => (
                  <li key={p.id}>
                    <Link
                      href={p.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 border-b border-gray-100 px-4 py-2.5 hover:bg-gray-50 ${
                        active === i ? 'bg-gray-100' : ''
                      }`}
                    >
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded bg-white">
                        {p.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.image}
                            alt=""
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <Search className="h-5 w-5 text-gray-300" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-2 text-sm font-medium text-gray-900">{p.name}</span>
                        <span className="mt-0.5 flex flex-wrap items-baseline gap-2">
                          {p.stockStatus === 'OUT_OF_STOCK' ? (
                            <span className="text-xs font-semibold text-gray-500">Out Of Stock</span>
                          ) : (
                            <>
                              <span className="text-sm font-bold text-destructive">{money(p.price)}</span>
                              {p.compareAtPrice && (
                                <span className="text-xs text-gray-400 line-through">{money(p.compareAtPrice)}</span>
                              )}
                            </>
                          )}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
                {productCount > 0 && (
                  <li>
                    <Link
                      href={resultsHref}
                      onClick={() => setOpen(false)}
                      className={`block px-4 py-3 text-center text-sm font-semibold text-destructive hover:bg-gray-50 ${
                        active === data.products.length ? 'bg-gray-100' : ''
                      }`}
                    >
                      See all results ({productCount})
                    </Link>
                  </li>
                )}
              </ul>
            )}

            {data && tab === 'products' && data.products.length === 0 && !nothing && (
              <p className="px-4 py-6 text-center text-sm text-gray-500">
                No products found. Check the Categories tab.
              </p>
            )}

            {data && tab === 'categories' && data.categories.length > 0 && (
              <ul>
                {data.categories.map((c, i) => (
                  <li key={c.href}>
                    <Link
                      href={c.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 border-b border-gray-100 px-4 py-3 hover:bg-gray-50 ${
                        active === i ? 'bg-gray-100' : ''
                      }`}
                    >
                      <Tag className="h-4 w-4 shrink-0 text-gray-400" />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900">{c.label}</span>
                      {c.trail && <span className="shrink-0 text-xs text-gray-400">in {c.trail}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {data && tab === 'categories' && data.categories.length === 0 && !nothing && (
              <p className="px-4 py-6 text-center text-sm text-gray-500">
                No categories found. Check the Products tab.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
