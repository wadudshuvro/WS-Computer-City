import ProductEntryForm from '@/components/admin/ProductEntryForm';

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add New Product
          </h1>
          <p className="text-gray-600">
            Create a new product entry with complete specifications
          </p>
        </div>

        <ProductEntryForm />
      </div>
    </div>
  );
}
