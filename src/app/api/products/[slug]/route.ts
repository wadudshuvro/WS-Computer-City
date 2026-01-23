import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/services/product.service';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/products/[slug]
 * Get a single product by slug with all details
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Fetch product using the service
    const product = await ProductService.getBySlug(slug);

    if (!product) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Product not found',
          },
        },
        { status: 404 }
      );
    }

    // Get related products from the same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      include: {
        brand: {
          select: { name: true, slug: true },
        },
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      take: 8,
      orderBy: { createdAt: 'desc' },
    });

    // Format the product for response
    const formattedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : undefined,
      costPrice: product.costPrice ? Number(product.costPrice) : undefined,
      shortDescription: product.shortDescription,
      description: product.description,
      stockStatus: product.stockStatus,
      stockQuantity: product.stockQuantity,
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      metaKeywords: product.metaKeywords,
      isFeatured: product.isFeatured,
      isActive: product.isActive,
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
        breadcrumb: product.category.breadcrumb,
      },
      brand: {
        id: product.brand.id,
        name: product.brand.name,
        slug: product.brand.slug,
      },
      images: product.images.map((img) => ({
        url: img.url,
        alt: img.alt,
        isPrimary: img.isPrimary,
        order: img.order,
      })),
      specifications: product.specifications.map((spec) => ({
        specificationDefinition: {
          key: spec.specificationDefinition.key,
          name: spec.specificationDefinition.name,
        },
        value: spec.value,
      })),
    };

    // Format related products
    const formattedRelatedProducts = relatedProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
      stockStatus: p.stockStatus,
      brand: {
        name: p.brand.name,
      },
      images: p.images.map((img) => ({
        url: img.url,
        alt: img.alt,
        isPrimary: img.isPrimary,
      })),
    }));

    return NextResponse.json({
      data: formattedProduct,
      relatedProducts: formattedRelatedProducts,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching the product',
        },
      },
      { status: 500 }
    );
  }
}
