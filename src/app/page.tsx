import { HeroSlider } from '@/components/home/HeroSlider';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FlashSale } from '@/components/home/FlashSale';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <HeroSlider />
        <CategoryGrid />
        <FlashSale />
      </main>
    </div>
  );
}
