import Link from 'next/link';

export function FlashSale() {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-red-500">⚡</span>
            Flash Sale
          </h2>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors">
              ‹
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors">
              ›
            </button>
          </div>
        </div>

        {/* Flash Sale Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow group"
            >
              <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform">
                🖥️
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  Product Name Here
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-red-600">৳25,000</span>
                  <span className="text-sm text-gray-500 line-through">৳30,000</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <span className="text-yellow-500">★★★★★</span>
                  <span>(12)</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
}
