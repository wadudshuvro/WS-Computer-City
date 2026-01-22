'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Grid, List, ChevronRight, SlidersHorizontal, X, Heart, ShoppingCart, Eye } from 'lucide-react';
import { ProcessorFilters } from '@/components/products/ProcessorFilters';
import { processorSortOptions } from '@/lib/filterConfig';
import { formatBDT } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  shortDescription?: string;
  stockStatus: string;
  category: {
    name: string;
    slug: string;
  };
  brand: {
    name: string;
    slug: string;
  };
  images: Array<{
    url: string;
    alt?: string;
    isPrimary: boolean;
  }>;
  specifications?: Array<{
    specificationDefinition: {
      key: string;
      name: string;
    };
    value: string;
  }>;
}

interface FilterCounts {
  [key: string]: {
    [value: string]: number;
  };
}

function ProcessorPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filterCounts, setFilterCounts] = useState<FilterCounts>({});
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });

  // Get current page and sort from URL
  const currentPage = Number(searchParams.get('page')) || 1;
  const currentSort = searchParams.get('sort') || 'default';
  const itemsPerPage = 30;

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Build query string from URL params
      const params = new URLSearchParams(searchParams.toString());
      params.set('category', 'processor');
      
      if (!params.has('limit')) {
        params.set('limit', itemsPerPage.toString());
      }

      const res = await fetch(`/api/products/processor?${params.toString()}`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await res.json();
      setProducts(data.data || []);
      setTotalProducts(data.pagination?.total || 0);
      setTotalPages(data.pagination?.pages || 1);
      
      if (data.filters) {
        setFilterCounts(data.filters.counts || {});
        setPriceRange(data.filters.priceRange || { min: 0, max: 1000000 });
      }
    } catch (error: any) {
      console.error('Error fetching products:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sort);
    params.set('page', '1');
    router.push(`/products/processor?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/products/processor?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStockStatusBadge = (status: string) => {
    const badges: Record<string, { text: string; className: string }> = {
      IN_STOCK: { text: 'In Stock', className: 'bg-green-500' },
      OUT_OF_STOCK: { text: 'Out of Stock', className: 'bg-red-500' },
      PRE_ORDER: { text: 'Pre-Order', className: 'bg-blue-500' },
      UPCOMING: { text: 'Upcoming', className: 'bg-purple-500' },
    };
    return badges[status] || { text: status, className: 'bg-gray-500' };
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-[1400px] mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-blue-600">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link href="/products" className="text-gray-500 hover:text-blue-600">
              Components
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">Processor</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Processor Price In BD 2026
          </h1>
          <p className="text-sm text-gray-600 max-w-4xl">
            Processor Price in BD 2026 begins at BDT 5,600/- and can go up to BDT 85,500/- depending on the brand and specifications. 
            With a variety of 135 items available at WS Computer City, where 97 items are in stock now & 135 items offer you the best 
            discount price in BD. Find the perfect Processor Components for your requirements.
          </p>
          
          {/* Sub-category tabs */}
          <div className="flex gap-4 mt-4">
            <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
              Intel
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
              AMD Ryzen
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-[280px] flex-shrink-0">
            <ProcessorFilters
              priceRange={priceRange}
              filterCounts={filterCounts}
            />
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden fixed bottom-4 left-4 z-40 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2"
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </button>

          {/* Mobile Filters Overlay */}
          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50">
              <div className="absolute right-0 top-0 bottom-0 w-[320px] bg-white overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <ProcessorFilters
                  priceRange={priceRange}
                  filterCounts={filterCounts}
                />
              </div>
            </div>
          )}

          {/* Products Section */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2">
                    <select
                      value={currentSort}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {processorSortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Items per page */}
                  <div className="flex items-center gap-2">
                    <select
                      defaultValue="30"
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="20">20</option>
                      <option value="30">30</option>
                      <option value="50">50</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Product Count */}
                  <span className="text-sm text-gray-600">
                    Showing {products.length} out of {totalProducts} products
                  </span>

                  {/* View Mode Toggle */}
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Loading processors...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-800">Error: {error}</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && products.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">No Products Found</h2>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search criteria.
                </p>
                <Link
                  href="/products/processor"
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Clear Filters
                </Link>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && products.length > 0 && (
              <>
                <div className={`grid gap-4 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {products.map((product) => {
                    const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
                    const discount = product.compareAtPrice
                      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
                      : 0;
                    const stockBadge = getStockStatusBadge(product.stockStatus);

                    return viewMode === 'grid' ? (
                      // Grid View Card
                      <div
                        key={product.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
                      >
                        {/* Discount Badge */}
                        {discount > 0 && (
                          <div className="absolute top-3 left-3 z-10">
                            <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
                              Save: ৳ {(product.compareAtPrice! - product.price).toLocaleString()}
                            </span>
                          </div>
                        )}

                        {/* Product Image */}
                        <div className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                          {primaryImage ? (
                            <img
                              src={primaryImage.url}
                              alt={primaryImage.alt || product.name}
                              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No Image
                            </div>
                          )}
                          
                          {/* Quick Actions */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                            <button className="bg-white p-2 rounded-full shadow hover:bg-blue-50 hover:text-blue-600 transition-colors">
                              <Heart className="w-5 h-5" />
                            </button>
                            <button className="bg-white p-2 rounded-full shadow hover:bg-blue-50 hover:text-blue-600 transition-colors">
                              <Eye className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          {/* Product Name */}
                          <Link href={`/products/${product.slug}`}>
                            <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem] hover:text-blue-600 transition-colors">
                              {product.name}
                            </h3>
                          </Link>

                          {/* Price */}
                          <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-xl font-bold text-blue-600">
                              ৳ {product.price.toLocaleString()}
                            </span>
                            {product.compareAtPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ৳ {product.compareAtPrice.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {/* Stock Status */}
                          <div className="mb-3">
                            <span className={`${stockBadge.className} text-white text-xs px-2 py-1 rounded`}>
                              {stockBadge.text}
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <button className="flex-1 bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors text-sm font-medium">
                              <ShoppingCart className="w-4 h-4 inline mr-1" />
                            </button>
                            <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors text-sm font-medium">
                              Buy Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // List View Card
                      <div
                        key={product.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex"
                      >
                        {/* Product Image */}
                        <div className="relative w-48 h-48 flex-shrink-0 bg-gray-100 rounded-l-lg overflow-hidden">
                          {primaryImage ? (
                            <img
                              src={primaryImage.url}
                              alt={primaryImage.alt || product.name}
                              className="w-full h-full object-contain p-4"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No Image
                            </div>
                          )}
                          {discount > 0 && (
                            <div className="absolute top-2 left-2">
                              <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                -{discount}%
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 p-4 flex flex-col justify-between">
                          <div>
                            <Link href={`/products/${product.slug}`}>
                              <h3 className="font-medium text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                                {product.name}
                              </h3>
                            </Link>
                            {product.shortDescription && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {product.shortDescription}
                              </p>
                            )}
                            <span className={`${stockBadge.className} text-white text-xs px-2 py-1 rounded`}>
                              {stockBadge.text}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-bold text-blue-600">
                                ৳ {product.price.toLocaleString()}
                              </span>
                              {product.compareAtPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  ৳ {product.compareAtPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors text-sm font-medium">
                                <ShoppingCart className="w-4 h-4 inline mr-1" />
                                Add to Cart
                              </button>
                              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm font-medium">
                                Buy Now
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="flex items-center gap-1">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        &lt;
                      </button>
                      
                      {getPageNumbers().map((page, index) => (
                        page === '...' ? (
                          <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page as number)}
                            className={`px-3 py-2 rounded text-sm ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      ))}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        &gt;
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white border-t mt-8">
        <div className="max-w-[1400px] mx-auto px-4 py-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Processor Price in Bangladesh
          </h2>
          <div className="prose prose-sm max-w-none text-gray-600">
            <p>
              A processor, also known as a microprocessor, is a small chip that acts as the brain of a computer and other electronic devices. 
              The central processor of a computer is called the CPU (Central Processing Unit), and most desktop CPUs are developed by Intel or AMD. 
              Modern processors include multiple cores that work together to execute instructions efficiently and improve multitasking performance.
              When upgrading or building a new computer, checking local pricing is important, such as the processor price in BD, to understand 
              the cost of modern and efficient hardware. WS Computer City BD offers a wide selection of Intel processors in Bangladesh, 
              including Core i3, Core i5, Core i7, and Core i9 models.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Intel Processor</h3>
            <p>
              Intel Corporation develops Intel processors, which serve as central processing units (CPUs) in laptops, desktops, and servers. 
              These processors deliver strong performance and reliable operation. Intel organizes them into families such as Core™ (i3, i5, i7, i9) 
              for everyday and high-end use, Xeon™ for servers, and Pentium®, Celeron®, and Atom™ for basic computing tasks. Intel processors 
              include technologies like Turbo Boost, Hyper-Threading, and integrated graphics to improve multitasking and overall efficiency.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">AMD Processor</h3>
            <p>
              AMD (Advanced Micro Devices) processors offer excellent performance and value for gaming, content creation, and professional workloads. 
              The Ryzen series, including Ryzen 3, Ryzen 5, Ryzen 7, and Ryzen 9, provides options for every user from budget-conscious buyers to 
              enthusiasts seeking top-tier performance. AMD's innovative technologies like Precision Boost, 3D V-Cache, and excellent multi-threaded 
              performance make them a popular choice among PC builders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProcessorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    }>
      <ProcessorPageContent />
    </Suspense>
  );
}
