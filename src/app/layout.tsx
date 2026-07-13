import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { StorefrontChrome } from '@/components/layout/StorefrontChrome';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WS Computer City - Computer Hardware E-commerce',
  description: 'Buy computer hardware and components at the best prices in Bangladesh',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <StorefrontChrome>{children}</StorefrontChrome>
      </body>
    </html>
  );
}
