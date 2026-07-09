'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronRight, 
  Heart, 
  ShoppingCart, 
  Star, 
  Check, 
  X,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Plus,
  Minus
} from 'lucide-react';
import { GPU_SPECIFICATION_GROUPS, isGpuCategory, getCategorySlugs } from '@/lib/gpuSpecDefinitions';
import { MOTHERBOARD_SPECIFICATION_GROUPS, isMotherboardCategory } from '@/lib/motherboardSpecDefinitions';
import { GpuProductHighlights } from '@/components/products/GpuProductHighlights';
import { ProductDescription } from '@/components/products/ProductDescription';

interface ProductSpecification {
  specificationDefinition: {
    key: string;
    name: string;
  };
  value: string;
}

interface ProductImage {
  url: string;
  alt?: string;
  isPrimary: boolean;
  order: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  parent?: {
    id: string;
    name: string;
    slug: string;
    parent?: {
      id: string;
      name: string;
      slug: string;
    };
  };
  breadcrumb?: Category[];
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  shortDescription?: string;
  description?: string;
  stockStatus: string;
  stockQuantity: number;
  metaTitle?: string;
  metaDescription?: string;
  category: Category;
  brand: {
    id: string;
    name: string;
    slug: string;
  };
  images: ProductImage[];
  specifications: ProductSpecification[];
}

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  stockStatus: string;
  images: ProductImage[];
  brand: {
    name: string;
  };
}

