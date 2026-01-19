'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
  const router = useRouter();

  // Simple client-side protection (will be replaced with proper auth later)
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-gray-900">
              Admin Dashboard 🔐
            </h1>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-blue-600 hover:underline">
                View Website
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
          <p className="text-gray-600 mb-8">
            Welcome to the WS Computer City Admin Panel
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-2">Products</h2>
              <p className="text-gray-600 mb-4">Manage your product catalog</p>
              <div className="space-y-2">
                <a href="/admin/products" className="block text-blue-600 hover:underline">
                  → View All Products
                </a>
                <a href="/admin/products/new" className="block text-blue-600 hover:underline">
                  → Add New Product
                </a>
              </div>
            </div>

            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-2">Categories</h2>
              <p className="text-gray-600 mb-4">Organize product categories</p>
              <div className="space-y-2">
                <a href="/admin/categories" className="block text-blue-600 hover:underline">
                  → View Categories
                </a>
                <a href="/admin/categories/new" className="block text-blue-600 hover:underline">
                  → Add Category
                </a>
              </div>
            </div>

            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-2">Brands</h2>
              <p className="text-gray-600 mb-4">Manage product brands</p>
              <div className="space-y-2">
                <a href="/admin/brands" className="block text-blue-600 hover:underline">
                  → View Brands
                </a>
                <a href="/admin/brands/new" className="block text-blue-600 hover:underline">
                  → Add Brand
                </a>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              📚 Quick Setup Guide
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Configure your database in <code className="bg-blue-100 px-2 py-1 rounded">.env</code></li>
              <li>Run migrations: <code className="bg-blue-100 px-2 py-1 rounded">npm run db:migrate</code></li>
              <li>Seed sample data: <code className="bg-blue-100 px-2 py-1 rounded">npm run db:seed</code></li>
              <li>Check database: <code className="bg-blue-100 px-2 py-1 rounded">npm run db:studio</code></li>
            </ol>
          </div>

          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-gray-500">
              💡 <strong>Note:</strong> Full admin UI implementation with forms, tables, and CRUD operations 
              will be added next. For now, you can use Prisma Studio or API endpoints directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
