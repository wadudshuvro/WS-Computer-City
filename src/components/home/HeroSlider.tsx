'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { HeroSlide } from '@/lib/homeHero';
import { ReportProblemCard } from '@/components/home/ReportProblemCard';

const AUTOPLAY_MS = 6000;

const THEMES: Record<HeroSlide['theme'], { bg: string; glow: string; accent: string; chip: string }> = {
  sky: {
    bg: 'from-[#07111f] via-[#0b2545] to-[#0e4a7a]',
    glow: 'bg-sky-400/30',
    accent: 'text-sky-300',
    chip: 'bg-sky-400/15 text-sky-200 ring-sky-300/30',
  },
  violet: {
    bg: 'from-[#12082b] via-[#2b1066] to-[#5b21b6]',
    glow: 'bg-fuchsia-400/25',
    accent: 'text-fuchsia-300',
    chip: 'bg-fuchsia-400/15 text-fuchsia-100 ring-fuchsia-300/30',
  },
  teal: {
    bg: 'from-[#031c1b] via-[#064643] to-[#0f766e]',
    glow: 'bg-emerald-300/25',
    accent: 'text-emerald-300',
    chip: 'bg-emerald-300/15 text-emerald-100 ring-emerald-200/30',
  },
  ember: {
    bg: 'from-[#240c0e] via-[#6b1d1d] to-[#b4400f]',
    glow: 'bg-orange-300/25',
    accent: 'text-orange-300',
    chip: 'bg-orange-300/15 text-orange-100 ring-orange-200/30',
  },
  indigo: {
    bg: 'from-[#0b1026] via-[#1b2250] to-[#3730a3]',
    glow: 'bg-indigo-300/25',
    accent: 'text-indigo-300',
    chip: 'bg-indigo-300/15 text-indigo-100 ring-indigo-200/30',
  },
};

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const go = useCallback((index: number) => setCurrent((index + count) % count), [count]);

  return (
    <section className="relative bg-muted">
      <div className="container mx-auto py-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-4">
          {count > 0 && (
            <div
              className="relative h-[520px] overflow-hidden rounded-2xl shadow-lg sm:h-[440px] lg:h-[380px]"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocusCapture={() => setPaused(true)}
              onBlurCapture={() => setPaused(false)}
              role="region"
              aria-roledescription="carousel"
              aria-label="Featured categories"
            >
              {slides.map((slide, index) => {
                const theme = THEMES[slide.theme];
                const active = index === current;
                return (
                  <div
                    key={slide.id}
                    aria-hidden={!active}
                    className={`absolute inset-0 bg-gradient-to-br ${theme.bg} transition-opacity duration-700 ${
                      active ? 'z-10 opacity-100' : 'pointer-events-none z-0 opacity-0'
                    }`}
                  >
                    {/* soft light + fine grid, no stock artwork */}
                    <div className={`absolute -right-10 top-0 h-80 w-80 rounded-full blur-3xl ${theme.glow}`} />
                    <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
                    <div
                      className="absolute inset-0 opacity-[0.07]"
                      style={{
                        backgroundImage:
                          'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                        backgroundSize: '44px 44px',
                      }}
                    />

                    <div className="relative flex h-full flex-col gap-4 p-5 sm:p-7 lg:flex-row lg:items-center lg:gap-6 lg:p-9">
                      <div
                        className={`max-w-md shrink-0 text-white transition-all duration-700 lg:w-[42%] ${
                          active ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                        }`}
                      >
                        <span className={`text-xs font-semibold uppercase tracking-[0.18em] ${theme.accent}`}>
                          {slide.eyebrow}
                        </span>
                        <h2 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-[2rem]">
                          {slide.title}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-white/75">{slide.blurb}</p>

                        <div className="mt-4 flex flex-wrap gap-2 text-xs">
                          <span className={`rounded-full px-3 py-1 font-medium ring-1 ${theme.chip}`}>
                            From {slide.fromPrice}
                          </span>
                          <span className={`rounded-full px-3 py-1 font-medium ring-1 ${theme.chip}`}>
                            {slide.inStock} in stock
                          </span>
                        </div>

                        <Link
                          href={slide.href}
                          tabIndex={active ? 0 : -1}
                          className="group mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-md transition hover:gap-3 hover:bg-orange-50"
                        >
                          {slide.cta}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </div>

                      {/* real products from this category */}
                      <div className="flex min-h-0 flex-1 items-center justify-center gap-3 sm:gap-4">
                        {slide.products.map((product, i) => (
                          <Link
                            key={product.href}
                            href={product.href}
                            tabIndex={active ? 0 : -1}
                            style={{ transitionDelay: active ? `${150 + i * 120}ms` : '0ms' }}
                            className={`group flex w-[31%] max-w-[200px] flex-col rounded-xl bg-white p-2.5 text-slate-900 shadow-xl ring-1 ring-black/5 transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl ${
                              active ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                            } ${i === 1 ? 'lg:-translate-y-4 lg:hover:-translate-y-6' : ''}`}
                          >
                            <span className="flex h-24 items-center justify-center overflow-hidden rounded-lg bg-slate-50 sm:h-32 lg:h-36">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                loading={index === 0 ? 'eager' : 'lazy'}
                                decoding="async"
                                className="max-h-full max-w-full object-contain p-1 transition-transform duration-300 group-hover:scale-105"
                              />
                            </span>
                            <span className="mt-2 line-clamp-2 min-h-[2rem] text-[11px] font-medium leading-snug sm:text-xs">
                              {product.name}
                            </span>
                            <span className="mt-1 flex items-baseline gap-1.5">
                              <span className="text-sm font-bold text-red-600">{product.price}</span>
                              {product.oldPrice && (
                                <span className="text-[10px] text-slate-400 line-through">{product.oldPrice}</span>
                              )}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}

              {count > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => go(current - 1)}
                    aria-label="Previous slide"
                    className="absolute right-14 top-3 z-20 hidden h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30 sm:flex"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(current + 1)}
                    aria-label="Next slide"
                    className="absolute right-4 top-3 z-20 hidden h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30 sm:flex"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  {/* category tabs with autoplay progress */}
                  <div className="absolute inset-x-0 bottom-0 z-20 flex gap-1.5 bg-gradient-to-t from-black/40 to-transparent px-4 pb-3 pt-6">
                    {slides.map((slide, index) => (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => go(index)}
                        aria-label={`Show ${slide.eyebrow}`}
                        aria-current={index === current}
                        className="group min-w-0 flex-1 text-left"
                      >
                        <span className="block h-1 overflow-hidden rounded-full bg-white/25">
                          <span
                            key={`${index === current}-${current}`}
                            className="block h-full rounded-full bg-white"
                            onAnimationEnd={() => go(current + 1)}
                            style={
                              index === current
                                ? {
                                    animation: `hero-progress ${AUTOPLAY_MS}ms linear forwards`,
                                    animationPlayState: paused ? 'paused' : 'running',
                                  }
                                : { width: index < current ? '100%' : '0%' }
                            }
                          />
                        </span>
                        <span
                          className={`mt-1.5 hidden truncate text-[11px] font-medium transition-colors sm:block ${
                            index === current ? 'text-white' : 'text-white/60 group-hover:text-white/90'
                          }`}
                        >
                          {slide.eyebrow}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <ReportProblemCard className="lg:h-[380px]" />
        </div>
      </div>

    </section>
  );
}
