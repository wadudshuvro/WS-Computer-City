'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Cpu,
  CircuitBoard,
  MemoryStick,
  HardDrive,
  Zap,
  Box,
  Fan,
  Volume2,
  Monitor,
  Keyboard,
  Mouse,
  Headphones,
  Laptop,
  Wifi,
  Gamepad2,
  ChevronRight,
  Search,
  Package,
} from 'lucide-react';
import { adminContentGroups, AdminContentType } from '@/lib/adminCategoryConfig';

const iconMap: Record<string, React.ElementType> = {
  processor: Cpu,
  'graphics-card': CircuitBoard,
  motherboard: CircuitBoard,
  'desktop-ram': MemoryStick,
  ram: MemoryStick,
  ssd: HardDrive,
  hdd: HardDrive,
  'portable-ssd': HardDrive,
  'portable-hdd': HardDrive,
  'power-supply': Zap,
  'computer-case': Box,
  'cpu-cooler': Fan,
  'casing-fan': Fan,
  'ssd-cooler': Fan,
  'custom-cooling-kit': Fan,
  'sound-card': Volume2,
  'gpu-vertical-mount': CircuitBoard,
  monitor: Monitor,
  television: Monitor,
  projector: Monitor,
  keyboard: Keyboard,
  mouse: Mouse,
  headphone: Headphones,
  webcam: Monitor,
  speaker: Volume2,
  laptop: Laptop,
  networking: Wifi,
  gaming: Gamepad2,
};

function ContentTypeCard({
  item,
  count,
  loading,
}: {
  item: AdminContentType;
  count: number | null;
  loading: boolean;
}) {
  const Icon = iconMap[item.slug] || Package;

  return (
    <Link
      href={`/admin/products/category/${item.slug}`}
      className="group flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all"
    >
      <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-700 transition-colors">
            {item.name}
          </h3>
          {!loading && count !== null && (
            <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5 truncate">{item.description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 shrink-0 transition-colors" />
    </Link>
  );
}

export function CategoryContentGrid() {
  const [search, setSearch] = useState('');
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [countsLoading, setCountsLoading] = useState(true);

  useEffect(() => {
    async function loadCounts() {
      const allItems = adminContentGroups.flatMap((g) => g.items);
      const results = await Promise.all(
        allItems.map(async (item) => {
          try {
            const res = await fetch(`/api/admin/products?category=${item.slug}&limit=1`);
            const data = await res.json();
            return { slug: item.slug, total: data.pagination?.total ?? 0 };
          } catch {
            return { slug: item.slug, total: 0 };
          }
        })
      );
      const map: Record<string, number> = {};
      results.forEach((r) => {
        map[r.slug] = r.total;
      });
      setCounts(map);
      setCountsLoading(false);
    }
    loadCounts();
  }, []);

  const filteredGroups = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return adminContentGroups;

    return adminContentGroups
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            item.slug.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q)
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [search]);

  const totalProducts = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div>
      {/* Search bar — Contentful-style */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search content types (Processor, GPU, RAM…)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {!countsLoading && (
          <p className="text-xs text-gray-500 mt-2">
            {totalProducts} total entries across all content types
          </p>
        )}
      </div>

      {filteredGroups.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-500">No content types match &ldquo;{search}&rdquo;</p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredGroups.map((group) => (
            <section key={group.id}>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-900">{group.name}</h2>
                <p className="text-sm text-gray-500">{group.description}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {group.items.map((item) => (
                  <ContentTypeCard
                    key={item.slug}
                    item={item}
                    count={counts[item.slug] ?? null}
                    loading={countsLoading}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
