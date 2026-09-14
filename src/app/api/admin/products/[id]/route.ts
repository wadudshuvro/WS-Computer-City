import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProductService } from '@/services/product.service';
import { updateProductSchema } from '@/lib/validations/product.schema';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';

/**
 * GET /api/admin/products/[id]
 * Get a single product by ID with all details
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          include: {
            parent: true,
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
        },
      },
    });

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

    // Format the response
    const formattedProduct = {
      ...product,
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      costPrice: product.costPrice ? Number(product.costPrice) : null,
    };

    return NextResponse.json({
      data: formattedProduct,
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

/**
 * PUT /api/admin/products/[id]
 * Update a product — persists to Postgres and revalidates storefront paths.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existingProduct = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        slug: true,
        category: { select: { slug: true, parent: { select: { slug: true } } } },
      },
    });

    if (!existingProduct) {
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

    const validated = updateProductSchema.parse(body);
    const updatedProduct = await ProductService.update(id, validated);

    const newSlug = updatedProduct?.slug ?? existingProduct.slug;
    const categorySlug =
      updatedProduct?.category?.slug ?? existingProduct.category.slug;
    const parentSlug =
      existingProduct.category.parent?.slug ?? 'components';

    // Bust Next.js cache so storefront reflects CMS edits immediately
    revalidatePath('/products');
    revalidatePath(`/products/${existingProduct.slug}`);
    if (newSlug !== existingProduct.slug) {
      revalidatePath(`/products/${newSlug}`);
    }
    revalidatePath(`/products/category/${categorySlug}`);
    revalidatePath(`/admin/products/category/${categorySlug}`);
    // Soft-nav listing URLs used by mega menu / filters
    revalidatePath(`/products?category=${parentSlug}`);
    revalidatePath(`/products?category=${parentSlug}&sub=${categorySlug}`);

    return NextResponse.json({
      data: updatedProduct,
      message: 'Product updated successfully',
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid product data',
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }

    console.error('Error updating product:', error);

    const prismaError = error as { code?: string; meta?: { target?: string[] }; message?: string };
    if (prismaError.code === 'P2002') {
      return NextResponse.json(
        {
          error: {
            code: 'DUPLICATE_ERROR',
            message: `A product with this ${prismaError.meta?.target?.[0]} already exists`,
          },
        },
        { status: 409 }
      );
    }

    if (error instanceof Error && error.message.includes('specifications')) {
      return NextResponse.json(
        {
          error: {
            code: 'SPEC_SAVE_ERROR',
            message: error.message,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while updating the product',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/products/[id]
 * Delete a product (soft delete)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
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

    // Soft delete - set isActive to false
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while deleting the product',
        },
      },
      { status: 500 }
    );
  }
}
