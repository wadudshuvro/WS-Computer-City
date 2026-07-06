import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function getCategoryAncestorIds(categoryId: string): Promise<string[]> {
  const ids: string[] = [];
  let currentId: string | null = categoryId;

  while (currentId) {
    ids.push(currentId);
    const category = await prisma.category.findUnique({
      where: { id: currentId },
      select: { parentId: true },
    });
    currentId = category?.parentId ?? null;
  }

  return ids;
}

/**
 * GET /api/admin/specification-definitions?categoryId=xxx
 * Get specification definitions for a category (includes parent category specs)
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

    const categoryIds = await getCategoryAncestorIds(categoryId);

    const specDefinitions = await prisma.specificationDefinition.findMany({
      where: { categoryId: { in: categoryIds } },
      orderBy: { order: 'asc' },
    });

    // Prefer definitions on the exact category over parent definitions
    const byKey = new Map<string, (typeof specDefinitions)[0]>();
    for (const spec of specDefinitions) {
      const existing = byKey.get(spec.key);
      if (!existing || spec.categoryId === categoryId) {
        byKey.set(spec.key, spec);
      }
    }

    const deduped = Array.from(byKey.values()).sort((a, b) => a.order - b.order);

    return NextResponse.json({ data: deduped });
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
