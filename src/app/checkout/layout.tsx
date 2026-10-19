import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  title: 'Checkout',
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
