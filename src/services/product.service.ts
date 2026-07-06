import { prisma } from '@/lib/prisma';
import { CreateProductDTO, UpdateProductDTO, ProductFilterDTO } from '@/lib/validations/product.schema';
import { Prisma } from '@prisma/client';

type SpecInput = { specificationDefinitionId?: string; key?: string; value: string };

export class ProductService {
  /** Collect category ID and all ancestor category IDs for spec lookup */
  private static async getCategoryAncestorIds(
    tx: Prisma.TransactionClient,
    categoryId: string
  ): Promise<string[]> {
    const ids: string[] = [];
    let currentId: string | null = categoryId;

    while (currentId) {
      ids.push(currentId);
      const category = await tx.category.findUnique({
        where: { id: currentId },
        select: { parentId: true },
      });
      currentId = category?.parentId ?? null;
    }

    return ids;
  }

  /** Resolve key-based specs to specificationDefinitionId using category hierarchy */
  private static async resolveSpecifications(
    tx: Prisma.TransactionClient,
    categoryId: string,
    specifications: SpecInput[]
  ): Promise<{ specificationDefinitionId: string; value: string }[]> {
    const categoryIds = await this.getCategoryAncestorIds(tx, categoryId);
    const resolved: { specificationDefinitionId: string; value: string }[] = [];
    const seenDefinitionIds = new Set<string>();

    for (const spec of specifications) {
      if (!spec.value?.trim()) continue;

      if (spec.specificationDefinitionId) {
        if (!seenDefinitionIds.has(spec.specificationDefinitionId)) {
          resolved.push({
            specificationDefinitionId: spec.specificationDefinitionId,
            value: spec.value.trim(),
          });
          seenDefinitionIds.add(spec.specificationDefinitionId);
        }
        continue;
      }

      if (spec.key) {
        const definitions = await tx.specificationDefinition.findMany({
          where: { key: spec.key, categoryId: { in: categoryIds } },
        });
        const definition =
          definitions.find((d) => d.categoryId === categoryId) ?? definitions[0];

        if (definition && !seenDefinitionIds.has(definition.id)) {
          resolved.push({
            specificationDefinitionId: definition.id,
            value: spec.value.trim(),
          });
          seenDefinitionIds.add(definition.id);
        }
      }
    }

    return resolved;
  }
  /**
   * Create a new product with images and specifications
   */
  static async create(data: CreateProductDTO) {
    return await prisma.$transaction(async (tx) => {
      // 1. Create the product
      const product = await tx.product.create({
        data: {
          name: data.name,
          slug: data.slug,
          sku: data.sku,
          description: data.description,
          shortDescription: data.shortDescription,
          price: new Prisma.Decimal(data.price),
          compareAtPrice: data.compareAtPrice ? new Prisma.Decimal(data.compareAtPrice) : null,
          costPrice: data.costPrice ? new Prisma.Decimal(data.costPrice) : null,
          stockStatus: data.stockStatus,
          stockQuantity: data.stockQuantity,
          lowStockAlert: data.lowStockAlert,
          categoryId: data.categoryId,
          brandId: data.brandId,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          metaKeywords: data.metaKeywords,
          isFeatured: data.isFeatured,
          isActive: data.isActive,
          publishedAt: new Date(),
        },
      });

      // 2. Create product images
      if (data.images && data.images.length > 0) {
        await tx.productImage.createMany({
          data: data.images.map((img) => ({
            productId: product.id,
            url: img.url,
            alt: img.alt || data.name,
            order: img.order,
            isPrimary: img.isPrimary,
          })),
        });
      }

      // 3. Create product specifications
      if (data.specifications && data.specifications.length > 0) {
        const dbSpecs = await this.resolveSpecifications(
          tx,
          data.categoryId,
          data.specifications as SpecInput[]
        );

        if (dbSpecs.length > 0) {
          await tx.productSpecification.createMany({
            data: dbSpecs.map((spec) => ({
              productId: product.id,
              specificationDefinitionId: spec.specificationDefinitionId,
              value: spec.value,
            })),
          });

          await this.updateFilterCache(tx, data.categoryId, dbSpecs);
        }
      }

      // 5. Return product with all relations
      return await tx.product.findUnique({
        where: { id: product.id },
        include: {
          category: true,
          brand: true,
          images: { orderBy: { order: 'asc' } },
          specifications: {
            include: {
              specificationDefinition: true,
            },
          },
        },
      });
    });
  }

