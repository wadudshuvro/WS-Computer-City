import { Skeleton } from '@/components/ui/skeleton';

interface ProductCardSkeletonProps {
  viewMode?: 'grid' | 'list';
}

/** Matches the category listing ProductCard (image, title, specs, price, CTAs). */
export function ProductCardSkeleton({ viewMode = 'grid' }: ProductCardSkeletonProps) {
  if (viewMode === 'list') {
    return (
      <div className="flex overflow-hidden rounded-lg border border-gray-200 bg-white">
        <Skeleton className="h-48 w-48 flex-shrink-0 rounded-none" />
        <div className="flex flex-1 flex-col justify-between p-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="mt-2 h-5 w-16" />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Skeleton className="h-7 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden border border-gray-200 bg-white">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-1 flex-col space-y-2.5 p-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="space-y-1.5 pt-1">
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-3/4" />
        </div>
        <Skeleton className="mt-2 h-6 w-24" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
        </div>
      </div>
    </div>
  );
}

interface ProductGridSkeletonProps {
  viewMode?: 'grid' | 'list';
  count?: number;
}

export function ProductGridSkeleton({ viewMode = 'grid', count = 8 }: ProductGridSkeletonProps) {
  return (
    <div
      className={`grid gap-4 ${
        viewMode === 'grid'
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'grid-cols-1'
      }`}
      aria-busy="true"
      aria-label="Loading products"
    >
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} viewMode={viewMode} />
      ))}
    </div>
  );
}
