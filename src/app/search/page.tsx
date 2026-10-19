import type { Metadata } from 'next';
import Link from 'next/link';
import { searchCatalogProducts } from '@/lib/search/catalogSearch';
import { searchCatalogCategories } from '@/lib/search/categorySearch';
import { MAX_QUERY_LENGTH, isSearchable } from '@/lib/search/text';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 24;

type PageProps = { searchParams: Promise<{ q?: string; page?: string }> };

export const metadata: Metadata = {
  title: 'Search',
  robots: { index: false, follow: true },
};

const money = (n: number) => `${n.toLocaleString('en-US')}৳`;

export default async function SearchPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const q = (sp.q ?? '').trim().slice(0, MAX_QUERY_LENGTH);
  const page = Math.max(1, Number(sp.page) || 1);
  const ok = isSearchable(q);

  const [products, categories] = ok
    ? await Promise.all([
        searchCatalogProducts(q, { limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE }),
        searchCatalogCategories(q, 12),
      ])
    : [null, []];

  const shown = products?.correctedQuery ?? q;
  const totalPages = products ? Math.max(1, Math.ceil(products.total / PAGE_SIZE)) : 1;
  const pageHref = (n: number) => `/search?q=${encodeURIComponent(q)}${n > 1 ? `&page=${n}` : ''}`;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-gray-900">
        {ok ? (
          <>
            Search results for <span className="text-destructive">“{shown}”</span>
          </>
        ) : (
          'Search'
        )}
      </h1>
      {products?.correctedQuery && (
        <p className="mt-1 text-sm text-gray-500">
          Showing results for <strong>{products.correctedQuery}</strong> instead of “{q}”.
        </p>
      )}
      {products?.approximate && !products.correctedQuery && (
        <p className="mt-1 text-sm text-gray-500">No exact match. These products match part of your search.</p>
      )}
      {!ok && <p className="mt-2 text-sm text-gray-500">Type at least two letters or numbers to search.</p>}

      {categories.length > 0 && (
        <div className="mt-4">
          <h2 className="mb-2 text-sm font-semibold text-gray-700">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-gray-800 hover:border-destructive hover:text-destructive"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {products && (
        <>
          <p className="mt-6 text-sm text-gray-500">
            {products.total} {products.total === 1 ? 'product' : 'products'} found
          </p>

          {products.total === 0 ? (
            <p className="mt-6 rounded border border-gray-200 bg-white p-8 text-center text-gray-600">
              No products matched “{q}”. Try a shorter word, a brand, or a model number.
            </p>
          ) : (
            <ul className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {products.hits.map((p) => (
                <li key={p.id} className="rounded border border-gray-200 bg-white">
                  <Link href={p.href} className="flex h-full flex-col p-3 hover:shadow-md">
                    <span className="flex aspect-square items-center justify-center overflow-hidden">
                      {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.image}
                          alt={p.name}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-contain"
                        />
                      ) : null}
                    </span>
                    <span className="mt-2 line-clamp-2 text-sm font-medium text-gray-900">{p.name}</span>
                    <span className="mt-auto pt-2 text-center">
                      {p.stockStatus === 'OUT_OF_STOCK' ? (
                        <span className="text-sm font-semibold text-gray-500">Out Of Stock</span>
                      ) : (
                        <>
                          <span className="text-base font-bold text-destructive">{money(p.price)}</span>
                          {p.compareAtPrice && (
                            <span className="ml-2 text-xs text-gray-400 line-through">{money(p.compareAtPrice)}</span>
                          )}
                        </>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {totalPages > 1 && (
            <nav className="mt-6 flex items-center justify-center gap-3 text-sm" aria-label="Pagination">
              {page > 1 && (
                <Link href={pageHref(page - 1)} className="rounded border border-gray-300 px-3 py-1.5 hover:bg-gray-50">
                  Previous
                </Link>
              )}
              <span className="text-gray-500">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link href={pageHref(page + 1)} className="rounded border border-gray-300 px-3 py-1.5 hover:bg-gray-50">
                  Next
                </Link>
              )}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
