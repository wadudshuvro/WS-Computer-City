'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  categoryHierarchy, 
  getSpecificationsForCategory, 
  SpecificationField,
  MainCategorySlug 
} from '@/lib/categoryConfig';

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

  // Category selection state
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');

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
  const [categorySpecifications, setCategorySpecifications] = useState<Record<string, string | string[]>>({});

  // Get main categories from hierarchy
  const mainCategories = Object.entries(categoryHierarchy).map(([key, value]) => ({
    id: key,
    name: value.name,
    slug: key,
  }));

  // Get sub-categories based on selected main category
  const subCategories = useMemo(() => {
    if (!selectedMainCategory || !categoryHierarchy[selectedMainCategory]) {
      return [];
    }
    return categoryHierarchy[selectedMainCategory].subCategories;
  }, [selectedMainCategory]);

  // Get category-specific specifications
  const categorySpecs = useMemo(() => {
    if (!selectedMainCategory) return [];
    return getSpecificationsForCategory(
      selectedMainCategory as MainCategorySlug, 
      selectedSubCategory
    );
  }, [selectedMainCategory, selectedSubCategory]);

  // Fetch categories and brands on mount
  useEffect(() => {
    async function loadData() {
      setDataLoading(true);
      await Promise.all([fetchCategories(), fetchBrands()]);
      setDataLoading(false);
    }
    loadData();
  }, []);

  // Fetch spec definitions when category changes (from database)
  useEffect(() => {
    if (formData.categoryId) {
      fetchSpecDefinitions(formData.categoryId);
    } else {
      setSpecDefinitions([]);
      setSpecifications({});
    }
  }, [formData.categoryId]);

  // Reset sub-category when main category changes
  useEffect(() => {
    setSelectedSubCategory('');
    setCategorySpecifications({});
  }, [selectedMainCategory]);

  // Update categoryId based on sub-category selection (find matching category in DB)
  useEffect(() => {
    if (selectedSubCategory && categories.length > 0) {
      // Find the category that matches the selected sub-category slug
      const matchingCategory = categories.find(cat => 
        cat.slug === selectedSubCategory || 
        cat.name.toLowerCase().includes(selectedSubCategory.toLowerCase())
      );
      if (matchingCategory) {
        setFormData(prev => ({ ...prev, categoryId: matchingCategory.id }));
      }
    }
  }, [selectedSubCategory, categories]);

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

  const handleMainCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedMainCategory(value);
    // Clear the categoryId when main category changes
    setFormData(prev => ({ ...prev, categoryId: '' }));
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedSubCategory(value);
  };

  const handleCategorySpecChange = (key: string, value: string | string[]) => {
    setCategorySpecifications(prev => ({ ...prev, [key]: value }));
  };

  const handleMultiSelectChange = (key: string, value: string, checked: boolean) => {
    setCategorySpecifications(prev => {
      const current = (prev[key] as string[]) || [];
      if (checked) {
        return { ...prev, [key]: [...current, value] };
      } else {
        return { ...prev, [key]: current.filter(v => v !== value) };
      }
    });
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
    
    // Validate compare at price (must be greater than regular price if provided)
    if (formData.compareAtPrice) {
      const price = parseFloat(formData.price);
      const comparePrice = parseFloat(formData.compareAtPrice);
      if (comparePrice <= price) {
        newErrors.compareAtPrice = 'Compare at Price must be greater than Regular Price (or leave empty)';
      }
    }
    
    if (!selectedMainCategory) newErrors.mainCategory = 'Main category is required';
    if (!selectedSubCategory) newErrors.subCategory = 'Sub-category is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.brandId) newErrors.brandId = 'Brand is required';
    if (images.length === 0) newErrors.images = 'At least one image is required';

    // Validate required category specifications
    categorySpecs.forEach(spec => {
      if (spec.required && !categorySpecifications[spec.key]) {
        newErrors[`catSpec_${spec.key}`] = `${spec.name} is required`;
      }
    });

    // Validate required database specifications
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
      // Combine database specs with category-specific specs
      // Filter out empty values to prevent validation errors
      const dbSpecifications = Object.entries(specifications)
        .filter(([_, value]) => value && value.trim() !== '')
        .map(([specificationDefinitionId, value]) => ({
          specificationDefinitionId,
          value: value.trim(),
        }));

      const categorySpecs = Object.entries(categorySpecifications)
        .filter(([_, value]) => {
          if (Array.isArray(value)) return value.length > 0;
          return value && String(value).trim() !== '';
        })
        .map(([key, value]) => ({
          key,
          value: Array.isArray(value) ? value.join(', ') : String(value).trim(),
        }));

      const allSpecifications = [...dbSpecifications, ...categorySpecs];

      const payload = {
        name: formData.name,
        slug: formData.slug,
        sku: formData.sku,
        description: formData.description || undefined,
        shortDescription: formData.shortDescription || undefined,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
        stockStatus: formData.stockStatus,
        stockQuantity: parseInt(formData.stockQuantity),
        lowStockAlert: parseInt(formData.lowStockAlert),
        categoryId: formData.categoryId,
        brandId: formData.brandId,
        metaTitle: formData.metaTitle || undefined,
        metaDescription: formData.metaDescription || undefined,
        metaKeywords: formData.metaKeywords || undefined,
        isFeatured: formData.isFeatured,
        isActive: formData.isActive,
        images: images.filter(img => img.url).map(img => ({
          url: img.url,
          alt: img.alt || undefined,
          order: img.order,
          isPrimary: img.isPrimary,
        })),
        specifications: allSpecifications.length > 0 ? allSpecifications : undefined,
      };

      // Debug: Log the payload
      console.log('=== PRODUCT SUBMISSION DEBUG ===');
      console.log('categoryId:', payload.categoryId);
      console.log('brandId:', payload.brandId);
      console.log('name:', payload.name);
      console.log('slug:', payload.slug);
      console.log('sku:', payload.sku);
      console.log('price:', payload.price, typeof payload.price);
      console.log('images:', payload.images);
      console.log('Full payload:', JSON.stringify(payload, null, 2));
      console.log('=================================');

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        // Show detailed validation errors
        if (data.error?.details && Array.isArray(data.error.details)) {
          console.error('Validation errors:', JSON.stringify(data.error.details, null, 2));
          const errorMessages = data.error.details
            .map((e: any) => {
              const path = e.path?.join('.') || 'Field';
              return `• ${path}: ${e.message}`;
            })
            .join('\n');
          alert(`Validation failed:\n\n${errorMessages}`);
          return;
        }
        alert(data.error?.message || 'Failed to create product');
        return;
      }

      alert('Product created successfully!');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error creating product:', error.message || error);
      alert(error.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  // Render specification field based on type
  const renderSpecField = (spec: SpecificationField) => {
    const value = categorySpecifications[spec.key];
    const error = errors[`catSpec_${spec.key}`];

    switch (spec.type) {
      case 'select':
        return (
          <div key={spec.key}>
            <label className="block text-sm font-medium mb-1">
              {spec.name} {spec.required && <span className="text-red-500">*</span>}
              {spec.unit && <span className="text-gray-500 text-xs ml-1">({spec.unit})</span>}
            </label>
            <select
              value={(value as string) || ''}
              onChange={(e) => handleCategorySpecChange(spec.key, e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select {spec.name}</option>
              {spec.options?.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {spec.helpText && <p className="text-xs text-gray-500 mt-1">{spec.helpText}</p>}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      case 'multiselect':
        return (
          <div key={spec.key} className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              {spec.name} {spec.required && <span className="text-red-500">*</span>}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-3 border rounded-lg bg-gray-50 max-h-48 overflow-y-auto">
              {spec.options?.map(opt => (
                <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-white p-1 rounded">
                  <input
                    type="checkbox"
                    checked={((value as string[]) || []).includes(opt)}
                    onChange={(e) => handleMultiSelectChange(spec.key, opt, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="truncate">{opt}</span>
                </label>
              ))}
            </div>
            {spec.helpText && <p className="text-xs text-gray-500 mt-1">{spec.helpText}</p>}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      case 'boolean':
        return (
          <div key={spec.key}>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value === 'true'}
                onChange={(e) => handleCategorySpecChange(spec.key, e.target.checked ? 'true' : 'false')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
              />
              <span className="text-sm font-medium">{spec.name}</span>
            </label>
            {spec.helpText && <p className="text-xs text-gray-500 mt-1 ml-7">{spec.helpText}</p>}
          </div>
        );

      case 'number':
        return (
          <div key={spec.key}>
            <label className="block text-sm font-medium mb-1">
              {spec.name} {spec.required && <span className="text-red-500">*</span>}
              {spec.unit && <span className="text-gray-500 text-xs ml-1">({spec.unit})</span>}
            </label>
            <input
              type="number"
              value={(value as string) || ''}
              onChange={(e) => handleCategorySpecChange(spec.key, e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={spec.placeholder}
              step="0.1"
            />
            {spec.helpText && <p className="text-xs text-gray-500 mt-1">{spec.helpText}</p>}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      default:
        return (
          <div key={spec.key}>
            <label className="block text-sm font-medium mb-1">
              {spec.name} {spec.required && <span className="text-red-500">*</span>}
              {spec.unit && <span className="text-gray-500 text-xs ml-1">({spec.unit})</span>}
            </label>
            <input
              type="text"
              value={(value as string) || ''}
              onChange={(e) => handleCategorySpecChange(spec.key, e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={spec.placeholder}
            />
            {spec.helpText && <p className="text-xs text-gray-500 mt-1">{spec.helpText}</p>}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-8">
      {/* Database Error Alert */}
      {dbError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
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
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
          <p className="text-blue-700">Loading categories and brands...</p>
        </div>
      )}

      {/* ========== SECTION 1: Category Selection ========== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold">
            1
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Category Selection</h2>
            <p className="text-sm text-gray-500">Select main category and sub-category</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Category <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedMainCategory}
              onChange={handleMainCategoryChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
            >
              <option value="">Select Main Category</option>
              {mainCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.mainCategory && <p className="text-red-500 text-sm mt-1">{errors.mainCategory}</p>}
          </div>

          {/* Sub Category - Dynamic based on Main Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sub-Category <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedSubCategory}
              onChange={handleSubCategoryChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={!selectedMainCategory}
            >
              <option value="">
                {selectedMainCategory ? 'Select Sub-Category' : 'Select Main Category First'}
              </option>
              {subCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.subCategory && <p className="text-red-500 text-sm mt-1">{errors.subCategory}</p>}
            {selectedMainCategory && subCategories.length === 0 && (
              <p className="text-yellow-600 text-sm mt-1">No sub-categories available for this main category</p>
            )}
          </div>

          {/* Brand Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand <span className="text-red-500">*</span>
            </label>
            <select
              name="brandId"
              value={formData.brandId}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
            >
              <option value="">Select Brand</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
            {errors.brandId && <p className="text-red-500 text-sm mt-1">{errors.brandId}</p>}
          </div>

          {/* Hidden field for actual category ID from database */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Database Category <span className="text-gray-400 text-xs">(Auto-selected)</span>
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
            >
              <option value="">Select Category from DB</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {'\u00A0'.repeat(cat.level * 4)}{cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
          </div>
        </div>
      </div>

      {/* ========== SECTION 2: Basic Product Information ========== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
            2
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Basic Product Information</h2>
            <p className="text-sm text-gray-500">Enter the basic details of the product</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Intel Core i5-14600K Processor"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="intel-core-i5-14600k"
            />
            {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SKU <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="INTEL-I5-14600K"
            />
            {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief 1-2 line description"
              maxLength={500}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Detailed product description..."
            />
          </div>
        </div>
      </div>

      {/* ========== SECTION 3: Category-Specific Specifications (Dynamic) ========== */}
      {categorySpecs.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold">
              3
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {categoryHierarchy[selectedMainCategory]?.name || 'Product'} Specifications
              </h2>
              <p className="text-sm text-gray-500">
                Specifications specific to {selectedSubCategory ? subCategories.find(s => s.id === selectedSubCategory)?.name : 'this category'}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorySpecs.map(spec => renderSpecField(spec))}
          </div>
        </div>
      )}

      {/* ========== SECTION 4: Pricing & Stock Management ========== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold">
            {categorySpecs.length > 0 ? '4' : '3'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Pricing & Stock Management</h2>
            <p className="text-sm text-gray-500">Set pricing and inventory details</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Regular Price (BDT) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">৳</span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="25000"
                step="0.01"
                min="0"
              />
            </div>
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Compare at Price (BDT)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">৳</span>
              <input
                type="number"
                name="compareAtPrice"
                value={formData.compareAtPrice}
                onChange={handleInputChange}
                className={`w-full border rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.compareAtPrice ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="30000"
                step="0.01"
                min="0"
              />
            </div>
            {errors.compareAtPrice ? (
              <p className="text-red-500 text-sm mt-1">{errors.compareAtPrice}</p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">Original/strikethrough price (must be higher than Regular Price)</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cost Price (BDT)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">৳</span>
              <input
                type="number"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="20000"
                step="0.01"
                min="0"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">For profit calculation</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Status <span className="text-red-500">*</span>
            </label>
            <select
              name="stockStatus"
              value={formData.stockStatus}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="IN_STOCK">In Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
              <option value="PRE_ORDER">Pre-Order</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="DISCONTINUED">Discontinued</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Alert</label>
            <input
              type="number"
              name="lowStockAlert"
              value={formData.lowStockAlert}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">Alert when stock is low</p>
          </div>
        </div>
      </div>

      {/* ========== SECTION 5: Product Media ========== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-white font-bold">
            {categorySpecs.length > 0 ? '5' : '4'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Product Media</h2>
            <p className="text-sm text-gray-500">Add product images</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {images.map((image, index) => (
            <div key={index} className="flex gap-4 items-start p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex-1 space-y-3">
                <input
                  type="url"
                  value={image.url}
                  onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Image URL (https://...)"
                />
                <input
                  type="text"
                  value={image.alt || ''}
                  onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Alt text (optional)"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={image.isPrimary}
                  onChange={(e) => handleImageChange(index, 'isPrimary', e.target.checked)}
                  className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
                <span className="text-sm font-medium">Primary</span>
              </label>
              <button
                type="button"
                onClick={() => handleImageRemove(index)}
                className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={handleImageAdd}
            className="w-full border-2 border-dashed border-gray-300 text-gray-600 px-4 py-4 rounded-lg hover:border-pink-400 hover:text-pink-600 transition-colors"
          >
            + Add Image
          </button>
          {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
        </div>
      </div>

      {/* ========== SECTION 6: Database Specifications (if any) ========== */}
      {specDefinitions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold">
              {categorySpecs.length > 0 ? '6' : '5'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Additional Specifications</h2>
              <p className="text-sm text-gray-500">Specifications from database for this category</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {specDefinitions.map(spec => (
              <div key={spec.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {spec.name} {spec.isRequired && <span className="text-red-500">*</span>}
                  {spec.unit && <span className="text-gray-500 text-xs ml-1">({spec.unit})</span>}
                </label>
                
                {spec.dataType === 'BOOLEAN' ? (
                  <select
                    value={specifications[spec.id] || ''}
                    onChange={(e) => handleSpecChange(spec.id, e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    step="any"
                  />
                ) : (
                  <input
                    type="text"
                    value={specifications[spec.id] || ''}
                    onChange={(e) => handleSpecChange(spec.id, e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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

      {/* ========== SECTION 7: SEO & Meta Data ========== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-bold">
            {categorySpecs.length > 0 ? (specDefinitions.length > 0 ? '7' : '6') : (specDefinitions.length > 0 ? '6' : '5')}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">SEO & Meta Data</h2>
            <p className="text-sm text-gray-500">Optimize for search engines</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
            <input
              type="text"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              maxLength={60}
              placeholder="Leave empty to use product name"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.metaTitle.length}/60 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
            <textarea
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              rows={2}
              maxLength={160}
              placeholder="Leave empty to use short description"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.metaDescription.length}/160 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Meta Keywords</label>
            <input
              type="text"
              name="metaKeywords"
              value={formData.metaKeywords}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="processor, intel, gaming, cpu"
            />
          </div>
        </div>
      </div>

      {/* ========== SECTION 8: Visibility & Control ========== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white font-bold">
            {categorySpecs.length > 0 ? (specDefinitions.length > 0 ? '8' : '7') : (specDefinitions.length > 0 ? '7' : '6')}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Visibility & Control</h2>
            <p className="text-sm text-gray-500">Control product visibility</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Featured Product</span>
              <p className="text-xs text-gray-500">Show this product on the homepage featured section</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Product Active (Published)</span>
              <p className="text-xs text-gray-500">Make this product visible on the store</p>
            </div>
          </label>
        </div>
      </div>

      {/* ========== Submit Buttons ========== */}
      <div className="flex gap-4 justify-end sticky bottom-4 bg-white p-4 rounded-xl shadow-lg border border-gray-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating...
            </span>
          ) : (
            'Create Product'
          )}
        </button>
      </div>
    </form>
  );
}
