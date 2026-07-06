import { AdminShell } from '@/components/admin/AdminShell';
import ProductEntryForm from '@/components/admin/ProductEntryForm';
import { getContentTypeBySlug } from '@/lib/adminCategoryConfig';

interface NewProductPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function NewProductPage({ searchParams }: NewProductPageProps) {
  const { category: categorySlug } = await searchParams;
  const contentType = categorySlug ? getContentTypeBySlug(categorySlug) : undefined;

  return (
    <AdminShell
      title="Add entry"
      subtitle={
        contentType
          ? `Create a new ${contentType.name} product`
          : 'Create a new product entry with complete specifications'
      }
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Products', href: '/admin/products' },
        ...(contentType
          ? [
              { label: contentType.name, href: `/admin/products/category/${categorySlug}` },
            ]
          : []),
        { label: 'Add entry' },
      ]}
    >
      <div className="max-w-5xl">
        <ProductEntryForm defaultCategorySlug={categorySlug} />
      </div>
    </AdminShell>
  );
}
