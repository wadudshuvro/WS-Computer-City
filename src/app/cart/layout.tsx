import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  title: 'Cart',
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
