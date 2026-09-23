import { Skeleton } from '@/components/ui/skeleton';

/** Matches the PDP layout: breadcrumb, related rail, gallery + buy box, spec panels. */
export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50" aria-busy="true" aria-label="Loading product details">
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center gap-2 px-4 py-3">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-6">
        <div className="flex gap-6">
          <div className="hidden w-[220px] flex-shrink-0 space-y-4 xl:block">
            <Skeleton className="h-5 w-32" />
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-16 w-16 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex-1 space-y-6">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <div className="p-6">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                  <div>
                    <Skeleton className="mb-4 aspect-square w-full rounded-lg" />
                    <div className="flex gap-2">
                      <Skeleton className="h-16 w-16" />
                      <Skeleton className="h-16 w-16" />
                      <Skeleton className="h-16 w-16" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Skeleton className="h-7 w-11/12" />
                    <Skeleton className="h-7 w-2/3" />
                    <div className="grid grid-cols-2 gap-2">
                      <Skeleton className="h-10" />
                      <Skeleton className="h-10" />
                      <Skeleton className="h-10" />
                      <Skeleton className="h-10" />
                    </div>
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-4 w-28" />
                    <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-24" />
                      <Skeleton className="h-24" />
                    </div>
                    <div className="flex gap-3">
                      <Skeleton className="h-12 w-24" />
                      <Skeleton className="h-12 flex-1" />
                      <Skeleton className="h-12 w-28" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <Skeleton className="h-10 w-full rounded-none" />
              <div className="space-y-3 p-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <Skeleton className="h-10 w-full rounded-none" />
              <div className="divide-y divide-gray-100">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="flex justify-between gap-4 px-4 py-3">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