// Specification grouping for processors (matching TechLand layout)
const specificationGroups: Record<string, { title: string; keys: string[] }> = {
  processor: {
    title: 'Processor',
    keys: [
      'processor_model',
      'model_number',
      'generation',
      'number_of_cores',
      'number_of_threads',
      'base_clock',
      'boost_clock',
      'cache_size',
      'l2_cache',
      'socket_type',
    ],
  },
  memory: {
    title: 'Memory',
    keys: ['memory_type', 'max_memory_speed', 'max_memory_size', 'memory_channels'],
  },
  graphics: {
    title: 'Graphics',
    keys: ['integrated_graphics', 'gpu_frequency'],
  },
  power: {
    title: 'Power & Thermal',
    keys: ['tdp', 'max_turbo_power'],
  },
  features: {
    title: 'Features & Technology',
    keys: ['processor_features', 'pcie_version', 'unlocked', 'cooler_included'],
  },
  warranty: {
    title: 'Warranty Information',
    keys: ['warranty'],
  },
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'specification' | 'reviews'>('specification');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (slug) {
      setActiveTab('specification');
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products/${slug}`);
      
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Product not found');
        }
        throw new Error('Failed to fetch product');
      }

      const data = await res.json();
      setProduct(data.data);
      setRelatedProducts(data.relatedProducts || []);
    } catch (err: any) {
      console.error('Error fetching product:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (status: string) => {
    const statuses: Record<string, { text: string; color: string; bgColor: string }> = {
      IN_STOCK: { text: 'In Stock', color: 'text-green-700', bgColor: 'bg-green-100' },
      OUT_OF_STOCK: { text: 'Out of Stock', color: 'text-red-700', bgColor: 'bg-red-100' },
      PRE_ORDER: { text: 'Pre-Order', color: 'text-blue-700', bgColor: 'bg-blue-100' },
      UPCOMING: { text: 'Upcoming', color: 'text-purple-700', bgColor: 'bg-purple-100' },
    };
    return statuses[status] || { text: status, color: 'text-gray-700', bgColor: 'bg-gray-100' };
  };

  const getSpecValue = (key: string): string | null => {
    if (!product) return null;
    const spec = product.specifications.find(s => s.specificationDefinition.key === key);
    return spec?.value || null;
  };

  const getSpecName = (key: string): string => {
    if (!product) return key;
    const spec = product.specifications.find(s => s.specificationDefinition.key === key);
    return spec?.specificationDefinition.name || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Group specifications by category
  const groupedSpecifications = () => {
    if (!product) return [];

    const categorySlugs = getCategorySlugs(product.category);
    const groupsConfig = isGpuCategory(categorySlugs)
      ? GPU_SPECIFICATION_GROUPS
      : isMotherboardCategory(categorySlugs)
        ? MOTHERBOARD_SPECIFICATION_GROUPS
        : specificationGroups;

    const groups: { title: string; specs: { name: string; value: string }[] }[] = [];

    Object.entries(groupsConfig).forEach(([, group]) => {
      const specs = group.keys
        .map(key => {
          const value = getSpecValue(key);
          if (value) {
            return { name: getSpecName(key), value };
          }
          return null;
        })
        .filter(Boolean) as { name: string; value: string }[];

      if (specs.length > 0) {
        groups.push({ title: group.title, specs });
      }
    });

    // Add any remaining specifications that weren't in predefined groups
    const allGroupKeys = Object.values(groupsConfig).flatMap(g => g.keys);
    const remainingSpecs = product.specifications
      .filter(s => !allGroupKeys.includes(s.specificationDefinition.key))
      .map(s => ({ name: s.specificationDefinition.name, value: s.value }));

    if (remainingSpecs.length > 0) {
      groups.push({ title: 'Additional Specifications', specs: remainingSpecs });
    }

    return groups;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The product you are looking for does not exist.'}</p>
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.stockStatus);
  const categorySlugs = getCategorySlugs(product.category);
  const isGpu = isGpuCategory(categorySlugs);
  const isMotherboard = isMotherboardCategory(categorySlugs);
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;
  const savings = product.compareAtPrice ? product.compareAtPrice - product.price : 0;
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-[1400px] mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm flex-wrap">
            <Link href="/" className="text-gray-500 hover:text-blue-600">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <Link href="/products" className="text-gray-500 hover:text-blue-600">
              Components
            </Link>
            {product.category.breadcrumb?.map((cat, index) => (
              <span key={cat.id} className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="text-gray-500 hover:text-blue-600"
                >
                  {cat.name}
                </Link>
              </span>
            ))}
            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Related Products Sidebar (Left) */}
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Related Products - Desktop */}
          <div className="hidden xl:block w-[220px] flex-shrink-0">
            <h3 className="font-semibold text-gray-900 mb-4">Related Products</h3>
            <div className="space-y-4">
              {relatedProducts.slice(0, 8).map((relProduct) => (
                <Link
                  key={relProduct.id}
                  href={`/products/${relProduct.slug}`}
                  className="flex gap-3 p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                    {relProduct.images[0] && (
                      <img
                        src={relProduct.images[0].url}
                        alt={relProduct.name}
                        className="w-full h-full object-contain p-1"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 line-clamp-2">
                      {relProduct.name}
                    </p>
                    <p className="text-sm font-bold text-blue-600 mt-1">
                      ৳ {relProduct.price.toLocaleString()}
                    </p>
                    {relProduct.compareAtPrice && (
                      <p className="text-xs text-gray-500 line-through">
                        ৳ {relProduct.compareAtPrice.toLocaleString()}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Product Header Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Save Badge */}
              {savings > 0 && (
                <div className="bg-orange-500 text-white px-4 py-2 text-sm font-medium">
                  Save : ৳ {savings.toLocaleString()}
                </div>
              )}

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Product Images */}
                  <div>
                    {/* Main Image */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 aspect-square flex items-center justify-center">
                      {product.images[selectedImage] ? (
                        <img
                          src={product.images[selectedImage].url}
                          alt={product.images[selectedImage].alt || product.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <div className="text-gray-400">No Image Available</div>
                      )}
                    </div>

                    {/* Thumbnails */}
                    {product.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {product.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`w-16 h-16 flex-shrink-0 rounded-lg border-2 p-1 transition-all ${
                              selectedImage === index
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <img
                              src={image.url}
                              alt={image.alt || `${product.name} - ${index + 1}`}
                              className="w-full h-full object-contain"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div>
                    {/* Title */}
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 leading-snug">
                      {product.name}
                    </h1>

                    {/* GPU: boxed feature points + short description */}
                    {isGpu ? (
                      <GpuProductHighlights
                        sku={product.sku}
                        stockStatus={product.stockStatus}
                        stockLabel={stockStatus.text}
                        brand={product.brand}
                        productName={product.name}
                        getSpecValue={getSpecValue}
                      />
                    ) : (
                      <>
                        {/* Quick Info — other categories */}
                        <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${stockStatus.bgColor} ${stockStatus.color}`}>
                            {stockStatus.text}
                          </span>
                          <span className="text-gray-500">
                            PID: <span className="text-gray-900">{product.sku}</span>
                          </span>
                          <span className="text-gray-500">
                            Brand:{' '}
                            <Link href={`/brands/${product.brand.slug}`} className="text-blue-600 hover:underline">
                              {product.brand.name}
                            </Link>
                          </span>
                        </div>

                        {/* Key Specs Preview — processors etc. */}
                        <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm text-gray-600">
                          {getSpecValue('base_clock') && (
                            <p>Clock Speed: {getSpecValue('base_clock')} GHz up to {getSpecValue('boost_clock') || 'N/A'} GHz</p>
                          )}
                          {getSpecValue('cache_size') && <p>Cache: {getSpecValue('cache_size')}</p>}
                          {getSpecValue('socket_type') && <p>Socket: {getSpecValue('socket_type')}</p>}
                          {getSpecValue('number_of_cores') && (
                            <p>{getSpecValue('number_of_cores')} | {getSpecValue('number_of_threads') || 'N/A'}</p>
                          )}
                          {!getSpecValue('base_clock') && product.shortDescription && (
                            <p>{product.shortDescription}</p>
                          )}
                        </div>
                      </>
                    )}

                    {/* Reviews */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">(1 Reviews)</span>
                    </div>

                    {/* Price Alert */}
                    <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-4 flex items-center gap-2 text-red-700 text-sm">
                      <X className="w-4 h-4" />
                      Price valid only with PC bundle.
                    </div>

                    {/* Price Section */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <span className="text-sm text-gray-500 block mb-1">Discount Price</span>
                        <span className="text-2xl font-bold text-gray-900">
                          ৳ {product.price.toLocaleString()}
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ৳ {product.compareAtPrice.toLocaleString()}
                          </span>
                        )}
                        <p className="text-xs text-blue-600 mt-1 cursor-pointer hover:underline">
                          + Available Payment Method
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <span className="text-sm text-gray-500 block mb-1">EMI Start From*</span>
                        <span className="text-2xl font-bold text-gray-900">
                          ৳ {Math.round(product.price / 12).toLocaleString()}
                        </span>
                        <p className="text-xs text-blue-600 mt-1 cursor-pointer hover:underline">
                          📋 View Bank EMI Plans
                        </p>
                      </div>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex items-center gap-4 mb-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 font-medium">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Add to Cart */}
                      <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </button>

                      {/* Buy Now */}
                      <button className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium">
                        Buy Now
                      </button>
                    </div>

                    {/* Wishlist & Compare */}
                    <div className="flex items-center gap-4 mb-6">
                      <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                        <Heart className="w-5 h-5" />
                        Add to Wishlist
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                        <Share2 className="w-5 h-5" />
                        Share
                      </button>
                    </div>

                    {/* Product Disclaimer & Suggestions */}
                    <div className="space-y-2 text-sm">
                      <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                        <span className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-gray-500" />
                          Product Disclaimer
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                        <span className="flex items-center gap-2">
                          <RotateCcw className="w-4 h-4 text-gray-500" />
                          Any Suggestions?
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
              {/* Tab Headers */}
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('specification')}
                    className={`px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === 'specification'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Specification
                  </button>
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === 'description'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === 'reviews'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Reviews(1)
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Description Tab */}
                {activeTab === 'description' && (
                  <div>
                    {product.description ? (
                      <ProductDescription content={product.description} />
                    ) : product.shortDescription ? (
                      <ProductDescription content={product.shortDescription} />
                    ) : (
                      <p className="text-gray-500">No description available for this product.</p>
                    )}
                  </div>
                )}

                {/* Specification Tab */}
                {activeTab === 'specification' && (
                  <div className="space-y-6">
                    {groupedSpecifications().map((group, groupIndex) => (
                      <div key={groupIndex}>
                        <h3
                          className={`text-sm font-semibold px-4 py-2 rounded-t ${
                            isMotherboard
                              ? 'bg-gray-100 text-gray-900 border border-gray-200'
                              : 'text-white bg-[#1e3a5f]'
                          }`}
                        >
                          {group.title}
                        </h3>
                        <table className="w-full">
                          <tbody>
                            {group.specs.map((spec, specIndex) => (
                              <tr
                                key={specIndex}
                                className={`border-b border-gray-200 ${
                                  specIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                }`}
                              >
                                <td className="px-4 py-3 text-sm text-gray-600 w-1/3 font-medium">
                                  {spec.name}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 whitespace-pre-line">
                                  {spec.value}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}

                    {product.specifications.length === 0 && (
                      <p className="text-gray-500 text-center py-8">
                        No specifications available for this product.
                      </p>
                    )}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="text-center py-8 text-gray-500">
                      <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No reviews yet. Be the first to review this product!</p>
                      <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        Write a Review
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SEO Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                What is the {product.name} Price in Bangladesh 2026?
              </h2>
              <div className="prose prose-sm max-w-none text-gray-600">
                <p>
                  The {product.name} Price in BD is ৳{product.price.toLocaleString()}. 
                  This {product.brand.name} {product.category.name} Manufacturing by {product.brand.name} Comes With 
                  {getSpecValue('warranty') ? ` ${getSpecValue('warranty')} Warranty` : ' No Warranty'} & Based on {0} reviews. 
                  WS Computer City Offers you {product.name} by ৳{product.price.toLocaleString()} 
                  {product.compareAtPrice ? ` and its regular price is ৳${product.compareAtPrice.toLocaleString()}` : ''} Which is 
                  {product.stockStatus === 'IN_STOCK' ? ' also In Stock Now' : ' currently not in stock'} at our Showroom. 
                  Follow us on Facebook For Regular updates & Offer. Subscribe Our YouTube Channel for Product Reviews.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
