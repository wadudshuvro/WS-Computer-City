import Image from 'next/image';
import Link from 'next/link';
import { Product, Brand, Category, ProductImage } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type ProductWithRelations = Product & {
  brand: Brand;
  category: Category;
  images: ProductImage[];
};

interface ProductCardProps {
  product: ProductWithRelations;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const discountPercentage = product.compareAtPrice
    ? Math.round(
        ((Number(product.compareAtPrice) - Number(product.price)) /
          Number(product.compareAtPrice)) *
          100
      )
    : 0;

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group relative overflow-hidden rounded-lg border bg-card p-4 transition-all hover:shadow-lg">
        {/* Stock Badge */}
        <div className="absolute right-2 top-2 z-10">
          {product.stockStatus === 'IN_STOCK' && (
            <Badge variant="success" className="bg-green-500">
              In Stock
            </Badge>
          )}
          {product.stockStatus === 'OUT_OF_STOCK' && (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
          {product.stockStatus === 'PRE_ORDER' && (
            <Badge variant="secondary" className="bg-blue-500">
              Pre-Order
            </Badge>
          )}
          {product.stockStatus === 'UPCOMING' && (
            <Badge variant="outline">Upcoming</Badge>
          )}
        </div>

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute left-2 top-2 z-10">
            <Badge variant="destructive" className="bg-red-500">
              -{discountPercentage}%
            </Badge>
          </div>
        )}

        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-md bg-gray-100">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              fill
              className="object-contain transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-4 space-y-2">
          {/* Brand */}
          <p className="text-xs text-muted-foreground">{product.brand.name}</p>

          {/* Product Name */}
          <h3 className="line-clamp-2 font-semibold text-sm leading-tight group-hover:text-primary">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">
              ৳{Number(product.price).toLocaleString('en-BD')}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ৳{Number(product.compareAtPrice).toLocaleString('en-BD')}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              disabled={product.stockStatus === 'OUT_OF_STOCK'}
            >
              {product.stockStatus === 'PRE_ORDER' ? 'Pre-Order' : 'Add to Cart'}
            </Button>
            <Button variant="outline" size="sm" className="aspect-square p-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </Button>
          </div>

          {/* SKU */}
          <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
        </div>
      </div>
    </Link>
  );
}
