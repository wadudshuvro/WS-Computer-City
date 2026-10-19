import Link from 'next/link';
import type { HomeTopCategory } from '@/lib/homeCategories';

export function CategoryGrid({ categories }: { categories: HomeTopCategory[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="bg-background py-8">
      <div className="container mx-auto">
        <h2 className="mb-5 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Top <span className="bg-gradient-to-r from-blue-900 to-blue-500 bg-clip-text text-transparent">Categories</span>
        </h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group flex h-36 flex-col items-center justify-center gap-3 rounded-lg bg-[#f1f1f5] px-2 text-center transition-all hover:-translate-y-0.5 hover:bg-[#e8e8f0] hover:shadow-md md:h-40"
            >
              <span className="flex h-16 w-16 items-center justify-center md:h-20 md:w-20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={category.imageUrl ?? ''}
                  alt={category.name}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform group-hover:scale-105"
                />
              </span>
              <span className="text-xs font-medium leading-snug text-slate-800 group-hover:text-blue-700 md:text-sm">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
