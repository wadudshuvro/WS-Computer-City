import { ProductService } from '@/services/product.service';
import { prisma } from '@/lib/prisma';

export type CatalogProductCard = {
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  stockStatus: string;
  brand: string | null;
  category: string | null;
  imageUrl: string | null;
  url: string;
  keySpecs?: Record<string, string>;
};

function toNumber(value: unknown): number {
  if (value == null) return 0;
  if (typeof value === 'number') return value;
  return Number(value);
}

function mapListProduct(product: {
  slug: string;
  name: string;
  price: unknown;
  compareAtPrice?: unknown;
  stockStatus: string;
  brand?: { name: string } | null;
  category?: { name: string } | null;
  images?: Array<{ url: string }>;
}): CatalogProductCard {
  return {
    slug: product.slug,
    name: product.name,
    price: toNumber(product.price),
    compareAtPrice: product.compareAtPrice != null ? toNumber(product.compareAtPrice) : null,
    stockStatus: product.stockStatus,
    brand: product.brand?.name ?? null,
    category: product.category?.name ?? null,
    imageUrl: product.images?.[0]?.url ?? null,
    url: `/products/${product.slug}`,
  };
}

export async function searchProducts(args: {
  query?: string;
  category?: string;
  brand?: string;
  maxPrice?: number;
  minPrice?: number;
  limit?: number;
}): Promise<{ products: CatalogProductCard[]; total: number }> {
  const limit = Math.min(Math.max(args.limit ?? 5, 1), 5);

  const result = await ProductService.getFiltered({
    search: args.query?.trim() || undefined,
    category: args.category?.trim() || undefined,
    brand: args.brand?.trim() || undefined,
    maxPrice: args.maxPrice,
    minPrice: args.minPrice,
    page: 1,
    limit,
    sort: 'newest',
  });

  return {
    products: result.products.map(mapListProduct),
    total: result.pagination.total,
  };
}

export async function getProduct(args: {
  slug: string;
}): Promise<CatalogProductCard | { error: string }> {
  const slug = args.slug?.trim();
  if (!slug) {
    return { error: 'slug is required' };
  }

  const product = await ProductService.getBySlug(slug);
  if (!product || !product.isActive) {
    return { error: `No active product found for slug "${slug}"` };
  }

  const keySpecs: Record<string, string> = {};
  for (const row of product.specifications ?? []) {
    const key = row.specificationDefinition?.key;
    const name = row.specificationDefinition?.name ?? key;
    if (!key || !row.value) continue;
    // Prefer warranty + a handful of useful specs for the model
    if (
      key === 'warranty' ||
      Object.keys(keySpecs).length < 8
    ) {
      keySpecs[name || key] = row.value;
    }
  }

  return {
    slug: product.slug,
    name: product.name,
    price: toNumber(product.price),
    compareAtPrice: product.compareAtPrice != null ? toNumber(product.compareAtPrice) : null,
    stockStatus: product.stockStatus,
    brand: product.brand?.name ?? null,
    category: product.category?.name ?? null,
    imageUrl: product.images?.[0]?.url ?? null,
    url: `/products/${product.slug}`,
    keySpecs,
  };
}

export async function listCategories(): Promise<
  Array<{ name: string; slug: string; level: number; parentSlug: string | null }>
> {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: {
      name: true,
      slug: true,
      level: true,
      parent: { select: { slug: true } },
    },
    orderBy: [{ level: 'asc' }, { name: 'asc' }],
    take: 80,
  });

  return categories.map((c) => ({
    name: c.name,
    slug: c.slug,
    level: c.level,
    parentSlug: c.parent?.slug ?? null,
  }));
}

export const CATALOG_TOOL_DECLARATIONS = [
  {
    name: 'search_products',
    description:
      'Search LogicBay BD catalog by text, optional category slug, brand slug, and price range. Returns up to 5 in-stock-preferable product cards.',
    parameters: {
      type: 'OBJECT' as const,
      properties: {
        query: {
          type: 'STRING' as const,
          description: 'Search text e.g. Ryzen 5, RTX 4060, motherboard',
        },
        category: {
          type: 'STRING' as const,
          description: 'Category slug if known e.g. processors, graphics-card',
        },
        brand: {
          type: 'STRING' as const,
          description: 'Brand slug if known e.g. amd, intel, asus',
        },
        maxPrice: {
          type: 'NUMBER' as const,
          description: 'Maximum price in BDT',
        },
        minPrice: {
          type: 'NUMBER' as const,
          description: 'Minimum price in BDT',
        },
        limit: {
          type: 'NUMBER' as const,
          description: 'Max results 1-5 (default 5)',
        },
      },
    },
  },
  {
    name: 'get_product',
    description:
      'Get one product by URL slug with price, stock, brand, category, and key specifications including warranty.',
    parameters: {
      type: 'OBJECT' as const,
      properties: {
        slug: {
          type: 'STRING' as const,
          description: 'Product slug from the catalog URL',
        },
      },
      required: ['slug'] as string[],
    },
  },
  {
    name: 'list_categories',
    description: 'List active category names and slugs to route shopper questions.',
    parameters: {
      type: 'OBJECT' as const,
      properties: {} as Record<string, { type: 'STRING' | 'NUMBER' | 'OBJECT'; description?: string }>,
    },
  },
];

export async function runCatalogTool(
  name: string,
  argsJson: string
): Promise<{ result: unknown; products: CatalogProductCard[] }> {
  let args: Record<string, unknown> = {};
  try {
    args = argsJson ? (JSON.parse(argsJson) as Record<string, unknown>) : {};
  } catch {
    return { result: { error: 'Invalid tool arguments JSON' }, products: [] };
  }

  if (name === 'search_products') {
    const data = await searchProducts({
      query: typeof args.query === 'string' ? args.query : undefined,
      category: typeof args.category === 'string' ? args.category : undefined,
      brand: typeof args.brand === 'string' ? args.brand : undefined,
      maxPrice: typeof args.maxPrice === 'number' ? args.maxPrice : undefined,
      minPrice: typeof args.minPrice === 'number' ? args.minPrice : undefined,
      limit: typeof args.limit === 'number' ? args.limit : undefined,
    });
    return { result: data, products: data.products };
  }

  if (name === 'get_product') {
    const data = await getProduct({
      slug: typeof args.slug === 'string' ? args.slug : '',
    });
    const products = 'error' in data ? [] : [data];
    return { result: data, products };
  }

  if (name === 'list_categories') {
    const data = await listCategories();
    return { result: { categories: data }, products: [] };
  }

  return { result: { error: `Unknown tool: ${name}` }, products: [] };
}
