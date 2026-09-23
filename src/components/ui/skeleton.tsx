'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  /** Seconds for one left-to-right shimmer pass. */
  duration?: number;
}

const SHIMMER_GRADIENT =
  'linear-gradient(90deg, #e5e7eb 20%, #f9fafb 45%, #ffffff 50%, #f9fafb 55%, #e5e7eb 80%)';

/**
 * Placeholder bone with the Motion demo shimmer:
 * a highlight wave that travels left → right on a looping gradient.
 */
export function Skeleton({ className, duration = 1.5 }: SkeletonProps) {
  return (
    <motion.div
      aria-hidden
      animate={{ backgroundPosition: ['-200% 0', '200% 0'] }}
      transition={{ duration, ease: 'easeInOut', repeat: Infinity }}
      className={cn('overflow-hidden rounded-md', className)}
      style={{
        backgroundImage: SHIMMER_GRADIENT,
        backgroundSize: '200% 100%',
        backgroundColor: '#e5e7eb',
      }}
    />
  );
}
