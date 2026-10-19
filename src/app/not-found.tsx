import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function NotFound() {
  const categories = await prisma.category.findMany({
    where: { isActive: true, parentId: null },
    orderBy: { order: 'asc' },
    take: 12,
    select: { name: true, slug: true },
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900">Page not found</h1>
      <p className="mt-3 text-gray-600">That product or page is not in the catalog.</p>
      <ul className="mt-6 space-y-2">
        <li>
          <Link className="text-blue-700 hover:underline" href="/">
            Home
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.slug}>
            <Link className="text-blue-700 hover:underline" href={`/${category.slug}`}>
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
