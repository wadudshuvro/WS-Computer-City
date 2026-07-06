import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/specification-definitions?categoryId=xxx
 * Get specification definitions for a specific category
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');

    if (!categoryId) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Category ID is required' } },
        { status: 400 }
      );
    }

    const specDefinitions = await prisma.specificationDefinition.findMany({
      where: { categoryId },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ data: specDefinitions });
  } catch (error) {
    console.error('Error fetching specification definitions:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch specification definitions' } },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/specification-definitions
 * Create a new specification definition for a category
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const specDefinition = await prisma.specificationDefinition.create({
      data: {
        categoryId: body.categoryId,
        name: body.name,
        key: body.key,
        dataType: body.dataType || 'TEXT',
        unit: body.unit,
        isFilterable: body.isFilterable ?? false,
        isRequired: body.isRequired ?? false,
        order: body.order || 0,
      }
    });

    return NextResponse.json({ data: specDefinition }, { status: 201 });
  } catch (error) {
    console.error('Error creating specification definition:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to create specification definition' } },
      { status: 500 }
    );
  }
}
