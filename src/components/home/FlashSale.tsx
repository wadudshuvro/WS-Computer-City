import Link from 'next/link';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function FlashSale() {
  return (
    <section className="bg-background py-4">
      <div className="container mx-auto">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-1.5 text-base font-semibold leading-snug text-foreground">
            <Zap className="h-4 w-4 text-destructive" aria-hidden />
            Flash Sale
          </h2>
          <div className="flex items-center gap-1">
            <Button type="button" variant="outline" size="icon" className="h-8 w-8" aria-label="Previous">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button type="button" variant="outline" size="icon" className="h-8 w-8" aria-label="Next">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <Card key={item} className="overflow-hidden transition-shadow hover:shadow-md">
              <CardContent className="p-3">
                <div className="mb-2 flex aspect-square items-center justify-center rounded-md bg-muted text-3xl">
                  🖥️
                </div>
                <h3 className="mb-1.5 line-clamp-2 text-sm font-medium leading-snug text-foreground">
                  Product Name Here
                </h3>
                <div className="mb-1 flex items-baseline gap-2">
                  <span className="text-base font-bold text-destructive">৳25,000</span>
                  <span className="text-xs text-muted-foreground line-through">৳30,000</span>
                </div>
                <p className="text-xs text-muted-foreground">★★★★★ (12)</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-4 flex justify-center">
          <Button asChild size="default">
            <Link href="/products">View all products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
