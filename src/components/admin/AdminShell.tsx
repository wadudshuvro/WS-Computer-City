'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Package, FolderTree, Tag, Home, LogOut } from 'lucide-react';

interface AdminShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutGrid, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package, exact: false },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree, exact: true },
  { href: '/admin/brands', label: 'Brands', icon: Tag, exact: true },
];

export function AdminShell({ children, title, subtitle, breadcrumbs, actions }: AdminShellProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn');
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#1e2a3b] text-white flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-white/10">
          <p className="text-xs uppercase tracking-widest text-blue-300 font-semibold">WS Computer City</p>
          <p className="text-lg font-bold mt-1">Admin CMS</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(href, exact)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" />
            View Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-red-600/20 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-8 py-5">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <span>/</span>}
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-blue-600 transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-gray-900 font-medium">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          <div className="flex items-start justify-between gap-4">
            <div>
              {title && <h1 className="text-2xl font-bold text-gray-900">{title}</h1>}
              {subtitle && <p className="text-gray-500 mt-1 text-sm">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
          </div>
        </header>

        <main className="flex-1 px-8 py-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
