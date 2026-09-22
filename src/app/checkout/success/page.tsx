'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CheckCircle2 } from 'lucide-react';

function SuccessContent() {
  const params = useSearchParams();
  const orderNumber = params.get('order');

  return (
    <div className="min-h-[50vh] bg-gray-50">
      <div className="container mx-auto max-w-lg px-4 py-16 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-green-600" />
        <h1 className="text-2xl font-bold text-gray-900">Order placed successfully</h1>
        {orderNumber && (
          <p className="mt-2 text-gray-700">
            Order number:{' '}
            <span className="font-semibold text-blue-700">{orderNumber}</span>
          </p>
        )}
        <p className="mt-3 text-sm text-gray-600">
          Our team has received your order and will contact you on the mobile number you provided.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/products"
            className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-gray-500">Loading…</div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
