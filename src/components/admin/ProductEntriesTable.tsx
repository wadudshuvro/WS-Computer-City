'use client';

import Link from 'next/link';
import { Pencil, Trash2, ExternalLink } from 'lucide-react';

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  stockStatus: string;
  stockQuantity: number;
  category: { name: string; slug: string };
  brand: { name: string };
  isActive: boolean;
  isFeatured: boolean;
  updatedAt?: string;
}

interface ProductEntriesTableProps {
  products: AdminProduct[];
  onDelete: (id: string) => void;
  deletingId?: string | null;
}

function stockBadge(status: string) {
  const map: Record<string, string> = {
    IN_STOCK: 'bg-green-100 text-green-800',
    OUT_OF_STOCK: 'bg-red-100 text-red-800',
    PRE_ORDER: 'bg-blue-100 text-blue-800',
    UPCOMING: 'bg-purple-100 text-purple-800',
    DISCONTINUED: 'bg-gray-100 text-gray-600',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
}

export function ProductEntriesTable({ products, onDelete, deletingId }: ProductEntriesTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50/80">
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Brand</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">SKU</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
            <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-blue-50/30 transition-colors group">
              <td className="px-5 py-4">
                <div className="font-medium text-gray-900 text-sm">{product.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{product.category.name}</div>
              </td>
              <td className="px-5 py-4 text-sm text-gray-700">{product.brand.name}</td>
              <td className="px-5 py-4 text-sm font-mono text-gray-600">{product.sku}</td>
              <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                ৳{Number(product.price).toLocaleString()}
              </td>
              <td className="px-5 py-4 text-sm text-gray-600">{product.stockQuantity}</td>
              <td className="px-5 py-4">
                <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${stockBadge(product.stockStatus)}`}>
                  {product.stockStatus.replace(/_/g, ' ')}
                </span>
                {!product.isActive && (
                  <span className="ml-1 inline-flex text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    Hidden
                  </span>
                )}
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100">
                  <Link
                    href={`/products/${product.slug}`}
                    target="_blank"
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View on site"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => onDelete(product.id)}
                    disabled={deletingId === product.id}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
