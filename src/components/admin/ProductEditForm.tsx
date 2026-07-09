'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  categoryHierarchy, 
  getSpecificationsForCategory, 
  resolveCategoryFromDbSlug,
  inferGpuSubCategory,
  resolveDbCategorySlugForForm,
  groupSpecificationFieldsBySection,
  SpecificationField,
  MainCategorySlug 
} from '@/lib/categoryConfig';
import {
  filterBrandsForComponent,
  hasComponentBrandFilter,
} from '@/lib/componentBrandConfig';

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

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  shortDescription: string | null;
  price: number;
  compareAtPrice: number | null;
  costPrice: number | null;
  stockStatus: string;
  stockQuantity: number;
  lowStockAlert: number;
  categoryId: string;
  brandId: string;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  isFeatured: boolean;
  isActive: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    parent?: {
      id: string;
      name: string;
      slug: string;
    };
  };
  brand: {
    id: string;
    name: string;
    slug: string;
  };
  images: Array<{
    id: string;
    url: string;
    alt: string | null;
    order: number;
    isPrimary: boolean;
  }>;
  specifications: Array<{
    id: string;
    value: string;
    specificationDefinition: {
      id: string;
      key: string;
      name: string;
      dataType: string;
      unit: string | null;
    };
  }>;
}

interface ProductEditFormProps {
  product: Product;
}

