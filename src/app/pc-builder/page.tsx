import type { Metadata } from 'next';
import { Suspense } from 'react';
import PcBuilderClient from '@/components/pc-builder/PcBuilderClient';
import { siteName } from '@/lib/launch/site';

export const metadata: Metadata = {
  title: `PC Builder - Build Your Own Computer | ${siteName()}`,
  description:
    'Pick a CPU, motherboard, RAM, storage and more. Prices and estimated power add up as you build, and the parts shown always fit your CPU and motherboard.',
  alternates: { canonical: '/pc-builder' },
  robots: { index: true, follow: true },
};

export default function PcBuilderPage() {
  return (
    <Suspense fallback={null}>
      <PcBuilderClient />
    </Suspense>
  );
}
