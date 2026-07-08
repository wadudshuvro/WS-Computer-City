'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AdminShell } from '@/components/admin/AdminShell';
import { ProductEntriesTable, AdminProduct } from '@/components/admin/ProductEntriesTable';
import { getContentTypeBySlug, getContentGroupForSlug } from '@/lib/adminCategoryConfig';
import { Plus, Search } from 'lucide-react';

export default function CategoryProductsPage() {
  const params = useParams();
  const categorySlug = params.categorySlug as string;

  const contentType = getContentTypeBySlug(categorySlug);
  const contentGroup = getContentGroupForSlug(categorySlug);

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        category: categorySlug,
        limit: '100',
        sort: 'newest',
      });
      if (search) query.set('search', search);

      const res = await fetch(`/api/admin/products?${query}`);
      const data = await res.json();
      setProducts(data.data || []);
      setTotal(data.pagination?.total ?? data.data?.length ?? 0);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [categorySlug, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleDelete = async (productId: string): Promise<boolean> => {
    setDeletingId(productId);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setTotal((prev) => prev - 1);
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
      return false;
    } finally {
      setDeletingId(null);
    }
  };

  if (!contentType) {
    return (
      <AdminShell
        title="Content type not found"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Products', href: '/admin/products' },
          { label: categorySlug },
        ]}
      >
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-600 mb-4">No content type found for &ldquo;{categorySlug}&rdquo;</p>
          <Link href="/admin/products" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            ← Back to all content types
          </Link>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title={contentType.name}
      subtitle={contentType.description}
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Products', href: '/admin/products' },
        { label: contentGroup?.name || 'Category', href: '/admin/products' },
        { label: contentType.name },
      ]}
      actions={
        <Link
          href={`/admin/products/new?category=${categorySlug}`}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add entry
        </Link>
      }
    >
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Content type</span>
            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1.5 rounded-lg border border-blue-200">
              {contentType.name}
            </span>
          </div>
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${contentType.name.toLowerCase()} entries…`}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {loading ? 'Loading…' : `${total} ${total === 1 ? 'entry' : 'entries'}`}
          {search && ` matching "${search}"`}
        </p>
      </div>

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading entries…</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No entries yet</h2>
          <p className="text-gray-500 text-sm mb-6">
            {search
              ? `No ${contentType.name.toLowerCase()} products match your search.`
              : `Start by adding your first ${contentType.name.toLowerCase()} product.`}
          </p>
          {!search && (
            <Link
              href={`/admin/products/new?category=${categorySlug}`}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add entry
            </Link>
          )}
        </div>
      ) : (
        <ProductEntriesTable products={products} onDelete={handleDelete} deletingId={deletingId} />
      )}
    </AdminShell>
  );
}
