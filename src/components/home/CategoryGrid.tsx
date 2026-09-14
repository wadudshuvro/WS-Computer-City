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
    <section className="border-b border-border bg-background py-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:gap-3 lg:grid-cols-8">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="group flex flex-col items-center justify-center rounded-lg border border-border bg-card p-3 text-center shadow-card transition-colors hover:border-primary/40 hover:bg-muted/40"
            >
              <span className="mb-1.5 text-2xl leading-none" aria-hidden>
                {category.icon}
              </span>
              <span className="text-xs font-medium leading-snug text-foreground group-hover:text-primary">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
