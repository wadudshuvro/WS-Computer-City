'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  level: number;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
}

interface SpecDefinition {
  id: string;
  name: string;
  key: string;
  dataType: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'SELECT';
  unit?: string;
  isRequired: boolean;
  isFilterable: boolean;
}

interface ProductImage {
  url: string;
  alt?: string;
  order: number;
  isPrimary: boolean;
}

export default function ProductEntryForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [specDefinitions, setSpecDefinitions] = useState<SpecDefinition[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dbError, setDbError] = useState<string>('');
  const [dataLoading, setDataLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    slug: '',
    sku: '',
    shortDescription: '',
    description: '',
    
    // Pricing & Stock
    price: '',
    compareAtPrice: '',
    costPrice: '',
    stockStatus: 'IN_STOCK',
    stockQuantity: '0',
    lowStockAlert: '5',
    
    // Relations
    categoryId: '',
    brandId: '',
    
    // SEO
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    
    // Visibility
    isFeatured: false,
    isActive: true,
  });

  const [images, setImages] = useState<ProductImage[]>([]);
  const [specifications, setSpecifications] = useState<Record<string, string>>({});

  // Fetch categories and brands on mount
  useEffect(() => {
    async function loadData() {
      setDataLoading(true);
      await Promise.all([fetchCategories(), fetchBrands()]);
      setDataLoading(false);
    }
    loadData();
  }, []);

  // Fetch spec definitions when category changes
  useEffect(() => {
    if (formData.categoryId) {
      fetchSpecDefinitions(formData.categoryId);
    } else {
      setSpecDefinitions([]);
      setSpecifications({});
    }
  }, [formData.categoryId]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      const categoriesData = data.data || [];
      setCategories(categoriesData);
      
      if (categoriesData.length === 0) {
        setDbError('No categories found. Please run: npm run db:seed');
      }
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      setDbError(`Database Error: ${error.message}. Check DATABASE_SETUP_GUIDE.md`);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/admin/brands');
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      const brandsData = data.data || [];
      setBrands(brandsData);
      
      if (brandsData.length === 0 && !dbError) {
        setDbError('No brands found. Please run: npm run db:seed');
      }
    } catch (error: any) {
      console.error('Error fetching brands:', error);
      if (!dbError) {
        setDbError(`Database Error: ${error.message}. Check DATABASE_SETUP_GUIDE.md`);
      }
    }
  };

  const fetchSpecDefinitions = async (categoryId: string) => {
    try {
      const res = await fetch(`/api/admin/specification-definitions?categoryId=${categoryId}`);
      const data = await res.json();
      setSpecDefinitions(data.data || []);
    } catch (error) {
      console.error('Error fetching spec definitions:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Auto-generate slug from name
      if (name === 'name' && !formData.slug) {
        const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        setFormData(prev => ({ ...prev, slug }));
      }
      
      // Auto-generate SKU from name
      if (name === 'name' && !formData.sku) {
        const sku = value.toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 20);
        setFormData(prev => ({ ...prev, sku }));
      }
    }
  };

  const handleImageAdd = () => {
    setImages(prev => [...prev, { url: '', alt: '', order: prev.length, isPrimary: prev.length === 0 }]);
  };

  const handleImageChange = (index: number, field: keyof ProductImage, value: string | boolean) => {
    setImages(prev => {
      const newImages = [...prev];
      if (field === 'isPrimary' && value === true) {
        // Only one image can be primary
        newImages.forEach((img, i) => {
          img.isPrimary = i === index;
        });
      } else {
        newImages[index] = { ...newImages[index], [field]: value };
      }
      return newImages;
    });
  };

  const handleImageRemove = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSpecChange = (key: string, value: string) => {
    setSpecifications(prev => ({ ...prev, [key]: value }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = 'Product name is required';
    if (!formData.slug) newErrors.slug = 'Slug is required';
    if (!formData.sku) newErrors.sku = 'SKU is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.brandId) newErrors.brandId = 'Brand is required';
    if (images.length === 0) newErrors.images = 'At least one image is required';

    // Validate required specifications
    specDefinitions.forEach(spec => {
      if (spec.isRequired && !specifications[spec.id]) {
        newErrors[`spec_${spec.id}`] = `${spec.name} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
        stockQuantity: parseInt(formData.stockQuantity),
        lowStockAlert: parseInt(formData.lowStockAlert),
        images: images.filter(img => img.url),
        specifications: Object.entries(specifications).map(([specificationDefinitionId, value]) => ({
          specificationDefinitionId,
          value,
        })),
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to create product');
      }

      alert('Product created successfully!');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error creating product:', error);
      alert(error.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">
      {/* Database Error Alert */}
      {dbError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-lg font-medium text-red-800 mb-2">
                ⚠️ Database Not Set Up
              </h3>
              <p className="text-red-700 mb-3">{dbError}</p>
              <div className="bg-white p-4 rounded border border-red-200 text-sm">
                <p className="font-semibold text-red-900 mb-2">Quick Fix Options:</p>
                <ol className="list-decimal list-inside space-y-1 text-red-800">
                  <li><strong>Local PostgreSQL:</strong> Install from postgresql.org, then run: <code className="bg-red-100 px-2 py-1 rounded">npm run db:push && npm run db:seed</code></li>
                  <li><strong>Cloud Database (Easiest):</strong> Sign up at supabase.com (free), get connection string, add to .env, then seed</li>
                  <li><strong>Docker:</strong> Run: <code className="bg-red-100 px-2 py-1 rounded">docker run --name ws-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ws_computer_city -p 5432:5432 -d postgres</code></li>
                </ol>
                <p className="mt-3 text-red-700">
                  📖 See <strong>DATABASE_SETUP_GUIDE.md</strong> in the project root for detailed instructions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {dataLoading && !dbError && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-blue-700">Loading categories and brands...</p>
        </div>
      )}

      {/* Basic Product Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">1️⃣ Basic Product Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g., Intel Core i5-12600K Processor"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Product Slug *</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              placeholder="intel-core-i5-12600k"
            />
            {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">SKU *</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              placeholder="INTEL-I5-12600K"
            />
            {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {'\u00A0'.repeat(cat.level * 4)}{cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Brand *</label>
            <select
              name="brandId"
              value={formData.brandId}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Brand</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
            {errors.brandId && <p className="text-red-500 text-sm mt-1">{errors.brandId}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Short Description</label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Brief 1-2 line description"
              maxLength={500}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Full Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              rows={4}
              placeholder="Detailed product description..."
            />
          </div>
        </div>
      </div>

      {/* Pricing & Stock Management */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">2️⃣ Pricing & Stock Management</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Regular Price (BDT) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              placeholder="25000"
              step="0.01"
              min="0"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Compare at Price (BDT)</label>
            <input
              type="number"
              name="compareAtPrice"
              value={formData.compareAtPrice}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              placeholder="30000"
              step="0.01"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">Original price for discount display</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cost Price (BDT)</label>
            <input
              type="number"
              name="costPrice"
              value={formData.costPrice}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              placeholder="20000"
              step="0.01"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">For profit calculation</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Stock Status *</label>
            <select
              name="stockStatus"
              value={formData.stockStatus}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="IN_STOCK">In Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
              <option value="PRE_ORDER">Pre-Order</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="DISCONTINUED">Discontinued</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Stock Quantity</label>
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Low Stock Alert</label>
            <input
              type="number"
              name="lowStockAlert"
              value={formData.lowStockAlert}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">Alert when stock is low</p>
          </div>
        </div>
      </div>

      {/* Product Media */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">3️⃣ Product Media</h2>
        
        <div className="space-y-4">
          {images.map((image, index) => (
            <div key={index} className="flex gap-3 items-start p-4 border rounded">
              <div className="flex-1">
                <input
                  type="url"
                  value={image.url}
                  onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                  className="w-full border rounded px-3 py-2 mb-2"
                  placeholder="Image URL"
                />
                <input
                  type="text"
                  value={image.alt || ''}
                  onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Alt text (optional)"
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={image.isPrimary}
                  onChange={(e) => handleImageChange(index, 'isPrimary', e.target.checked)}
                />
                <span className="text-sm">Primary</span>
              </label>
              <button
                type="button"
                onClick={() => handleImageRemove(index)}
                className="text-red-600 hover:text-red-800 px-3 py-2"
              >
                Remove
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={handleImageAdd}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            + Add Image
          </button>
          {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
        </div>
      </div>

      {/* Dynamic Specifications */}
      {specDefinitions.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">4️⃣ Product Specifications</h2>
          <p className="text-sm text-gray-600 mb-4">Specifications based on selected category</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specDefinitions.map(spec => (
              <div key={spec.id}>
                <label className="block text-sm font-medium mb-1">
                  {spec.name} {spec.isRequired && '*'}
                  {spec.unit && <span className="text-gray-500"> ({spec.unit})</span>}
                </label>
                
                {spec.dataType === 'BOOLEAN' ? (
                  <select
                    value={specifications[spec.id] || ''}
                    onChange={(e) => handleSpecChange(spec.id, e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                ) : spec.dataType === 'NUMBER' ? (
                  <input
                    type="number"
                    value={specifications[spec.id] || ''}
                    onChange={(e) => handleSpecChange(spec.id, e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    step="any"
                  />
                ) : (
                  <input
                    type="text"
                    value={specifications[spec.id] || ''}
                    onChange={(e) => handleSpecChange(spec.id, e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                )}
                
                {errors[`spec_${spec.id}`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`spec_${spec.id}`]}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEO & Meta Data */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">5️⃣ SEO & Meta Data</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Meta Title</label>
            <input
              type="text"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              maxLength={60}
              placeholder="Leave empty to use product name"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.metaTitle.length}/60 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Meta Description</label>
            <textarea
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              rows={2}
              maxLength={160}
              placeholder="Leave empty to use short description"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.metaDescription.length}/160 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Meta Keywords</label>
            <input
              type="text"
              name="metaKeywords"
              value={formData.metaKeywords}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              placeholder="processor, intel, gaming, cpu"
            />
          </div>
        </div>
      </div>

      {/* Visibility & Control */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">6️⃣ Visibility & Control</h2>
        
        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleInputChange}
            />
            <span className="text-sm font-medium">Featured Product (Show on homepage)</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
            />
            <span className="text-sm font-medium">Product Active (Published)</span>
          </label>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border rounded-lg hover:bg-gray-50"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
