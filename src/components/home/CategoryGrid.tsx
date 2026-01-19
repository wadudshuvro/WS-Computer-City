import Link from 'next/link';

const categories = [
  { name: 'Smartphone', icon: '📱', slug: 'smartphone' },
  { name: 'Laptop', icon: '💻', slug: 'laptop' },
  { name: 'Air Conditioner', icon: '❄️', slug: 'air-conditioner' },
  { name: 'Desktop', icon: '🖥️', slug: 'desktop' },
  { name: 'Processor', icon: '🔧', slug: 'processor' },
  { name: 'Motherboard', icon: '🔌', slug: 'motherboard' },
  { name: 'SSD', icon: '💾', slug: 'ssd' },
  { name: 'Graphics Card', icon: '🎮', slug: 'graphics-card' },
  { name: 'RAM', icon: '🧠', slug: 'ram' },
  { name: 'Television', icon: '📺', slug: 'television' },
  { name: 'Router', icon: '📡', slug: 'router' },
  { name: 'Monitor', icon: '🖥️', slug: 'monitor' },
  { name: 'Gaming Chair', icon: '🪑', slug: 'gaming-chair' },
  { name: 'Power Supply', icon: '⚡', slug: 'power-supply' },
  { name: 'Printer', icon: '🖨️', slug: 'printer' },
  { name: 'Geyser', icon: '🚿', slug: 'geyser' },
];

export function CategoryGrid() {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-blue-500 transition-all group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <h3 className="text-sm font-medium text-gray-800 text-center group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
