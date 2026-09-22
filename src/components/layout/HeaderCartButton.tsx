'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';

export function HeaderCartButton() {
  const itemCount = useCartStore((s) => s.getItemCount());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = mounted ? itemCount : 0;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="relative h-9 w-9 text-sidebar-foreground hover:bg-sidebar-muted hover:text-white"
      asChild
    >
      <Link href="/cart" aria-label={`Cart, ${count} items`}>
        <ShoppingCart className="h-4 w-4" />
        <span className="absolute right-1 top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-destructive px-0.5 text-[10px] font-medium text-destructive-foreground">
          {count}
        </span>
      </Link>
    </Button>
  );
}
