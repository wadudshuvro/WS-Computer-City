'use client';

import { ProcessorFilters } from '@/components/products/ProcessorFilters';
import { processorSortOptions } from '@/lib/filterConfig';
import { ChevronRight, Eye, Grid, Heart, List, ShoppingCart, SlidersHorizontal, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

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
}

interface FilterCounts {
  [key: string]: {
    [value: string]: number;
  };
}

function ProductsPageContent() {
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

  // Get current page, sort, category, and brand tab from URL
  const currentPage = Number(searchParams.get('page')) || 1;
  const currentSort = searchParams.get('sort') || 'default';
  const categoryParam = searchParams.get('category');
  const subCategory = searchParams.get('sub');
  const typeParam = searchParams.get('type');
  const brandParam = searchParams.get('brand') || '';
  const itemsPerPage = 30;

  // Check if we're on processor category
  const isProcessorCategory = subCategory === 'processor' || categoryParam === 'processor';
  
  // Check if we're on graphics card category (including nvidia and amd-gpu subcategories)
  const isGpuCategory =
    subCategory === 'graphics-card' ||
    subCategory === 'nvidia' ||
    subCategory === 'amd-gpu' ||
    typeParam === 'nvidia' ||
    typeParam === 'amd-gpu' ||
    categoryParam === 'graphics-card';

  // Check if we're on SSD/Storage category
  const isSsdCategory = subCategory === 'ssd' || subCategory === 'nvme' || subCategory === 'storage' || categoryParam === 'ssd';

  // Active brand tab based on category type
  const activeProcessorBrandTab = brandParam === 'amd' ? 'amd' : 'intel';
  const activeGpuBrandTab =
    subCategory === 'amd-gpu' || typeParam === 'amd-gpu' ? 'amd' : 'nvidia';
  // For SSD, active brand from URL
  const activeSsdBrand = brandParam || '';

  // SSD Brands list (matching Tech Land design)
  const ssdBrands = [
    'Corsair', 'Kingston', 'Samsung', 'Team', 'XOC', 'MiPhi', 'OSCOO', 'Lexar', 'MSI', 'SanDisk',
    'Seagate', 'Adata', 'Ocpc', 'Western Digital', 'Aitc', 'Acer', 'Transcend', 'Crucial', 'Apacer',
    'Colorful', 'KingSpec', 'Netac', 'PNY', 'Twinmos', 'Pc Power', 'Biwintech', 'Kingbox', 'GIGABYTE',
    'NCX', 'Orico', 'HP', 'King Super', 'Addlink', 'NEO FORZA', 'Hikvision', 'Patriot', 'Ramsta',
    'Redragon', 'Kimtigo', 'AGI', 'Revenger', 'Dahua', 'LENOVO', 'Smart', 'Walton', 'Suneest', 'Kingbank'
  ];

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Build query string from URL params
      const params = new URLSearchParams(searchParams.toString());
      
      if (!params.has('limit')) {
        params.set('limit', itemsPerPage.toString());
      }

      // Use public products API with child-category + GPU type support
      const apiUrl = isProcessorCategory 
        ? `/api/products/processor?${params.toString()}`
        : `/api/products?${params.toString()}`;

      const res = await fetch(apiUrl);
      
      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await res.json();
      setProducts(data.data || []);
      setTotalProducts(data.pagination?.total || data.data?.length || 0);
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
    router.push(`/products?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/products?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProcessorBrandTabChange = (brand: 'intel' | 'amd') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('brand', brand);
    params.set('page', '1');
    if (!params.has('category') && !params.has('sub')) {
      params.set('sub', 'processor');
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleGpuBrandTabChange = (gpuType: 'nvidia' | 'amd') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sub', gpuType === 'amd' ? 'amd-gpu' : 'nvidia');
    params.delete('type');
    params.delete('brand');
    params.set('page', '1');
    params.set('category', 'components');
    router.push(`/products?${params.toString()}`);
  };

  const handleSsdBrandClick = (brand: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const brandSlug = brand.toLowerCase().replace(/\s+/g, '-');
    
    // Toggle brand filter - if already selected, clear it
    if (brandParam === brandSlug) {
      params.delete('brand');
    } else {
      params.set('brand', brandSlug);
    }
    params.set('page', '1');
    if (!params.has('sub')) {
      params.set('sub', 'ssd');
    }
    router.push(`/products?${params.toString()}`);
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

  // Get page title based on category
  const getPageTitle = () => {
    if (isProcessorCategory) return 'Processor Price In BD 2026';
    if (isGpuCategory) return 'Graphics Card Price In BD 2026';
    if (isSsdCategory) return 'SSD Best Price in BD 2026 | Tech Land BD';
    return 'All Products';
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
            {categoryParam && (
              <>
                <Link href="/products" className="text-gray-500 hover:text-blue-600">
                  {categoryParam === 'components' ? 'Components' : categoryParam}
                </Link>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </>
            )}
            <span className="text-gray-900 font-medium">
              {isProcessorCategory ? 'Processor' : isGpuCategory ? 'Graphics Card' : isSsdCategory ? 'SSD' : 'Products'}
            </span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {getPageTitle()}
          </h1>
          {isProcessorCategory && (
            <>
              <p className="text-sm text-gray-600 max-w-4xl">
                Processor Price in BD 2026 begins at BDT 5,600/- and can go up to BDT 85,500/- depending on the brand and specifications. 
                With a variety of 135 items available at WS Computer City, where 97 items are in stock now & 135 items offer you the best 
                discount price in BD. Find the perfect Processor Components for your requirements.
              </p>
              
              {/* Sub-category tabs - filter by brand */}
              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => handleProcessorBrandTabChange('intel')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeProcessorBrandTab === 'intel'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Intel
                </button>
                <button
                  type="button"
                  onClick={() => handleProcessorBrandTabChange('amd')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeProcessorBrandTab === 'amd'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  AMD Ryzen
                </button>
              </div>
            </>
          )}
          
          {isGpuCategory && (
            <>
              <p className="text-sm text-gray-600 max-w-4xl">
                Graphics Card Price in BD 2026 starts from BDT 8,500/- and can go up to BDT 250,000/- depending on the brand and specifications. 
                WS Computer City offers a wide selection of NVIDIA GeForce and AMD Radeon graphics cards for gaming, content creation, and professional workloads.
              </p>
              
              {/* Sub-category tabs - filter by GPU brand */}
              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => handleGpuBrandTabChange('nvidia')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeGpuBrandTab === 'nvidia'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  NVIDIA
                </button>
                <button
                  type="button"
                  onClick={() => handleGpuBrandTabChange('amd')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeGpuBrandTab === 'amd'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  AMD Radeon
                </button>
              </div>
            </>
          )}

          {/* SSD Category Section */}
          {isSsdCategory && (
            <>
              <p className="text-sm text-gray-600 max-w-4xl mb-4">
                SSD Best Price in BD 2026 begins at BDT 3,150/- and can go up to BDT 85,000/- depending on the brand and specifications. 
                With a variety of 1126 items available at WS Computer City, where 223 items are in stock now & 1076 items offer you the best 
                discount price in BD. Find the perfect SSD Components for your requirements. Search for SSD price in bd, 1tb SSD price in bd, 
                256 GB SSD price in bd, 512GB SSD price in bd, portable SSD price in bd, m.2 SSD price in bd, nvme SSD price in bd.
              </p>
              
              {/* SSD Brands Grid - Similar to Tech Land design */}
              <div className="flex flex-wrap gap-2 mt-4">
                {ssdBrands.map((brand) => {
                  const brandSlug = brand.toLowerCase().replace(/\s+/g, '-');
                  const isActive = brandParam === brandSlug;
                  return (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => handleSsdBrandClick(brand)}
                      className={`px-3 py-1.5 text-sm rounded border transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:text-blue-600'
                      }`}
                    >
                      {brand}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop (Only for processor category) */}
          {isProcessorCategory && (
            <div className="hidden lg:block w-[280px] flex-shrink-0">
              <ProcessorFilters
                priceRange={priceRange}
                filterCounts={filterCounts}
              />
            </div>
          )}

          {/* Mobile Filter Button (Only for processor category) */}
          {isProcessorCategory && (
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden fixed bottom-4 left-4 z-40 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          )}

          {/* Mobile Filters Overlay */}
          {isProcessorCategory && showMobileFilters && (
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
                  {isProcessorCategory && (
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
                  )}
                  
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
                <p className="text-gray-600">Loading products...</p>
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
                  href="/products"
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
                    const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
                    const discount = product.compareAtPrice
                      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
                      : 0;
                    const stockBadge = getStockStatusBadge(product.stockStatus);

                    return viewMode === 'grid' ? (
                      // Grid View Card
                      <div
                        key={product.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group relative"
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

      {/* SEO Content Section (Only for processor category) */}
      {isProcessorCategory && (
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
                for everyday and high-end use, Xeon™ for servers, and Pentium®, Celeron®, and Atom™ for basic computing tasks.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">AMD Processor</h3>
              <p>
                AMD (Advanced Micro Devices) processors offer excellent performance and value for gaming, content creation, and professional workloads. 
                The Ryzen series, including Ryzen 3, Ryzen 5, Ryzen 7, and Ryzen 9, provides options for every user from budget-conscious buyers to 
                enthusiasts seeking top-tier performance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SEO Content Section (Only for GPU category) */}
      {isGpuCategory && (
        <div className="bg-white border-t mt-8">
          <div className="max-w-[1400px] mx-auto px-4 py-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Graphics Card Price in Bangladesh
            </h2>
            <div className="prose prose-sm max-w-none text-gray-600">
              <p>
                A graphics card (GPU) is a specialized electronic circuit designed to rapidly manipulate and alter memory to accelerate 
                the creation of images for display. Modern graphics cards are essential for gaming, video editing, 3D rendering, and 
                machine learning tasks. WS Computer City BD offers a comprehensive selection of graphics cards from leading manufacturers 
                including NVIDIA and AMD.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">NVIDIA Graphics Cards</h3>
              <p>
                NVIDIA GeForce graphics cards are renowned for their cutting-edge technology and exceptional gaming performance. 
                The GeForce RTX series features real-time ray tracing and AI-powered DLSS technology for stunning visuals. 
                From the entry-level GTX 1650 to the flagship RTX 4090, NVIDIA offers options for every budget and performance requirement.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">AMD Graphics Cards</h3>
              <p>
                AMD Radeon graphics cards deliver excellent value and performance for gamers and content creators. 
                The Radeon RX 7000 series offers competitive performance with features like AMD FidelityFX Super Resolution (FSR) 
                for enhanced frame rates. AMD GPUs are known for their strong price-to-performance ratio.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SEO Content Section (Only for SSD category) */}
      {isSsdCategory && (
        <div className="bg-white border-t mt-8">
          <div className="max-w-[1400px] mx-auto px-4 py-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              SSD Price in Bangladesh
            </h2>
            <div className="prose prose-sm max-w-none text-gray-600">
              <p>
                A Solid State Drive (SSD) is a storage device that uses flash memory to store data permanently. Unlike traditional 
                Hard Disk Drives (HDDs), SSDs have no moving parts, making them faster, more durable, and more energy-efficient. 
                SSDs significantly improve system boot times, application loading speeds, and overall computer responsiveness. 
                WS Computer City BD offers a wide selection of SSDs from leading brands including Samsung, Kingston, Crucial, 
                Western Digital, and many more.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Types of SSDs</h3>
              <p>
                <strong>SATA SSD:</strong> These are the most common type, using the SATA III interface with speeds up to 550 MB/s. 
                Available in 2.5-inch form factor, they're ideal for upgrading older laptops and desktops.
              </p>
              <p>
                <strong>NVMe SSD:</strong> Using the PCIe interface, NVMe SSDs offer significantly faster speeds (up to 7,000 MB/s or more). 
                Available in M.2 form factor, they're perfect for gaming, content creation, and professional workloads.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Popular SSD Brands</h3>
              <p>
                Samsung leads the market with their 980 PRO and 990 PRO series. Kingston offers reliable options with their A2000 and 
                KC3000 series. Crucial provides excellent value with their MX500 and P5 Plus series. Western Digital's WD Blue and 
                WD Black series are popular choices for both everyday use and gaming.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
