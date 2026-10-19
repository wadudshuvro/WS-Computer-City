import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { tokenize } from '@/lib/search/text';
import {
  estimateWatts,
  normalizeSocket,
  parseCpuMakers,
  parseMemoryTypes,
  socketVariants,
  type BuilderProduct,
  type CpuMaker,
} from '@/lib/pcBuilder/compat';
import { SLOT_BY_ID, slotForCategory, type SlotDef } from '@/lib/pcBuilder/slots';

export const CHOOSER_PAGE_SIZE = 20;

export type ChooserParams = {
  slot: SlotDef;
  q: string;
  brands: string[];
  min: number | null;
  max: number | null;
  facets: Record<string, string[]>;
  sort: 'price_asc' | 'price_desc';
  page: number;
  socket: string | null;
  memoryTypes: string[];
  maker: CpuMaker | null;
};

export type ChooserResult = {
  products: BuilderProduct[];
  total: number;
  page: number;
  pages: number;
  brands: { slug: string; name: string; count: number }[];
  facets: { key: string; label: string; options: { value: string; count: number }[] }[];
  priceBounds: { min: number; max: number } | null;
};

const SPEC_KEYS = [
  'socket_type',
  'cpu_socket',
  'supported_cpu',
  'tdp',
  'memory_type',
  'recommended_psu',
  'processor_type',
];

const contains = (value: string) => ({ contains: value, mode: 'insensitive' as const });
const specContains = (key: string, value: string): Prisma.ProductWhereInput => ({
  specifications: { some: { specificationDefinition: { key }, value: contains(value) } },
});

function sourceWhere(slot: SlotDef): Prisma.ProductWhereInput {
  return {
    OR: slot.sources.map((source) => ({
      category: { slug: { in: source.categories } },
      ...(source.nameAny ? { OR: source.nameAny.map((word) => ({ name: contains(word) })) } : {}),
    })),
  };
}

type Skip = { brand?: boolean; price?: boolean; facet?: string };

function buildWhere(p: ChooserParams, skip: Skip = {}): Prisma.ProductWhereInput {
  const and: Prisma.ProductWhereInput[] = [sourceWhere(p.slot)];

  if (p.socket && p.slot.id === 'cpu') {
    and.push({ OR: socketVariants(p.socket).map((v) => specContains('socket_type', v)) });
  }
  if (p.socket && p.slot.id === 'motherboard') {
    and.push({
      OR: socketVariants(p.socket).flatMap((v) => [
        specContains('supported_cpu', v),
        specContains('cpu_socket', v),
        { name: contains(v) },
      ]),
    });
  }
  if (p.memoryTypes.length > 0 && p.slot.id === 'ram') {
    and.push({ OR: p.memoryTypes.map((t) => specContains('memory_type', t)) });
  }
  if (p.memoryTypes.length > 0 && p.slot.id === 'motherboard') {
    and.push({
      OR: p.memoryTypes.flatMap((t) => [specContains('memory_type', t), { name: contains(t) }]),
    });
  }
  if (p.maker && p.slot.id === 'cpu-cooler') {
    and.push({
      OR: [
        specContains('processor_type', p.maker),
        { specifications: { none: { specificationDefinition: { key: 'processor_type' } } } },
      ],
    });
  }

  for (const token of tokenize(p.q)) {
    and.push({ OR: [{ name: contains(token) }, { sku: contains(token) }, { brand: { name: contains(token) } }] });
  }
  if (!skip.brand && p.brands.length > 0) and.push({ brand: { slug: { in: p.brands } } });
  if (!skip.price && (p.min != null || p.max != null)) {
    and.push({
      price: {
        ...(p.min != null ? { gte: p.min } : {}),
        ...(p.max != null ? { lte: p.max } : {}),
      },
    });
  }
  for (const facet of p.slot.facets) {
    const values = p.facets[facet.key];
    if (skip.facet === facet.key || !values?.length) continue;
    and.push({
      specifications: { some: { specificationDefinition: { key: facet.key }, value: { in: values } } },
    });
  }

  return { isActive: true, stockStatus: 'IN_STOCK', AND: and };
}

const productInclude = {
  brand: { select: { name: true } },
  category: { select: { slug: true } },
  images: { orderBy: [{ isPrimary: 'desc' as const }, { order: 'asc' as const }], take: 1 },
  specifications: {
    where: { specificationDefinition: { key: { in: SPEC_KEYS } } },
    select: { value: true, specificationDefinition: { select: { key: true } } },
  },
} satisfies Prisma.ProductInclude;

type Row = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

