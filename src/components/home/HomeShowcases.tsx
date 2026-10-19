'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { HomeShowcase, ShowcaseProduct } from '@/lib/homeShowcases';

function ProductCard({ product }: { product: ShowcaseProduct }) {
  return (
    <article className="flex h-[340px] w-[240px] shrink-0 flex-col rounded-2xl bg-white p-4 text-gray-900">
      <Link href={`/products/${product.slug}`} className="flex h-full flex-col">
        <div className="mb-4 flex h-44 items-center justify-center">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} loading="lazy" decoding="async" className="max-h-44 max-w-full object-contain" />
          ) : null}
        </div>
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm leading-snug">{product.name}</h3>
        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <p className="text-xl font-semibold">৳{product.price.toLocaleString()}</p>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
            <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </article>
  );
}

function ShowcaseRow({ section }: { section: HomeShowcase }) {
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const blockClick = useRef(false);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !scroller.current) return;
    drag.current = { x: event.clientX, left: scroller.current.scrollLeft };
    blockClick.current = false;
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = scroller.current;
    const start = drag.current;
    if (!node || !start) return;
    const delta = event.clientX - start.x;
    if (Math.abs(delta) <= 5) return;
    blockClick.current = true;
    node.scrollLeft = start.left - delta;
  };

  return (
    <section className="overflow-hidden rounded-[28px] bg-[#111111] px-6 py-6 text-white">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="flex w-full shrink-0 flex-col justify-between lg:w-[280px] lg:self-stretch">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white">{section.eyebrow}</p>
            <h2 className="mt-3 whitespace-pre-line text-4xl font-semibold leading-[1.05] tracking-tight text-white">
              {section.title}
            </h2>
            <p className="mt-3 max-w-[260px] text-sm leading-relaxed text-white">{section.description}</p>
            <Link href={section.href} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-white">
              {section.linkLabel}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <Link href={section.href} className="mt-6 block overflow-hidden rounded-2xl">
            <img src={section.image} alt="" loading="lazy" decoding="async" className="h-36 w-full object-cover" />
          </Link>
        </div>

        <div className="relative min-w-0 flex-1">
          <div
            ref={scroller}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={() => {
              drag.current = null;
            }}
            onPointerCancel={() => {
              drag.current = null;
            }}
            onClickCapture={(event) => {
              if (!blockClick.current) return;
              event.preventDefault();
              event.stopPropagation();
              blockClick.current = false;
            }}
            className="flex cursor-grab items-center gap-3 overflow-x-auto py-1 pr-12 [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
          >
            {section.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <button
            type="button"
            aria-label={`See more ${section.eyebrow}`}
            onClick={() => scroller.current?.scrollBy({ left: 500, behavior: 'smooth' })}
            className="absolute right-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-900 shadow-md"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

export function HomeShowcases({ sections }: { sections: HomeShowcase[] }) {
  if (sections.length === 0) return null;
  return (
    <div className="bg-[#f3f4f6] py-6">
      <div className="container mx-auto flex flex-col gap-6 px-4">
        {sections.map((section) => (
          <ShowcaseRow key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}
