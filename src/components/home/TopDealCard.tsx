'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { topDealDisplay, type TopDealProduct } from '@/lib/topDealTypes';

export function TopDealCard({ product }: { product: TopDealProduct }) {
  const [saved, setSaved] = useState(false);
  const prices = topDealDisplay(product);

  return (
    <article className="relative flex w-[168px] shrink-0 flex-col rounded-xl border border-gray-200 bg-white p-3">
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className="rounded-md bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700">
          Save ৳{prices.save.toLocaleString()}
        </span>
        <button
          type="button"
          aria-label={saved ? 'Remove from saved' : 'Save product'}
          aria-pressed={saved}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setSaved((current) => !current);
          }}
          className="rounded-full p-1 text-gray-500 hover:text-red-500"
        >
          <Heart className={`h-4 w-4 ${saved ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>
      <Link href={`/products/${product.slug}`} className="flex flex-1 flex-col">
        <div className="mb-2 flex h-28 items-center justify-center">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt="" className="max-h-28 max-w-full object-contain" />
          ) : (
            <span className="text-xs text-gray-400">No image</span>
          )}
        </div>
        <h3 className="mb-2 line-clamp-2 min-h-[2.5rem] text-xs leading-snug text-gray-800">{product.name}</h3>
        <p className="text-sm font-bold text-gray-900">৳{prices.current.toLocaleString()}</p>
        <p className="text-xs text-gray-400 line-through">৳{prices.previous.toLocaleString()}</p>
      </Link>
    </article>
  );
}
