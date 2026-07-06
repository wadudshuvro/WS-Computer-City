'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminShell } from '@/components/admin/AdminShell';
import { Package, FolderTree, Tag, ArrowRight } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      router.push('/admin/login');
    }
  }, [router]);

  const cards = [
    {
      title: 'Products',
      description: 'Browse by content type — Processor, GPU, RAM, and more',
      icon: Package,
      links: [
        { label: 'View all content types', href: '/admin/products' },
        { label: 'Add new entry', href: '/admin/products/new' },
      ],
    },
    {
      title: 'Categories',
      description: 'Organize product categories',
      icon: FolderTree,
      links: [
        { label: 'View categories', href: '/admin/categories' },
        { label: 'Add category', href: '/admin/categories/new' },
      ],
    },
    {
      title: 'Brands',
      description: 'Manage product brands',
      icon: Tag,
      links: [
        { label: 'View brands', href: '/admin/brands' },
        { label: 'Add brand', href: '/admin/brands/new' },
      ],
    },
  ];

  return (
    <AdminShell title="Dashboard" subtitle="Welcome to the WS Computer City Admin Panel">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => (
          <div key={card.title} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <card.icon className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">{card.title}</h2>
            </div>
            <p className="text-sm text-gray-500 mb-4">{card.description}</p>
            <div className="space-y-2">
              {card.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium group"
                >
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-base font-semibold text-blue-900 mb-3">Quick setup</h3>
        <ol className="list-decimal list-inside space-y-1.5 text-sm text-blue-800">
          <li>Configure your database in <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">.env</code></li>
          <li>Run migrations: <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">npm run db:migrate</code></li>
          <li>Seed sample data: <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">npm run db:seed</code></li>
          <li>Check database: <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">npm run db:studio</code></li>
        </ol>
      </div>
    </AdminShell>
  );
}
