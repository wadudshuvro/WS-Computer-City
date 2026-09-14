/**
 * Adds processor specification definitions (including warranty) to
 * processor / intel / amd categories so CMS saves persist correctly.
 * Run: npx tsx scripts/add-processor-specifications.ts
 */
import { PrismaClient, DataType } from '@prisma/client';
import { processorSpecifications } from '../src/lib/categoryConfig';
import { loadEnvValue } from './load-env';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');

const prisma = new PrismaClient();

const PROCESSOR_CATEGORY_SLUGS = ['processor', 'intel', 'amd'] as const;

function mapFieldType(type: string): DataType {
  switch (type) {
    case 'number':
      return DataType.NUMBER;
    case 'boolean':
      return DataType.BOOLEAN;
    case 'select':
    case 'multiselect':
      return DataType.SELECT;
    default:
      return DataType.TEXT;
  }
}

async function upsertSpecsForCategory(categoryId: string, categorySlug: string) {
  let created = 0;
  let updated = 0;

  for (let index = 0; index < processorSpecifications.length; index++) {
    const spec = processorSpecifications[index]!;
    const existing = await prisma.specificationDefinition.findUnique({
      where: {
        categoryId_key: { categoryId, key: spec.key },
      },
    });

    await prisma.specificationDefinition.upsert({
      where: {
        categoryId_key: { categoryId, key: spec.key },
      },
      update: {
        name: spec.name,
        dataType: mapFieldType(spec.type),
        unit: spec.unit ?? null,
        isFilterable: false,
        isRequired: Boolean(spec.required),
        order: index + 1,
      },
      create: {
        categoryId,
        name: spec.name,
        key: spec.key,
        dataType: mapFieldType(spec.type),
        unit: spec.unit ?? null,
        isFilterable: false,
        isRequired: Boolean(spec.required),
        order: index + 1,
      },
    });

    if (existing) updated++;
    else created++;
  }

  console.log(
    `✅ ${categorySlug}: ${created} created, ${updated} updated (${processorSpecifications.length} total)`
  );
}

async function main() {
  for (const slug of PROCESSOR_CATEGORY_SLUGS) {
    const category = await prisma.category.findUnique({ where: { slug } });
    if (!category) {
      console.warn(`⚠️  Category "${slug}" not found — skipping`);
      continue;
    }
    await upsertSpecsForCategory(category.id, slug);
  }

  const warrantyDefs = await prisma.specificationDefinition.findMany({
    where: {
      key: 'warranty',
      category: { slug: { in: [...PROCESSOR_CATEGORY_SLUGS] } },
    },
    select: { id: true, category: { select: { slug: true } } },
  });
  console.log(
    'Warranty definitions:',
    warrantyDefs.map((d) => d.category.slug).join(', ') || '(none)'
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
