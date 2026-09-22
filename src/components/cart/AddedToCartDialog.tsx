'use client';

import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCartStore } from '@/store/cartStore';

interface AddedToCartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
}

export function AddedToCartDialog({ open, onOpenChange, productName }: AddedToCartDialogProps) {
  const itemCount = useCartStore((s) => s.getItemCount());
  const subtotal = useCartStore((s) => s.getSubtotal());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 sm:rounded-lg">
        <div className="p-5 sm:p-6">
          <DialogTitle className="sr-only">Added to shopping cart</DialogTitle>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-7 w-7 shrink-0 text-green-600" />
              <p className="text-sm leading-relaxed text-gray-800 sm:text-base">
                You have added{' '}
                <span className="font-semibold text-orange-600">{productName}</span> to your
                shopping cart!
              </p>
            </div>

            <div className="w-full shrink-0 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm sm:w-44">
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">Cart quantity:</span>
                <span className="font-medium text-gray-900">{itemCount}</span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-gray-600">Cart Total:</span>
                <span className="font-bold text-gray-900">{Math.round(subtotal).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/checkout"
              onClick={() => onOpenChange(false)}
              className="inline-flex items-center justify-center rounded-md border-2 border-blue-600 bg-white px-5 py-2.5 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50"
            >
              Confirm Order
            </Link>
            <Link
              href="/cart"
              onClick={() => onOpenChange(false)}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              View Cart
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
