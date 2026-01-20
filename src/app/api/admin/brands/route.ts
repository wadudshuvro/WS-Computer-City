import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/brands
 * Get all brands
 * Note: Remove auth check for now to allow easier testing
 */
export async function GET(req: NextRequest) {
  try {
    const brands = await prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    return NextResponse.json({ data: brands });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch brands' } },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/brands
 * Create a new brand
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const brand = await prisma.brand.create({
      data: {
        name: body.name,
        slug: body.slug,
        logo: body.logo,
        description: body.description,
        isActive: body.isActive ?? true,
      }
    });

    return NextResponse.json({ data: brand }, { status: 201 });
  } catch (error) {
    console.error('Error creating brand:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to create brand' } },
      { status: 500 }
    );
  }
}
