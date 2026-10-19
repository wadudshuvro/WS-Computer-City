import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import PcChooserClient from '@/components/pc-builder/PcChooserClient';
import { siteName } from '@/lib/launch/site';
import { isSlotId, SLOT_BY_ID } from '@/lib/pcBuilder/slots';

type PageProps = { params: Promise<{ slot: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slot } = await params;
  if (!isSlotId(slot)) return {};
  return {
    title: `Choose a ${SLOT_BY_ID[slot].noun} | PC Builder | ${siteName()}`,
    robots: { index: false, follow: true },
  };
}

export default async function PcChooserPage({ params }: PageProps) {
  const { slot } = await params;
  if (!isSlotId(slot)) notFound();
  return (
    <Suspense fallback={null}>
      <PcChooserClient slotId={slot} />
    </Suspense>
  );
}