  /**
   * Update a product
   */
  static async update(id: string, data: UpdateProductDTO) {
    return await prisma.$transaction(async (tx) => {
      // Update main product data
      const product = await tx.product.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.slug && { slug: data.slug }),
          ...(data.sku && { sku: data.sku }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.shortDescription !== undefined && { shortDescription: data.shortDescription }),
          ...(data.price && { price: new Prisma.Decimal(data.price) }),
          ...(data.compareAtPrice !== undefined && {
            compareAtPrice: data.compareAtPrice ? new Prisma.Decimal(data.compareAtPrice) : null,
          }),
          ...(data.costPrice !== undefined && {
            costPrice: data.costPrice ? new Prisma.Decimal(data.costPrice) : null,
          }),
          ...(data.stockStatus && { stockStatus: data.stockStatus }),
          ...(data.stockQuantity !== undefined && { stockQuantity: data.stockQuantity }),
          ...(data.lowStockAlert !== undefined && { lowStockAlert: data.lowStockAlert }),
          ...(data.categoryId && { categoryId: data.categoryId }),
          ...(data.brandId && { brandId: data.brandId }),
          ...(data.metaTitle !== undefined && { metaTitle: data.metaTitle }),
          ...(data.metaDescription !== undefined && { metaDescription: data.metaDescription }),
          ...(data.metaKeywords !== undefined && { metaKeywords: data.metaKeywords }),
          ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
        },
      });

      // Update images if provided
      if (data.images) {
        // Delete existing images
        await tx.productImage.deleteMany({ where: { productId: id } });
        
        // Create new images
        await tx.productImage.createMany({
          data: data.images.map((img) => ({
            productId: id,
            url: img.url,
            alt: img.alt || data.name || product.name,
            order: img.order,
            isPrimary: img.isPrimary,
          })),
        });
      }

      // Update specifications if provided
      if (data.specifications) {
        await tx.productSpecification.deleteMany({ where: { productId: id } });

        const dbSpecs = await this.resolveSpecifications(
          tx,
          data.categoryId || product.categoryId,
          data.specifications as SpecInput[]
        );

        if (dbSpecs.length > 0) {
          await tx.productSpecification.createMany({
            data: dbSpecs.map((spec) => ({
              productId: id,
              specificationDefinitionId: spec.specificationDefinitionId,
              value: spec.value,
            })),
          });

          await this.updateFilterCache(tx, data.categoryId || product.categoryId, dbSpecs);
        }
      }

      return await tx.product.findUnique({
        where: { id },
        include: {
          category: true,
          brand: true,
          images: { orderBy: { order: 'asc' } },
          specifications: {
            include: {
              specificationDefinition: true,
            },
          },
        },
      });
    });
  }

  /**
   * Get products with filters
   */
  static async getFiltered(filters: ProductFilterDTO) {
    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    // Category filter
    if (filters.category) {
      where.category = {
        slug: filters.category,
      };
    }

    // Brand filter
    if (filters.brand) {
      const brands = Array.isArray(filters.brand) ? filters.brand : [filters.brand];
      where.brand = {
        slug: { in: brands },
      };
    }

    // Price range filter
    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) {
        where.price.gte = new Prisma.Decimal(filters.minPrice);
      }
      if (filters.maxPrice) {
        where.price.lte = new Prisma.Decimal(filters.maxPrice);
      }
    }

    // Stock status filter
    if (filters.stockStatus) {
      const statuses = Array.isArray(filters.stockStatus)
        ? filters.stockStatus
        : [filters.stockStatus];
      where.stockStatus = { in: statuses };
    }

    // Search filter
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Dynamic specification filters
    if (filters.specs && Object.keys(filters.specs).length > 0) {
      where.specifications = {
        some: {
          AND: Object.entries(filters.specs).map(([key, value]) => ({
            specificationDefinition: { key },
            value: { contains: value, mode: 'insensitive' },
          })),
        },
      };
    }

    // Sorting
    const orderBy: Prisma.ProductOrderByWithRelationInput = this.getSortOrder(filters.sort);

    // Execute queries in parallel
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          brand: true,
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        total,
        page: filters.page,
        limit: filters.limit,
        pages: Math.ceil(total / filters.limit),
      },
    };
  }

  /**
   * Match products assigned to graphics-card parent but belonging to NVIDIA or AMD by chipset/name
   */
  private static getGpuTypeMatchConditions(gpuType: 'nvidia' | 'amd'): Prisma.ProductWhereInput[] {
    const patterns =
      gpuType === 'nvidia'
        ? ['geforce', 'rtx', 'gtx', 'nvidia', 'quadro']
        : ['radeon', 'rx 6', 'rx 7', 'rx 9', 'rx 5', 'rx6', 'rx7', 'rx9', 'amd radeon'];

    const conditions: Prisma.ProductWhereInput[] = [];
    for (const pattern of patterns) {
      conditions.push({
        specifications: {
          some: {
            specificationDefinition: { key: 'gpu_chipset' },
            value: { contains: pattern, mode: 'insensitive' },
          },
        },
      });
      conditions.push({
        name: { contains: pattern, mode: 'insensitive' },
      });
    }
    return conditions;
  }

  /**
   * Resolve category slug from URL params (sub + optional type for GPU child links)
   */
  static resolveCategorySlug(sub?: string | null, category?: string | null, type?: string | null): string | undefined {
    const subSlug = sub || undefined;
    const typeSlug = type || undefined;

    if (subSlug === 'graphics-card' && (typeSlug === 'nvidia' || typeSlug === 'amd-gpu')) {
      return typeSlug;
    }

    return subSlug || category || undefined;
  }

  /**
   * Get products with filters - includes products from child categories
   * When filtering by "graphics-card", also includes products from "nvidia" and "amd-gpu"
   * When filtering by "nvidia"/"amd-gpu", also includes matching products on parent "graphics-card"
   */
  static async getFilteredWithChildren(filters: ProductFilterDTO) {
    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    // Category filter - include child categories (+ GPU parent fallback)
    if (filters.category) {
      const slug = filters.category;

      if (slug === 'nvidia' || slug === 'amd-gpu') {
        const gpuType = slug === 'nvidia' ? 'nvidia' : 'amd';
        const [category, parentCategory] = await Promise.all([
          prisma.category.findFirst({
            where: { slug },
            include: { children: true },
          }),
          prisma.category.findFirst({ where: { slug: 'graphics-card' } }),
        ]);

        const categoryIds = category
          ? [category.id, ...category.children.map((c) => c.id)]
          : [];

        const orConditions: Prisma.ProductWhereInput[] = [];

        if (categoryIds.length > 0) {
          orConditions.push({ categoryId: { in: categoryIds } });
        }

        if (parentCategory) {
          orConditions.push({
            AND: [
              { categoryId: parentCategory.id },
              { OR: this.getGpuTypeMatchConditions(gpuType) },
            ],
          });
        }

        if (orConditions.length > 0) {
          where.AND = [...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []), { OR: orConditions }];
        }
      } else {
        const category = await prisma.category.findFirst({
          where: { slug },
          include: { children: true },
        });

        if (category) {
          const categoryIds = [category.id, ...category.children.map((c) => c.id)];
          where.categoryId = { in: categoryIds };
        } else {
          where.category = { slug };
        }
      }
    }

    // Brand filter
    if (filters.brand) {
      const brands = Array.isArray(filters.brand) ? filters.brand : [filters.brand];
      where.brand = {
        slug: { in: brands },
      };
    }

    // Price range filter
    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) {
        where.price.gte = new Prisma.Decimal(filters.minPrice);
      }
      if (filters.maxPrice) {
        where.price.lte = new Prisma.Decimal(filters.maxPrice);
      }
    }

    // Stock status filter
    if (filters.stockStatus) {
      const statuses = Array.isArray(filters.stockStatus)
        ? filters.stockStatus
        : [filters.stockStatus];
      where.stockStatus = { in: statuses };
    }

    // Search filter
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Dynamic specification filters
    if (filters.specs && Object.keys(filters.specs).length > 0) {
      where.specifications = {
        some: {
          AND: Object.entries(filters.specs).map(([key, value]) => ({
            specificationDefinition: { key },
            value: { contains: value, mode: 'insensitive' },
          })),
        },
      };
    }

    // Sorting
    const orderBy: Prisma.ProductOrderByWithRelationInput = this.getSortOrder(filters.sort);

    // Execute queries in parallel
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          brand: true,
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        total,
        page: filters.page,
        limit: filters.limit,
        pages: Math.ceil(total / filters.limit),
      },
    };
  }

  /**
   * Get product by slug with all details
   */
  static async getBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          include: {
            parent: {
              include: {
                parent: true, // Support 3-level breadcrumb
              },
            },
          },
        },
        brand: true,
        images: {
          orderBy: { order: 'asc' },
        },
        specifications: {
          include: {
            specificationDefinition: true,
          },
          orderBy: {
            specificationDefinition: {
              order: 'asc',
            },
          },
        },
      },
    });

    if (!product) {
      return null;
    }

    // Build breadcrumb
    const breadcrumb = this.buildBreadcrumb(product.category);

    return {
      ...product,
      category: {
        ...product.category,
        breadcrumb,
      },
    };
  }

  /**
   * Delete product
   */
  static async delete(id: string) {
    // Soft delete (set isActive to false) or hard delete
    return await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Get featured products
   */
  static async getFeatured(limit: number = 10) {
    return await prisma.product.findMany({
      where: {
        isFeatured: true,
        isActive: true,
      },
      include: {
        category: true,
        brand: true,
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  // ============================================
  // PRIVATE HELPER METHODS
  // ============================================

  /**
   * Update filterable specification cache for better performance
   */
  private static async updateFilterCache(
    tx: Prisma.TransactionClient,
    categoryId: string,
    specifications: Array<{ specificationDefinitionId: string; value: string }>
  ) {
    for (const spec of specifications) {
      const definition = await tx.specificationDefinition.findUnique({
        where: { id: spec.specificationDefinitionId },
      });

      if (definition && definition.isFilterable) {
        await tx.filterableSpecification.upsert({
          where: {
            key_value_categoryId: {
              key: definition.key,
              value: spec.value,
              categoryId: definition.categoryId,
            },
          },
          update: {
            count: { increment: 1 },
          },
          create: {
            key: definition.key,
            value: spec.value,
            categoryId: definition.categoryId,
            count: 1,
          },
        });
      }
    }
  }

  /**
   * Build category breadcrumb
   */
  private static buildBreadcrumb(category: any): any[] {
    const breadcrumb = [category];
    let current = category.parent;

    while (current) {
      breadcrumb.unshift(current);
      current = current.parent;
    }

    return breadcrumb;
  }

  /**
   * Get sort order for query
   */
  private static getSortOrder(sort?: string): Prisma.ProductOrderByWithRelationInput {
    switch (sort) {
      case 'price_asc':
        return { price: 'asc' };
      case 'price_desc':
        return { price: 'desc' };
      case 'name':
        return { name: 'asc' };
      case 'newest':
      default:
        return { createdAt: 'desc' };
    }
  }
}
