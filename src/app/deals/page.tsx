import Link from 'next/link';
import { TopDealCard } from '@/components/home/TopDealCard';
import { getTopDeals } from '@/lib/topDeals';

export const metadata = {
  title: 'Top Deals',
};

export default async function TopDealsPage() {
  const products = await getTopDeals();

  return (
    <div className="min-h-screen bg-muted">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Top Deals</h1>
            <p className="mt-1 text-sm text-gray-600">Products chosen for the homepage Top Deals carousel.</p>
          </div>
          <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">
            Back to home
          </Link>
        </div>
        {products.length === 0 ? (
          <p className="rounded-xl bg-white p-8 text-center text-gray-500">No top deals yet.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {products.map((product) => (
              <TopDealCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
