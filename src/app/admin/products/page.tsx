export default function AdminProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Manage Products
          </h1>
          <a
            href="/admin/products/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            + Add New Product
          </a>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-4">
            Product management interface will be implemented here.
          </p>
          <p className="text-sm text-gray-500">
            For now, use Prisma Studio to view/edit products: <code className="bg-gray-100 px-2 py-1 rounded">npm run db:studio</code>
          </p>
        </div>
      </div>
    </div>
  );
}
