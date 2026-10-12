import { HeroSlider } from '@/components/home/HeroSlider';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { TopDeals } from '@/components/home/TopDeals';
import { HomeShowcases } from '@/components/home/HomeShowcases';
import { getTopDeals } from '@/lib/topDeals';
import { getHomeShowcases } from '@/lib/homeShowcases';

export default async function HomePage() {
  const [topDeals, showcases] = await Promise.all([getTopDeals(), getHomeShowcases()]);

  return (
    <div className="min-h-screen bg-muted">
      <main className="flex flex-col">
        <HeroSlider />
        <CategoryGrid />
        <TopDeals products={topDeals} />
        <HomeShowcases sections={showcases} />
      </main>
    </div>
  );
}
