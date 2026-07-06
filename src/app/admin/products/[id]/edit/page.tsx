'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AdminShell } from '@/components/admin/AdminShell';
import ProductEditForm from '@/components/admin/ProductEditForm';

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  shortDescription: string | null;
  price: number;
  compareAtPrice: number | null;
  costPrice: number | null;
  stockStatus: string;
  stockQuantity: number;
  lowStockAlert: number;
  categoryId: string;
  brandId: string;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  isFeatured: boolean;
  isActive: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    parent?: {
      id: string;
      name: string;
      slug: string;
    };
  };
  brand: {
    id: string;
    name: string;
    slug: string;
  };
  images: Array<{
    id: string;
    url: string;
    alt: string | null;
    order: number;
    isPrimary: boolean;
  }>;
  specifications: Array<{
    id: string;
    value: string;
    specificationDefinition: {
      id: string;
      key: string;
      name: string;
      dataType: string;
      unit: string | null;
    };
  }>;
}

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/products/${productId}`);

      if (!res.ok) {
        if (res.status === 404) throw new Error('Product not found');
        throw new Error('Failed to fetch product');
      }

      const data = await res.json();
      setProduct(data.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching product:', err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminShell title="Loading…" breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Products', href: '/admin/products' }]}>
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading product…</p>
        </div>
      </AdminShell>
    );
  }

  if (error) {
    return (
      <AdminShell title="Error" breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Products', href: '/admin/products' }]}>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Could not load product</h2>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <Link href="/admin/products" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            ← Back to products
          </Link>
        </div>
      </AdminShell>
    );
  }

  if (!product) return null;

  const categoryBackHref = product.category?.slug
    ? `/admin/products/category/${product.category.slug}`
    : '/admin/products';

  return (
    <AdminShell
      title="Edit entry"
      subtitle={product.name}
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Products', href: '/admin/products' },
        { label: product.category.name, href: categoryBackHref },
        { label: 'Edit' },
      ]}
    >
      <div className="max-w-5xl">
        <ProductEditForm product={product} />
      </div>
    </AdminShell>
  );
}
