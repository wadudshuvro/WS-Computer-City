import { z } from 'zod';
import { StockStatus } from '@prisma/client';

// Product Image Schema
export const productImageSchema = z.object({
  url: z.string().url('Invalid image URL'),
  alt: z.string().optional(),
  order: z.number().int().min(0).default(0),
  isPrimary: z.boolean().default(false),
});

// Product Specification Schema - supports both database specs (with CUID) and category specs (with key)
export const productSpecificationSchema = z.union([
  // Database specification (with CUID)
  z.object({
    specificationDefinitionId: z.string().cuid('Invalid specification definition ID'),
    value: z.string().min(1, 'Specification value is required'),
  }),
  // Category-based specification (with key)
  z.object({
    key: z.string().min(1, 'Specification key is required'),
    value: z.string().min(1, 'Specification value is required'),
  }),
]);

// Helper to transform empty strings to undefined
const emptyStringToUndefined = z.string().transform((val) => val === '' ? undefined : val);

// Create Product Schema
const baseProductSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters').max(255),
  slug: z
    .string()
    .min(3)
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens'),
  sku: z
    .string()
    .min(3, 'SKU must be at least 3 characters')
    .max(100)
    .regex(/^[A-Z0-9-]+$/, 'SKU must be uppercase alphanumeric with hyphens'),
  description: z.string().optional().nullable(),
  shortDescription: z.string().max(500).optional().nullable(),
  
  // Pricing
  price: z.number().positive('Price must be positive'),
  compareAtPrice: z.number().positive().optional().nullable(),
  costPrice: z.number().positive().optional().nullable(),
  
  // Stock
  stockStatus: z.nativeEnum(StockStatus),
  stockQuantity: z.number().int().min(0, 'Stock quantity cannot be negative').default(0),
  lowStockAlert: z.number().int().min(0).default(5),
  
  // Relations
  categoryId: z.string().cuid('Invalid category ID'),
  brandId: z.string().cuid('Invalid brand ID'),
  
  // SEO
  metaTitle: z.string().max(60).optional().nullable(),
  metaDescription: z.string().max(160).optional().nullable(),
  metaKeywords: z.string().optional().nullable(),
  
  // Features
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  
  // Nested
  images: z.array(productImageSchema).min(1, 'At least one image is required'),
  specifications: z.array(productSpecificationSchema).optional(),
});

export const createProductSchema = baseProductSchema.refine(
  (data) => {
    // If compareAtPrice is provided, it must be greater than price
    if (data.compareAtPrice && data.compareAtPrice <= data.price) {
      return false;
    }
    return true;
  },
  {
    message: 'Compare at price must be greater than selling price',
    path: ['compareAtPrice'],
  }
);

// Update Product Schema (all fields optional)
export const updateProductSchema = baseProductSchema.partial();

// Product Filter Schema
export const productFilterSchema = z.object({
  category: z.string().optional(),
  brand: z.array(z.string()).or(z.string()).optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  stockStatus: z.array(z.nativeEnum(StockStatus)).or(z.nativeEnum(StockStatus)).optional(),
  search: z.string().optional(),
  sort: z.enum(['price_asc', 'price_desc', 'newest', 'name']).default('newest'),
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(20),
  specs: z.record(z.string()).optional(), // Dynamic specification filters
});

// Type exports
export type CreateProductDTO = z.infer<typeof createProductSchema>;
export type UpdateProductDTO = z.infer<typeof updateProductSchema>;
export type ProductFilterDTO = z.infer<typeof productFilterSchema>;
export type ProductImageDTO = z.infer<typeof productImageSchema>;
export type ProductSpecificationDTO = z.infer<typeof productSpecificationSchema>;