function toBuilderProduct(row: Row, fallbackSlotId?: SlotDef['id']): BuilderProduct | null {
  const slotId = fallbackSlotId ?? slotForCategory(row.category.slug, row.name);
  if (!slotId) return null;
  const spec = (key: string) => row.specifications.find((s) => s.specificationDefinition.key === key)?.value ?? null;

  const isBoard = slotId === 'motherboard';
  const socket =
    slotId === 'cpu'
      ? normalizeSocket(spec('socket_type')) ?? normalizeSocket(row.name)
      : isBoard
        ? normalizeSocket(spec('cpu_socket')) ?? normalizeSocket(spec('supported_cpu')) ?? normalizeSocket(row.name)
        : null;
  const memoryTypes =
    slotId === 'ram'
      ? parseMemoryTypes(spec('memory_type'), row.name)
      : isBoard || slotId === 'cpu'
        ? parseMemoryTypes(spec('memory_type'), isBoard ? row.name : null)
        : [];
  const makers =
    slotId === 'cpu'
      ? (row.category.slug === 'intel' ? ['intel'] : row.category.slug === 'amd' ? ['amd'] : parseCpuMakers(row.name))
      : slotId === 'cpu-cooler'
        ? parseCpuMakers(spec('processor_type'))
        : [];

  const bullets = (row.shortDescription ?? '')
    .replace(/<[^>]+>/g, '\n')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 4);

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    price: Number(row.price),
    compareAtPrice:
      row.compareAtPrice != null && Number(row.compareAtPrice) > Number(row.price) ? Number(row.compareAtPrice) : null,
    imageUrl: row.images[0]?.url ?? null,
    href: `/${row.category.slug}/${row.slug}`,
    brand: row.brand?.name ?? null,
    bullets,
    watts: estimateWatts({
      slot: slotId,
      tdp: spec('tdp'),
      recommendedPsu: spec('recommended_psu'),
      storageIsHdd: row.category.slug === 'hdd',
    }),
    socket,
    memoryTypes,
    makers: makers as CpuMaker[],
    slot: slotId,
  };
}

export async function queryChooser(p: ChooserParams): Promise<ChooserResult> {
  const empty: ChooserResult = { products: [], total: 0, page: 1, pages: 1, brands: [], facets: [], priceBounds: null };
  if (p.slot.sources.length === 0) return empty;

  const where = buildWhere(p);
  const total = await prisma.product.count({ where });
  const pages = Math.max(1, Math.ceil(total / CHOOSER_PAGE_SIZE));
  const page = Math.min(Math.max(1, p.page), pages);

  const [rows, brandGroups, bounds, facetGroups] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: [{ price: p.sort === 'price_desc' ? 'desc' : 'asc' }, { name: 'asc' }],
      skip: (page - 1) * CHOOSER_PAGE_SIZE,
      take: CHOOSER_PAGE_SIZE,
    }),
    prisma.product.groupBy({
      by: ['brandId'],
      where: buildWhere(p, { brand: true }),
      _count: { _all: true },
    }),
    prisma.product.aggregate({
      where: buildWhere(p, { price: true }),
      _min: { price: true },
      _max: { price: true },
    }),
    Promise.all(
      p.slot.facets.map(async (facet) => {
        const groups = await prisma.productSpecification.groupBy({
          by: ['value'],
          where: {
            specificationDefinition: { key: facet.key },
            product: buildWhere(p, { facet: facet.key }),
          },
          _count: { _all: true },
        });
        const options = groups
          .filter((g) => g.value.trim() && g.value.length <= 40 && (!facet.pattern || new RegExp(facet.pattern, 'i').test(g.value.trim())))
          .map((g) => ({ value: g.value, count: g._count._all }))
          .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))
          .slice(0, 14);
        return { key: facet.key, label: facet.label, options };
      })
    ),
  ]);

  const brandIds = brandGroups.map((g) => g.brandId).filter((id): id is string => Boolean(id));
  const brandRows = brandIds.length
    ? await prisma.brand.findMany({ where: { id: { in: brandIds } }, select: { id: true, name: true, slug: true } })
    : [];
  const brands = brandGroups
    .map((g) => {
      const brand = brandRows.find((b) => b.id === g.brandId);
      return brand ? { slug: brand.slug, name: brand.name, count: g._count._all } : null;
    })
    .filter((b): b is { slug: string; name: string; count: number } => Boolean(b))
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    products: rows.map((row) => toBuilderProduct(row, p.slot.id)).filter((x): x is BuilderProduct => Boolean(x)),
    total,
    page,
    pages,
    brands,
    facets: facetGroups.filter((f) => f.options.length > 0),
    priceBounds:
      bounds._min.price != null && bounds._max.price != null
        ? { min: Math.floor(Number(bounds._min.price)), max: Math.ceil(Number(bounds._max.price)) }
        : null,
  };
}

/** Look parts up by slug (shared builds). Out-of-stock or inactive parts are dropped. */
export async function productsBySlugs(slugs: string[]): Promise<BuilderProduct[]> {
  const unique = Array.from(new Set(slugs)).slice(0, 30);
  if (unique.length === 0) return [];
  const rows = await prisma.product.findMany({
    where: { slug: { in: unique }, isActive: true, stockStatus: 'IN_STOCK' },
    include: productInclude,
  });
  return unique
    .map((slug) => rows.find((r) => r.slug === slug))
    .filter((r): r is Row => Boolean(r))
    .map((row) => toBuilderProduct(row))
    .filter((x): x is BuilderProduct => Boolean(x));
}

export { SLOT_BY_ID };
