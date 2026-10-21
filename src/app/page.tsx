import type { Metadata } from 'next';
import { HeroSlider } from '@/components/home/HeroSlider';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { TopDeals } from '@/components/home/TopDeals';
import { HomeShowcases } from '@/components/home/HomeShowcases';
import { getTopDeals } from '@/lib/topDeals';
import { getHomeShowcases } from '@/lib/homeShowcases';
import { getHomeTopCategories } from '@/lib/homeCategories';
import { getHeroSlides } from '@/lib/homeHero';
import { siteName } from '@/lib/launch/site';
import { organizationJsonLd } from '@/lib/seo/catalogSeo';

export const metadata: Metadata = {
  title: `${siteName()} | Computer Hardware in Bangladesh`,
  description: `${siteName()} sells computer parts, laptops, and accessories in Bangladesh. Prices and stock are shown on each product page.`,
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
};

/** Prebuilt page, refreshed at most every 5 minutes (CMS saves also revalidate it). */
export const revalidate = 300;

export default async function HomePage() {
  const [topDeals, showcases, topCategories, heroSlides] = await Promise.all([
    getTopDeals(),
    getHomeShowcases(),
    getHomeTopCategories(),
    getHeroSlides(),
  ]);

  return (
    <div className="min-h-screen bg-muted">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
      />
      <main className="flex flex-col">
        <HeroSlider slides={heroSlides} />
        <CategoryGrid categories={topCategories} />
        <TopDeals products={topDeals} />
        <HomeShowcases sections={showcases} />
      </main>
    </div>
  );
}
