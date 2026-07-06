import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

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
 * Update a product
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

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

    // Update product in a transaction
    const updatedProduct = await prisma.$transaction(async (tx) => {
      // Update main product data
      const product = await tx.product.update({
        where: { id },
        data: {
          name: body.name,
          slug: body.slug,
          sku: body.sku,
          description: body.description,
          shortDescription: body.shortDescription,
          price: new Prisma.Decimal(body.price),
          compareAtPrice: body.compareAtPrice ? new Prisma.Decimal(body.compareAtPrice) : null,
          costPrice: body.costPrice ? new Prisma.Decimal(body.costPrice) : null,
          stockStatus: body.stockStatus,
          stockQuantity: body.stockQuantity,
          lowStockAlert: body.lowStockAlert,
          categoryId: body.categoryId,
          brandId: body.brandId,
          metaTitle: body.metaTitle,
          metaDescription: body.metaDescription,
          metaKeywords: body.metaKeywords,
          isFeatured: body.isFeatured,
          isActive: body.isActive,
        },
      });

      // Update images - delete existing and create new
      if (body.images) {
        await tx.productImage.deleteMany({ where: { productId: id } });

        if (body.images.length > 0) {
          await tx.productImage.createMany({
            data: body.images.map((img: any, index: number) => ({
              productId: id,
              url: img.url,
              alt: img.alt || body.name,
              order: img.order ?? index,
              isPrimary: img.isPrimary ?? index === 0,
            })),
          });
        }
      }

      // Update specifications - delete existing and create new
      if (body.specifications) {
        await tx.productSpecification.deleteMany({ where: { productId: id } });

        // Filter specifications that have a specificationDefinitionId
        const validSpecs = body.specifications.filter(
          (spec: any) => spec.specificationDefinitionId && spec.value
        );

        if (validSpecs.length > 0) {
          await tx.productSpecification.createMany({
            data: validSpecs.map((spec: any) => ({
              productId: id,
              specificationDefinitionId: spec.specificationDefinitionId,
              value: spec.value,
            })),
          });
        }
      }

      // Return updated product with relations
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

    return NextResponse.json({
      data: updatedProduct,
      message: 'Product updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating product:', error);

    // Handle unique constraint errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        {
          error: {
            code: 'DUPLICATE_ERROR',
            message: `A product with this ${error.meta?.target?.[0]} already exists`,
          },
        },
        { status: 409 }
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
