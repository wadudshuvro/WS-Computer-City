'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const slides = [
  {
    id: 1,
    title: 'Free Delivery',
    subtitle: 'On all orders',
    bgColor: 'from-slate-800 via-[#1e2636] to-[#1a1f2e]',
    image: '📦',
  },
  {
    id: 2,
    title: 'B2B Reseller',
    subtitle: 'Special offers',
    bgColor: 'from-teal-700 via-teal-800 to-[#1a1f2e]',
    image: '🤝',
  },
  {
    id: 3,
    title: 'Latest Products',
    subtitle: 'Best prices in Bangladesh',
    bgColor: 'from-cyan-700 via-sky-800 to-[#152238]',
    image: '💰',
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative overflow-hidden bg-muted">
      <div className="container mx-auto py-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
          {/* Main hero */}
          <div className="relative h-[260px] overflow-hidden rounded-lg sm:h-[280px] lg:col-span-2">
            <div
              className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide) => (
                <div
                  key={slide.id}
                  className={`flex min-w-full items-center justify-center bg-gradient-to-r p-6 text-white ${slide.bgColor}`}
                >
                  <div className="max-w-md text-center">
                    <div className="mb-3 text-4xl" aria-hidden>
                      {slide.image}
                    </div>
                    <h2 className="mb-1 text-2xl font-semibold leading-snug tracking-tight">
                      {slide.title}
                    </h2>
                    <p className="mb-4 text-sm text-white/85">{slide.subtitle}</p>
                    <Button
                      type="button"
                      variant="secondary"
                      size="default"
                      className="bg-white text-sidebar hover:bg-white/90"
                    >
                      Shop Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 h-8 w-8 -translate-y-1/2 bg-white/90 text-foreground hover:bg-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 h-8 w-8 -translate-y-1/2 bg-white/90 text-foreground hover:bg-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    currentSlide === index ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Side panels */}
          <div className="flex flex-col gap-3">
            <Card className="flex flex-1 flex-col justify-center border-0 bg-gradient-to-br from-[#2d3548] to-sidebar text-white shadow-none">
              <CardContent className="p-4">
                <h3 className="mb-1 text-base font-semibold leading-snug">Banani Branch</h3>
                <p className="mb-2 text-xs leading-relaxed text-white/75">
                  Concord Colosseum, 156 Kemal Ataturk Ave, Dhaka 1213
                </p>
                <p className="mb-3 text-xs text-white/70">
                  01324294311 · 01322921936 · 01701663681
                </p>
                <Button
                  type="button"
                  size="sm"
                  className="h-8 bg-teal-600 text-white hover:bg-teal-700"
                >
                  Get direction
                </Button>
              </CardContent>
            </Card>

            <Card className="flex flex-1 flex-col justify-center border-0 bg-gradient-to-br from-teal-700 to-sidebar text-white shadow-none">
              <CardContent className="p-4">
                <h3 className="mb-1 text-base font-semibold leading-snug">B2B / Reseller</h3>
                <p className="mb-3 text-xs leading-relaxed text-white/80">
                  Special pricing for bulk orders
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                >
                  Learn more
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