export default function ProductEditForm({ product }: ProductEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [specDefinitions, setSpecDefinitions] = useState<SpecDefinition[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dataLoading, setDataLoading] = useState(true);

  const resolvedCategory = resolveCategoryFromDbSlug(
    product.category.slug,
    product.category.parent?.slug
  );

  // Category selection state — map DB slug (e.g. graphics-card) to form key (graphics_card)
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>(resolvedCategory.mainCategory);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(resolvedCategory.subCategory);

  // Form state - initialized with product data
  const [formData, setFormData] = useState({
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    shortDescription: product.shortDescription || '',
    description: product.description || '',
    price: product.price.toString(),
    compareAtPrice: product.compareAtPrice?.toString() || '',
    costPrice: product.costPrice?.toString() || '',
    stockStatus: product.stockStatus,
    stockQuantity: product.stockQuantity.toString(),
    lowStockAlert: product.lowStockAlert.toString(),
    categoryId: product.categoryId,
    brandId: product.brandId,
    metaTitle: product.metaTitle || '',
    metaDescription: product.metaDescription || '',
    metaKeywords: product.metaKeywords || '',
    isFeatured: product.isFeatured,
    isActive: product.isActive,
  });

  // Initialize images from product
  const [images, setImages] = useState<ProductImage[]>(
    product.images.map(img => ({
      url: img.url,
      alt: img.alt || '',
      order: img.order,
      isPrimary: img.isPrimary,
    }))
  );

  // Initialize specifications from product
  const [specifications, setSpecifications] = useState<Record<string, string>>(() => {
    const specs: Record<string, string> = {};
    product.specifications.forEach(spec => {
      specs[spec.specificationDefinition.id] = spec.value;
    });
    return specs;
  });

  // Category specifications
  const [categorySpecifications, setCategorySpecifications] = useState<Record<string, string | string[]>>(() => {
    const catSpecs: Record<string, string | string[]> = {};
    product.specifications.forEach(spec => {
      const value = spec.value;
      // Check if it's a comma-separated list (multiselect)
      if (value.includes(', ')) {
        catSpecs[spec.specificationDefinition.key] = value.split(', ');
      } else {
        catSpecs[spec.specificationDefinition.key] = value;
      }
    });
    return catSpecs;
  });

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
    const subCategory =
      selectedMainCategory === 'graphics_card'
        ? inferGpuSubCategory(selectedSubCategory, categorySpecifications)
        : selectedSubCategory;
    return getSpecificationsForCategory(
      selectedMainCategory as MainCategorySlug,
      subCategory
    );
  }, [selectedMainCategory, selectedSubCategory, categorySpecifications]);

  const visibleBrands = useMemo(
    () =>
      filterBrandsForComponent(brands, selectedMainCategory, {
        includeBrandId: formData.brandId,
      }),
    [brands, selectedMainCategory, formData.brandId]
  );

  const groupedCategorySpecs = useMemo(
    () => groupSpecificationFieldsBySection(categorySpecs),
    [categorySpecs]
  );

  // Sync sub-category from product specs when on graphics-card without a sub
  useEffect(() => {
    if (selectedMainCategory === 'graphics_card' && !selectedSubCategory) {
      const inferred = inferGpuSubCategory('', categorySpecifications);
      if (inferred) setSelectedSubCategory(inferred);
    }
  }, [selectedMainCategory, selectedSubCategory, categorySpecifications]);

  // Sync database category from main/sub selection
  useEffect(() => {
    if (!selectedMainCategory || categories.length === 0) return;

    const targetSlug = resolveDbCategorySlugForForm(
      selectedMainCategory as MainCategorySlug,
      selectedSubCategory || undefined
    );
    if (!targetSlug) return;

    const matchingCategory = categories.find((cat) => cat.slug === targetSlug);
    if (matchingCategory) {
      setFormData((prev) =>
        prev.categoryId === matchingCategory.id
          ? prev
          : { ...prev, categoryId: matchingCategory.id }
      );
    }
  }, [selectedMainCategory, selectedSubCategory, categories]);

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
    }
  }, [formData.categoryId]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/admin/brands');
      if (!res.ok) throw new Error('Failed to fetch brands');
      const data = await res.json();
      setBrands(data.data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
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
    }
  };

  const handleMainCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedMainCategory(value);
    setSelectedSubCategory('');
    setCategorySpecifications({});
    setFormData((prev) => ({ ...prev, brandId: '' }));
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
      // Combine specifications
      const categorySpecKeys = new Set(categorySpecs.map((s) => s.key));
      const allSpecifications = [
        ...Object.entries(specifications)
          .filter(([specId, value]) => {
            if (!value?.trim()) return false;
            const def = specDefinitions.find((d) => d.id === specId);
            return !def || !categorySpecKeys.has(def.key);
          })
          .map(([specificationDefinitionId, value]) => ({
            specificationDefinitionId,
            value,
          })),
        ...Object.entries(categorySpecifications)
          .filter(([_, value]) => {
            if (Array.isArray(value)) return value.length > 0;
            return value && String(value).trim() !== '';
          })
          .map(([key, value]) => ({
            key,
            value: Array.isArray(value) ? value.join(', ') : String(value),
          })),
      ];

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
        stockQuantity: parseInt(formData.stockQuantity),
        lowStockAlert: parseInt(formData.lowStockAlert),
        images: images.filter(img => img.url),
        specifications: allSpecifications,
      };

      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to update product');
      }

      alert('Product updated successfully!');
      const categorySlug = product.category.slug;
      router.push(`/admin/products/category/${categorySlug}`);
    } catch (error: any) {
      console.error('Error updating product:', error);
      alert(error.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  // Render specification field
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

      case 'textarea':
        return (
          <div key={spec.key} className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              {spec.name} {spec.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={(value as string) || ''}
              onChange={(e) => handleCategorySpecChange(spec.key, e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={spec.placeholder}
              rows={4}
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
      {/* Loading State */}
      {dataLoading && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
          <p className="text-blue-700">Loading form data...</p>
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sub-Category <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedSubCategory}
              onChange={handleSubCategoryChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white disabled:bg-gray-100"
              disabled={!selectedMainCategory}
            >
              <option value="">Select Sub-Category</option>
              {subCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand <span className="text-red-500">*</span>
            </label>
            <select
              name="brandId"
              value={formData.brandId}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={!selectedMainCategory}
            >
              <option value="">
                {selectedMainCategory ? 'Select Brand' : 'Select Main Category First'}
              </option>
              {visibleBrands.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
            {selectedMainCategory && hasComponentBrandFilter(selectedMainCategory) && visibleBrands.length === 0 && (
              <p className="text-amber-600 text-sm mt-1">
                No brands found for this category. Run <code className="text-xs">npm run db:seed</code> to add them.
              </p>
            )}
            {errors.brandId && <p className="text-red-500 text-sm mt-1">{errors.brandId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Database Category
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
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
              rows={8}
              placeholder="Write your description here. Leave a blank line between paragraphs for better readability on the product page."
            />
            <p className="text-xs text-gray-500 mt-1">Tip: Press Enter twice between paragraphs so they display separately on the storefront.</p>
          </div>
        </div>
      </div>

      {/* ========== SECTION 3: Category-Specific Specifications ========== */}
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
              <p className="text-sm text-gray-500">Category-specific specifications</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {groupedCategorySpecs.map((group) => (
              <div key={group.title}>
                <div className="bg-gray-100 border border-gray-200 px-4 py-2 rounded-t">
                  <h3 className="text-sm font-semibold text-gray-800">{group.title}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-t-0 border-gray-200 rounded-b bg-white">
                  {group.specs.map((spec) => renderSpecField(spec))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========== SECTION 4: Pricing & Stock ========== */}
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
                step="0.01"
                min="0"
              />
            </div>
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Compare at Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">৳</span>
              <input
                type="number"
                name="compareAtPrice"
                value={formData.compareAtPrice}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cost Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">৳</span>
              <input
                type="number"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stock Status</label>
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
            <p className="text-sm text-gray-500">Manage product images</p>
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
                  placeholder="Image URL"
                />
                <input
                  type="text"
                  value={image.alt || ''}
                  onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Alt text"
                />
              </div>
              {image.url && (
                <div className="w-20 h-20 bg-white rounded border overflow-hidden">
                  <img src={image.url} alt={image.alt || ''} className="w-full h-full object-contain" />
                </div>
              )}
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
                className="text-red-600 hover:text-red-800 px-3 py-2 rounded-lg"
              >
                Remove
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={handleImageAdd}
            className="w-full border-2 border-dashed border-gray-300 text-gray-600 px-4 py-4 rounded-lg hover:border-pink-400 hover:text-pink-600"
          >
            + Add Image
          </button>
        </div>
      </div>

      {/* ========== SECTION 6: SEO & Meta Data ========== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-bold">
            {categorySpecs.length > 0 ? '6' : '5'}
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
            />
          </div>
        </div>
      </div>

      {/* ========== SECTION 7: Visibility ========== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white font-bold">
            {categorySpecs.length > 0 ? '7' : '6'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Visibility & Control</h2>
            <p className="text-sm text-gray-500">Control product visibility</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Featured Product</span>
              <p className="text-xs text-gray-500">Show on homepage featured section</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Product Active (Published)</span>
              <p className="text-xs text-gray-500">Make visible on the store</p>
            </div>
          </label>
        </div>
      </div>

      {/* ========== Submit Buttons ========== */}
      <div className="flex gap-4 justify-end sticky bottom-4 bg-white p-4 rounded-xl shadow-lg border border-gray-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 font-medium disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Updating...
            </span>
          ) : (
            'Update Product'
          )}
        </button>
      </div>
    </form>
  );
}
