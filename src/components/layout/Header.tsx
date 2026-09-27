import Link from 'next/link';
import { Gift, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SHOW_LIVE_LOGO, TEST_LOGO_TEXT } from '@/lib/brandDisplay';
import { MegaMenu } from './MegaMenu';
import { HeaderCartButton } from './HeaderCartButton';

export function Header() {
  return (
    <>
    <header className="relative z-[190] overflow-visible bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto px-4">
        <div className="flex h-[72px] items-center gap-4 lg:gap-8">
          <Link href="/" className="shrink-0">
            {SHOW_LIVE_LOGO ? (
              <img
                src="/logo-white.png"
                alt="LogicBay BD"
                className="h-[44px] w-auto"
              />
            ) : (
              <span className="whitespace-nowrap text-base font-medium text-white">
                {TEST_LOGO_TEXT}
              </span>
            )}
          </Link>

          <div className="flex min-w-0 flex-1">
            <Input
              type="search"
              placeholder="Search"
              aria-label="Search products"
              className="h-10 rounded-l-full rounded-r-none border-0 bg-white px-5 text-foreground shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-10 w-11 shrink-0 rounded-l-none rounded-r-full border-0 bg-white text-gray-500 hover:bg-white hover:text-gray-800"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <nav className="hidden shrink-0 items-center gap-5 lg:flex">
            <Link
              href="/products?category=components"
              className="flex items-center gap-2 text-sidebar-foreground hover:text-white"
            >
              <Gift className="h-5 w-5 shrink-0" />
              <span className="leading-tight">
                <span className="block text-sm font-medium">Offers</span>
                <span className="block text-[11px] text-sidebar-foreground/70">
                  Latest Offers
                </span>
              </span>
            </Link>

            <Link
              href="/admin/login"
              className="flex items-center gap-2 text-sidebar-foreground hover:text-white"
            >
              <User className="h-5 w-5 shrink-0" />
              <span className="leading-tight">
                <span className="block text-sm font-medium">Account</span>
                <span className="block text-[11px] text-sidebar-foreground/70">
                  Register or Login
                </span>
              </span>
            </Link>

            <HeaderCartButton />

            <Link
              href="/products?category=components"
              className="inline-flex h-9 items-center rounded-full bg-white px-4 text-sm font-semibold text-gray-900 hover:bg-gray-100"
            >
              PC Builder
            </Link>
          </nav>

          <div className="flex shrink-0 items-center gap-1 lg:hidden">
            <HeaderCartButton />
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

    </header>
    <MegaMenu />
    </>
  );
}
