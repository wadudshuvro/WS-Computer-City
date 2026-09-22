'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.getSubtotal());

  if (items.length === 0) {
    return (
      <div className="min-h-[50vh] bg-gray-50">
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
          <p className="mt-2 text-gray-600">Add products from the storefront to continue.</p>
          <Link
            href="/products?category=components"
            className="mt-6 inline-flex rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <nav className="mb-4 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Shopping Cart</span>
        </nav>

        <h1 className="mb-6 text-2xl font-bold text-gray-900">Shopping Cart</h1>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-100">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill className="object-contain p-1" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-gray-400">No image</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/products/${item.slug}`} className="font-medium text-gray-900 hover:text-blue-600">
                    {item.name}
                  </Link>
                  {item.variantLabel && (
                    <span className="mt-1 inline-block rounded bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">
                      {item.variantLabel}
                    </span>
                  )}
                  <p className="mt-1 text-sm text-gray-600">
                    ৳ {item.unitPrice.toLocaleString()} × {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-md border border-gray-300">
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-50"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-50"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="w-24 text-right font-semibold text-gray-900">
                    ৳ {(item.unitPrice * item.quantity).toLocaleString()}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Cart Summary</h2>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-gray-600">Sub-Total</span>
              <span className="font-medium">৳ {Math.round(subtotal).toLocaleString()}</span>
            </div>
            <div className="mb-4 flex justify-between border-t border-gray-100 pt-3 text-base font-bold">
              <span>Total</span>
              <span>৳ {Math.round(subtotal).toLocaleString()}</span>
            </div>
            <Link
              href="/checkout"
              className="flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Confirm Order
            </Link>
            <Link
              href="/products?category=components"
              className="mt-3 flex w-full items-center justify-center text-sm text-blue-600 hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
