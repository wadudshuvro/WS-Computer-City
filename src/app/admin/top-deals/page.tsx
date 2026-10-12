'use client';

import { useCallback, useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import type { TopDealProduct } from '@/lib/topDealTypes';

export default function AdminTopDealsPage() {
  const [deals, setDeals] = useState<TopDealProduct[]>([]);
  const [results, setResults] = useState<TopDealProduct[]>([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  const load = useCallback(async (query = '') => {
    const res = await fetch(`/api/admin/top-deals${query ? `?search=${encodeURIComponent(query)}` : ''}`);
    const data = await res.json();
    setDeals(data.deals || []);
    setResults(data.results || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addProduct = async (productId: string) => {
    setMessage('');
    const res = await fetch('/api/admin/top-deals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setMessage(data?.error?.message || 'Could not add that product.');
      return;
    }
    setSearch('');
    await load();
  };

  const removeProduct = async (productId: string) => {
    await fetch(`/api/admin/top-deals/${productId}`, { method: 'DELETE' });
    await load(search);
  };

  const move = async (index: number, direction: -1 | 1) => {
    const next = index + direction;
    if (next < 0 || next >= deals.length) return;
    const ids = deals.map((deal) => deal.id);
    const [item] = ids.splice(index, 1);
    ids.splice(next, 0, item!);
    await fetch('/api/admin/top-deals', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    await load(search);
  };

  return (
    <AdminShell
      title="Top Deals"
      subtitle="Products in this list appear in the homepage Top Deals carousel."
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Top Deals' },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-4 py-3 text-sm text-gray-600">
            {deals.length} product{deals.length === 1 ? '' : 's'} on the homepage
          </div>
          <ul>
            {deals.map((deal, index) => (
              <li key={deal.id} className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-gray-50">
                  {deal.imageUrl ? <img src={deal.imageUrl} alt="" className="h-full w-full object-contain" /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{deal.name}</p>
                  <p className="text-xs text-gray-500">
                    {deal.categoryName} · ৳{deal.price.toLocaleString()}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button type="button" onClick={() => move(index, -1)} className="rounded border px-2 py-1 text-xs" disabled={index === 0}>
                    Up
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    className="rounded border px-2 py-1 text-xs"
                    disabled={index === deals.length - 1}
                  >
                    Down
                  </button>
                  <button type="button" onClick={() => removeProduct(deal.id)} className="rounded border border-red-200 px-2 py-1 text-xs text-red-600">
                    Remove
                  </button>
                </div>
              </li>
            ))}
            {deals.length === 0 && <li className="px-4 py-8 text-center text-sm text-gray-500">No products in Top Deals yet.</li>}
          </ul>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold text-gray-900">Add a product</h2>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              load(search.trim());
            }}
            className="flex gap-2"
          >
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name or SKU"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <button type="submit" className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white">
              Search
            </button>
          </form>
          {message && <p className="mt-2 text-xs text-red-600">{message}</p>}
          <ul className="mt-3 space-y-2">
            {results.map((product) => (
              <li key={product.id} className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.categoryName}</p>
                </div>
                <button type="button" onClick={() => addProduct(product.id)} className="shrink-0 text-sm font-medium text-blue-600">
                  Add
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AdminShell>
  );
}
