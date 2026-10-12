'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { TopDealCard } from '@/components/home/TopDealCard';
import type { TopDealProduct } from '@/lib/topDealTypes';

export function TopDeals({ products }: { products: TopDealProduct[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const blockClick = useRef(false);
  const [progress, setProgress] = useState(0);
  const [max, setMax] = useState(0);
  const [dragging, setDragging] = useState(false);

  const sync = () => {
    const node = scroller.current;
    if (!node) return;
    setMax(Math.max(0, node.scrollWidth - node.clientWidth));
    setProgress(node.scrollLeft);
  };

  useEffect(() => {
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, [products.length]);

  const scrollNext = () => {
    const node = scroller.current;
    if (!node) return;
    node.scrollBy({ left: node.clientWidth * 0.8, behavior: 'smooth' });
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const node = scroller.current;
    if (!node) return;
    drag.current = { x: event.clientX, left: node.scrollLeft };
    blockClick.current = false;
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = scroller.current;
    const start = drag.current;
    if (!node || !start) return;
    const delta = event.clientX - start.x;
    if (Math.abs(delta) <= 5) return;
    blockClick.current = true;
    if (!dragging) {
      setDragging(true);
      node.setPointerCapture(event.pointerId);
    }
    node.scrollLeft = start.left - delta;
  };

  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  if (products.length === 0) return null;

  return (
    <section className="bg-muted py-4">
      <div className="container mx-auto px-4">
        <div className="flex overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex w-[148px] shrink-0 flex-col justify-between bg-gradient-to-b from-[#0b5ed7] to-[#1aa3d8] p-4 sm:w-[180px]">
            <p className="text-[2rem] font-black leading-[0.9] tracking-tight text-[#ffe14a] sm:text-5xl">
              TOP
              <br />
              DEALS
            </p>
            <Link
              href="/deals"
              className="mt-6 rounded-full bg-white px-3 py-2 text-center text-xs font-semibold text-gray-900 hover:bg-gray-100 sm:text-sm"
            >
              See all Top Deals
            </Link>
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="relative min-w-0">
              <div
                ref={scroller}
                onScroll={sync}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onClickCapture={(event) => {
                  if (!blockClick.current) return;
                  event.preventDefault();
                  event.stopPropagation();
                  blockClick.current = false;
                }}
                className={`flex gap-3 overflow-x-auto px-3 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                  dragging ? 'cursor-grabbing select-none' : 'cursor-grab'
                }`}
              >
                {products.map((product) => (
                  <TopDealCard key={product.id} product={product} />
                ))}
              </div>
              {max > 0 && (
                <button
                  type="button"
                  onClick={scrollNext}
                  aria-label="See more deals"
                  className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md hover:bg-gray-50"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>
              )}
            </div>
            {max > 0 && (
              <div className="px-4 pb-3">
                <input
                  type="range"
                  min={0}
                  max={max}
                  value={Math.min(progress, max)}
                  onChange={(event) => {
                    const node = scroller.current;
                    if (!node) return;
                    node.scrollLeft = Number(event.target.value);
                  }}
                  aria-label="Top deals position"
                  aria-valuemin={0}
                  aria-valuemax={max}
                  aria-valuenow={Math.round(progress)}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-[#0b5ed7]"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
