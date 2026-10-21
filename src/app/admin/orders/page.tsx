'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

interface OrderItem {
  id: string;
  productId?: string | null;
  productName: string;
  productSlug?: string | null;
  productSku?: string | null;
  imageUrl?: string | null;
  variantLabel?: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface OrderRow {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  firstName: string;
  lastName?: string | null;
  address: string;
  upazila?: string | null;
  district: string;
  mobile: string;
  email?: string | null;
  comment?: string | null;
  paymentMethod: string;
  paymentStatus?: string;
  deliveryMethod: string;
  deliveryFee: number;
  subtotal: number;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

const deliveryLabels: Record<string, string> = {
  HOME_DELIVERY: 'Home Delivery',
  STORE_PICKUP: 'Store Pickup',
  EXPRESS: 'Express Delivery',
};

const STATUS_META: Record<OrderStatus, { label: string; badge: string; dot: string; bar: string }> = {
  PENDING: {
    label: 'Pending',
    badge: 'bg-amber-50 text-amber-800 ring-amber-200',
    dot: 'bg-amber-500',
    bar: 'bg-amber-400',
  },
  CONFIRMED: {
    label: 'Confirmed',
    badge: 'bg-blue-50 text-blue-800 ring-blue-200',
    dot: 'bg-blue-500',
    bar: 'bg-blue-500',
  },
  COMPLETED: {
    label: 'Completed',
    badge: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    dot: 'bg-emerald-500',
    bar: 'bg-emerald-500',
  },
  CANCELLED: {
    label: 'Cancelled',
    badge: 'bg-red-50 text-red-800 ring-red-200',
    dot: 'bg-red-500',
    bar: 'bg-red-400',
  },
};

const FILTERS: { id: 'ALL' | OrderStatus; label: string }[] = [
  { id: 'ALL', label: 'All orders' },
  { id: 'PENDING', label: 'Pending' },
  { id: 'CONFIRMED', label: 'Confirmed' },
  { id: 'COMPLETED', label: 'Completed' },
  { id: 'CANCELLED', label: 'Cancelled' },
];

const taka = (value: number) => `৳${Math.round(value).toLocaleString('en-US')}`;

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  return new Date(iso).toLocaleDateString('en-GB');
}

function fullName(order: OrderRow): string {
  return [order.firstName, order.lastName].filter(Boolean).join(' ');
}

function fullAddress(order: OrderRow): string {
  return [order.address, order.upazila, order.district].filter(Boolean).join(', ');
}

function summaryText(order: OrderRow): string {
  return [
    `Order ${order.orderNumber}`,
    `Customer: ${fullName(order)}`,
    `Mobile: ${order.mobile}`,
    order.email ? `Email: ${order.email}` : null,
    `Address: ${fullAddress(order)}`,
    '',
    ...order.items.map(
      (item) =>
        `${item.quantity} x ${item.productName}${item.productSku ? ` [${item.productSku}]` : ''} = ${taka(item.lineTotal)}`
    ),
    '',
    `Delivery: ${taka(order.deliveryFee)}`,
    `Total (Cash on Delivery): ${taka(order.total)}`,
    order.comment ? `Note: ${order.comment}` : null,
  ]
    .filter((line) => line !== null)
    .join('\n');
}

function ProductThumb({ item, size = 'md' }: { item: OrderItem; size?: 'md' | 'lg' }) {
  const dimension = size === 'lg' ? 'h-20 w-20' : 'h-14 w-14';
  return item.imageUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item.imageUrl}
      alt={item.productName}
      className={`${dimension} shrink-0 rounded-lg border border-gray-200 bg-white object-contain p-1`}
    />
  ) : (
    <div
      className={`${dimension} flex shrink-0 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-xs text-gray-400`}
    >
      No image
    </div>
  );
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [query, setQuery] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/orders', { cache: 'no-store' });
      const json = await res.json();
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      setOrders(json.data || []);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (order: OrderRow, status: OrderStatus) => {
    if (
      status === 'CANCELLED' &&
      !window.confirm(`Cancel order ${order.orderNumber} for ${fullName(order)}?`)
    ) {
      return;
    }
    setBusyId(order.id);
    setNotice('');
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error?.message || 'Could not update the order');
      setOrders((prev) => prev.map((row) => (row.id === order.id ? { ...row, status } : row)));
      setNotice(`${order.orderNumber} is now ${STATUS_META[status].label}.`);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Could not update the order');
    } finally {
      setBusyId(null);
    }
  };

  const copyOrder = async (order: OrderRow) => {
    try {
      await navigator.clipboard.writeText(summaryText(order));
      setCopiedId(order.id);
      setTimeout(() => setCopiedId((current) => (current === order.id ? null : current)), 1800);
    } catch {
      setNotice('Copy is blocked by the browser. Select the text manually.');
    }
  };

  const counts = useMemo(() => {
    const base: Record<'ALL' | OrderStatus, number> = {
      ALL: orders.length,
      PENDING: 0,
      CONFIRMED: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };
    for (const order of orders) base[order.status] += 1;
    return base;
  }, [orders]);

  const openValue = useMemo(
    () =>
      orders
        .filter((order) => order.status === 'PENDING' || order.status === 'CONFIRMED')
        .reduce((sum, order) => sum + order.total, 0),
    [orders]
  );
  const completedValue = useMemo(
    () => orders.filter((order) => order.status === 'COMPLETED').reduce((sum, order) => sum + order.total, 0),
    [orders]
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return orders.filter((order) => {
      if (filter !== 'ALL' && order.status !== filter) return false;
      if (!needle) return true;
      const haystack = [
        order.orderNumber,
        fullName(order),
        order.mobile,
        order.email || '',
        ...order.items.flatMap((item) => [item.productName, item.productSku || '']),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [orders, filter, query]);

  return (
    <AdminShell
      title="Orders"
      subtitle="Every checkout from the storefront (Cash on Delivery). Newest first."
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Orders' }]}
      actions={
        <button
          type="button"
          onClick={fetchOrders}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Refresh
        </button>
      }
    >
      {loading ? (
        <div className="space-y-4">
          {[0, 1].map((n) => (
            <div key={n} className="h-48 animate-pulse rounded-xl border border-gray-200 bg-white" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-base font-semibold text-gray-800">No orders yet</p>
          <p className="mt-1 text-sm text-gray-500">
            When a customer confirms checkout, the order appears here with the product photo and delivery details.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Summary */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Total orders</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{counts.ALL}</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-amber-700">Need action</p>
              <p className="mt-1 text-2xl font-bold text-amber-900">{counts.PENDING}</p>
              <p className="text-xs text-amber-700">Pending - call the customer to confirm</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Open order value</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{taka(openValue)}</p>
              <p className="text-xs text-gray-500">Pending + confirmed</p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">Completed sales</p>
              <p className="mt-1 text-2xl font-bold text-emerald-900">{taka(completedValue)}</p>
              <p className="text-xs text-emerald-700">{counts.COMPLETED} delivered</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setFilter(option.id)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                    filter === option.id
                      ? 'bg-gray-900 text-white'
                      : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                  <span className={`ml-1.5 text-xs ${filter === option.id ? 'text-gray-300' : 'text-gray-400'}`}>
                    {counts[option.id]}
                  </span>
                </button>
              ))}
            </div>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search order no., name, mobile, product…"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-80"
            />
          </div>

          {notice && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-900" role="status">
              {notice}
            </div>
          )}

          {/* Orders */}
          {visible.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
              No orders match this filter.
            </div>
          ) : (
            <div className="space-y-5">
              {visible.map((order) => {
                const meta = STATUS_META[order.status] ?? STATUS_META.PENDING;
                const units = order.items.reduce((sum, item) => sum + item.quantity, 0);
                const busy = busyId === order.id;
                return (
                  <article
                    key={order.id}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                  >
                    <div className={`h-1 ${meta.bar}`} />

                    {/* Header */}
                    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/70 px-5 py-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-base font-bold text-gray-900">#{order.orderNumber}</h2>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${meta.badge}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                          {meta.label}
                        </span>
                        <span
                          className="text-xs text-gray-500"
                          title={new Date(order.createdAt).toLocaleString('en-GB')}
                        >
                          {timeAgo(order.createdAt)} · {new Date(order.createdAt).toLocaleString('en-GB')}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {units} item{units === 1 ? '' : 's'} · Cash on Delivery
                        </p>
                        <p className="text-lg font-bold text-gray-900">{taka(order.total)}</p>
                      </div>
                    </header>

                    <div className="grid gap-0 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                      {/* Products */}
                      <section className="space-y-3 p-5">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Ordered products
                        </h3>
                        <ul className="space-y-3">
                          {order.items.map((item) => (
                            <li
                              key={item.id}
                              className="flex items-start gap-4 rounded-lg border border-gray-200 p-3"
                            >
                              <ProductThumb item={item} size="lg" />
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold leading-snug text-gray-900">{item.productName}</p>
                                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                                  {item.productSku && <span>SKU: {item.productSku}</span>}
                                  {item.variantLabel && (
                                    <span className="text-orange-700">Option: {item.variantLabel}</span>
                                  )}
                                </div>
                                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                                  {item.productId && (
                                    <Link
                                      href={`/admin/products/${item.productId}/edit`}
                                      className="font-medium text-blue-700 hover:underline"
                                    >
                                      Edit product
                                    </Link>
                                  )}
                                  {item.productSlug && (
                                    <a
                                      href={`/products/${item.productSlug}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="font-medium text-blue-700 hover:underline"
                                    >
                                      View on store ↗
                                    </a>
                                  )}
                                </div>
                              </div>
                              <div className="shrink-0 text-right">
                                <p className="text-xs text-gray-500">
                                  {item.quantity} × {taka(item.unitPrice)}
                                </p>
                                <p className="text-base font-bold text-gray-900">{taka(item.lineTotal)}</p>
                              </div>
                            </li>
                          ))}
                        </ul>

                        <dl className="ml-auto max-w-xs space-y-1 pt-1 text-sm">
                          <div className="flex justify-between text-gray-600">
                            <dt>Subtotal</dt>
                            <dd>{taka(order.subtotal)}</dd>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <dt>{deliveryLabels[order.deliveryMethod] || order.deliveryMethod}</dt>
                            <dd>{order.deliveryFee > 0 ? taka(order.deliveryFee) : 'Free'}</dd>
                          </div>
                          <div className="flex justify-between border-t border-gray-200 pt-1 text-base font-bold text-gray-900">
                            <dt>Collect on delivery</dt>
                            <dd>{taka(order.total)}</dd>
                          </div>
                        </dl>
                      </section>

                      {/* Customer */}
                      <section className="space-y-4 border-t border-gray-100 bg-gray-50/40 p-5 lg:border-l lg:border-t-0">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Customer</h3>
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-base font-bold text-blue-700">
                            {(order.firstName[0] || '?').toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-gray-900">{fullName(order)}</p>
                            <p className="text-xs text-gray-500">
                              First name: {order.firstName}
                              {order.lastName ? ` · Last name: ${order.lastName}` : ''}
                            </p>
                          </div>
                        </div>

                        <dl className="space-y-2.5 text-sm">
                          <div>
                            <dt className="text-xs text-gray-500">Mobile</dt>
                            <dd>
                              <a href={`tel:${order.mobile}`} className="font-semibold text-blue-700 hover:underline">
                                {order.mobile}
                              </a>
                            </dd>
                          </div>
                          {order.email && (
                            <div>
                              <dt className="text-xs text-gray-500">Email</dt>
                              <dd className="break-all">
                                <a href={`mailto:${order.email}`} className="text-blue-700 hover:underline">
                                  {order.email}
                                </a>
                              </dd>
                            </div>
                          )}
                          <div>
                            <dt className="text-xs text-gray-500">Delivery address</dt>
                            <dd className="text-gray-800">{fullAddress(order)}</dd>
                          </div>
                          <div>
                            <dt className="text-xs text-gray-500">Delivery method</dt>
                            <dd className="text-gray-800">
                              {deliveryLabels[order.deliveryMethod] || order.deliveryMethod}
                            </dd>
                          </div>
                          {order.comment && (
                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                              <dt className="text-xs font-semibold text-amber-800">Customer note</dt>
                              <dd className="mt-0.5 text-amber-900">{order.comment}</dd>
                            </div>
                          )}
                        </dl>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 border-t border-gray-200 pt-4">
                          {order.status === 'PENDING' && (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => changeStatus(order, 'CONFIRMED')}
                              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                              Confirm order
                            </button>
                          )}
                          {order.status === 'CONFIRMED' && (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => changeStatus(order, 'COMPLETED')}
                              className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                              Mark delivered
                            </button>
                          )}
                          {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => changeStatus(order, 'CANCELLED')}
                              className="rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          )}
                          {(order.status === 'CANCELLED' || order.status === 'COMPLETED') && (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => changeStatus(order, 'PENDING')}
                              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                              Reopen as pending
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => copyOrder(order)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            {copiedId === order.id ? 'Copied ✓' : 'Copy details'}
                          </button>
                        </div>
                      </section>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </AdminShell>
  );
}
