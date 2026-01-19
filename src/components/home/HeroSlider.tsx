'use client';

import { useState, useEffect } from 'react';

const slides = [
  {
    id: 1,
    title: 'Free Delivery',
    subtitle: 'On All Orders',
    bgColor: 'from-blue-400 to-blue-600',
    image: '📦',
  },
  {
    id: 2,
    title: 'B2B Reseller',
    subtitle: 'Special Offers',
    bgColor: 'from-purple-400 to-purple-600',
    image: '🤝',
  },
  {
    id: 3,
    title: 'Latest Products',
    subtitle: 'Best Prices in Bangladesh',
    bgColor: 'from-orange-400 to-orange-600',
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
    <section className="relative bg-gray-100 overflow-hidden">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Hero Slider */}
          <div className="lg:col-span-2 relative h-[400px] rounded-2xl overflow-hidden">
            <div
              className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide) => (
                <div
                  key={slide.id}
                  className={`min-w-full h-full bg-gradient-to-r ${slide.bgColor} flex items-center justify-center text-white p-12`}
                >
                  <div className="text-center">
                    <div className="text-8xl mb-6">{slide.image}</div>
                    <h2 className="text-5xl font-bold mb-4">{slide.title}</h2>
                    <p className="text-2xl mb-8">{slide.subtitle}</p>
                    <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                      Shop Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            >
              ‹
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            >
              ›
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentSlide === index ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Side Banners */}
          <div className="space-y-6">
            {/* Branch Info */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white p-6 rounded-2xl h-[190px] flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-2">BANANI BRANCH</h3>
              <p className="text-sm mb-3">Concord Colosseum, 156 Kemal Ataturk Ave, Dhaka 1213, Dhaka.</p>
              <div className="flex gap-2 text-xs mb-3">
                <span>01324294311</span>
                <span>01322921936</span>
                <span>01701663681</span>
              </div>
              <button className="bg-orange-500 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-orange-600 transition-colors w-fit">
                GET DIRECTION
              </button>
            </div>

            {/* B2B Banner */}
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-6 rounded-2xl h-[190px] flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-2">FOR B2B / RESELLER</h3>
              <p className="text-sm mb-4">Special pricing for bulk orders</p>
              <button className="bg-orange-500 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-orange-600 transition-colors w-fit">
                CLICK HERE
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
