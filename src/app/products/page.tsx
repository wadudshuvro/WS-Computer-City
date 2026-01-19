export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Products
        </h1>
        <p className="text-gray-600 mb-8">
          Product listing will appear here once you add products via the admin panel.
        </p>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Getting Started:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Set up your PostgreSQL database</li>
            <li>Run database migrations: <code className="bg-gray-100 px-2 py-1 rounded">npm run db:migrate</code></li>
            <li>Seed sample data: <code className="bg-gray-100 px-2 py-1 rounded">npm run db:seed</code></li>
            <li>Visit the <a href="/admin" className="text-blue-600 hover:underline">Admin Panel</a> to manage products</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
