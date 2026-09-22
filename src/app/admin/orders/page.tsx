'use client';

import { useEffect, useState, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';

interface OrderItem {
  id: string;
  productName: string;
  variantLabel?: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface OrderRow {
  id: string;
  orderNumber: string;
  status: string;
  firstName: string;
  lastName?: string | null;
  address: string;
  upazila?: string | null;
  district: string;
  mobile: string;
  email?: string | null;
  comment?: string | null;
  paymentMethod: string;
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
  EXPRESS: 'Express',
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      router.push('/admin/login');
      return;
    }
    fetchOrders();
  }, [router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/orders');
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || 'Failed to load orders');
      setOrders(json.data || []);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminShell
      title="Orders"
      subtitle="Customer checkout submissions (Cash on Delivery)"
      breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Orders' }]}
    >
      {loading ? (
        <p className="text-sm text-gray-500">Loading orders…</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : orders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
          No orders yet. When customers confirm checkout, they will appear here.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Delivery</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Placed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <Fragment key={order.id}>
                  <tr
                    className="cursor-pointer hover:bg-blue-50/40"
                    onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                  >
                    <td className="px-4 py-3 font-medium text-blue-700">{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      {order.firstName}
                      {order.lastName ? ` ${order.lastName}` : ''}
                    </td>
                    <td className="px-4 py-3">{order.mobile}</td>
                    <td className="px-4 py-3">
                      {deliveryLabels[order.deliveryMethod] || order.deliveryMethod}
                    </td>
                    <td className="px-4 py-3 font-semibold">৳ {order.total.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                  </tr>
                  {expandedId === order.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={7} className="px-4 py-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-1 text-sm text-gray-700">
                            <p>
                              <span className="font-medium">Address:</span> {order.address}
                              {order.upazila ? `, ${order.upazila}` : ''}, {order.district}
                            </p>
                            {order.email && (
                              <p>
                                <span className="font-medium">Email:</span> {order.email}
                              </p>
                            )}
                            {order.comment && (
                              <p>
                                <span className="font-medium">Comment:</span> {order.comment}
                              </p>
                            )}
                            <p>
                              <span className="font-medium">Payment:</span> Cash on Delivery
                            </p>
                            <p>
                              <span className="font-medium">Subtotal:</span> ৳{' '}
                              {order.subtotal.toLocaleString()} + delivery ৳{' '}
                              {order.deliveryFee.toLocaleString()}
                            </p>
                          </div>
                          <ul className="space-y-2 text-sm">
                            {order.items.map((item) => (
                              <li
                                key={item.id}
                                className="flex justify-between gap-3 rounded border border-gray-200 bg-white px-3 py-2"
                              >
                                <span>
                                  {item.quantity} × {item.productName}
                                  {item.variantLabel ? (
                                    <span className="ml-2 text-xs text-orange-700">
                                      ({item.variantLabel})
                                    </span>
                                  ) : null}
                                </span>
                                <span className="font-medium">
                                  ৳ {item.lineTotal.toLocaleString()}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
