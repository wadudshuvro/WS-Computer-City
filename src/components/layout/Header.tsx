import Link from 'next/link';
import { Heart, Scale, Search, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MegaMenu } from './MegaMenu';

export function Header() {
  return (
    <header className="relative z-[200] overflow-visible bg-sidebar text-sidebar-foreground">
      {/* Top bar — brand + utility actions */}
      <div className="border-b border-sidebar-border">
        <div className="container mx-auto flex items-center justify-between gap-3 py-2">
          <Link href="/" className="shrink-0">
            <span className="text-xl font-semibold tracking-tight text-white">
              LogicBay BD
            </span>
          </Link>

          <div className="hidden items-center gap-2 sm:flex">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 border-0 bg-sidebar-muted text-sidebar-foreground hover:bg-sidebar-muted/80 hover:text-white"
            >
              Offers
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 border-0 bg-sidebar-muted text-sidebar-foreground hover:bg-sidebar-muted/80 hover:text-white"
            >
              Tools
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 border-0 bg-sidebar-muted text-sidebar-foreground hover:bg-sidebar-muted/80 hover:text-white"
            >
              PC Builder
            </Button>
          </div>
        </div>
      </div>

      {/* Search row */}
      <div className="container mx-auto py-2.5">
        <div className="flex items-center gap-2 sm:gap-3">
          <select
            aria-label="Category"
            className="hidden h-9 min-w-[140px] shrink-0 rounded-md border-0 bg-sidebar-muted px-3 text-sm text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:block"
          >
            <option>All Category</option>
            <option>Laptop</option>
            <option>Desktop</option>
            <option>Components</option>
            <option>Accessories</option>
          </select>

          <div className="flex min-w-0 flex-1">
            <Input
              type="search"
              placeholder="Search products…"
              aria-label="Search products"
              className="h-9 rounded-r-none border-0 bg-white text-foreground shadow-none focus-visible:ring-offset-0"
            />
            <Button
              type="button"
              size="icon"
              className="h-9 w-9 shrink-0 rounded-l-none"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 text-sidebar-foreground hover:bg-sidebar-muted hover:text-white"
              aria-label="Cart"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="absolute right-1 top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-destructive px-0.5 text-[10px] font-medium text-destructive-foreground">
                0
              </span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="relative hidden h-9 w-9 text-sidebar-foreground hover:bg-sidebar-muted hover:text-white sm:inline-flex"
              aria-label="Wishlist"
            >
              <Heart className="h-4 w-4" />
              <span className="absolute right-1 top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-destructive px-0.5 text-[10px] font-medium text-destructive-foreground">
                0
              </span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="relative hidden h-9 w-9 text-sidebar-foreground hover:bg-sidebar-muted hover:text-white sm:inline-flex"
              aria-label="Compare"
            >
              <Scale className="h-4 w-4" />
              <span className="absolute right-1 top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-primary px-0.5 text-[10px] font-medium text-primary-foreground">
                0
              </span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-sidebar-foreground hover:bg-sidebar-muted hover:text-white"
              asChild
            >
              <Link href="/admin/login" aria-label="Account">
                <User className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <MegaMenu />
    </header>
  );
}
