'use client';

import Link from 'next/link';
import { AdminShell } from '@/components/admin/AdminShell';
import { CategoryContentGrid } from '@/components/admin/CategoryContentGrid';
import { Plus } from 'lucide-react';

export default function AdminProductsPage() {
  return (
    <AdminShell
      title="All content"
      subtitle="Select a content type to manage products in that category"
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Products' },
      ]}
      actions={
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add entry
        </Link>
      }
    >
      <CategoryContentGrid />
    </AdminShell>
  );
}
