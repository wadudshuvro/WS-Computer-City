import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { StorefrontChrome } from '@/components/layout/StorefrontChrome';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  title: {
    default: 'LogicBay BD - Computer Hardware E-commerce',
    template: '%s',
  },
  description: 'Buy computer hardware and components at the best prices in Bangladesh',
  openGraph: {
    siteName: process.env.NEXT_PUBLIC_APP_NAME || 'LogicBay BD',
    locale: 'en_BD',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} font-sans`} suppressHydrationWarning>
        <StorefrontChrome>{children}</StorefrontChrome>
      </body>
    </html>
  );
}
