import { describe, expect, it } from 'vitest';
import {
  breadcrumbJsonLd,
  listingShouldNoindex,
  productJsonLd,
  productMetaDescription,
  productPath,
  productSeoFields,
  productTitle,
  schemaAvailability,
  sitemapAllows,
  slugChangeRedirects,
} from './catalogSeo';

const sample = {
  name: 'Corsair 3500X RS-R ARGB E-ATX Mid-Tower Casing',
  slug: 'corsair-3500x-rs-r-argb-casing',
  sku: 'CASE-1',
  shortDescription: 'Mid-tower case with tempered glass and three ARGB fans.',
  price: 10500,
  stockStatus: 'IN_STOCK',
  categorySlug: 'computer-case',
  categoryName: 'Casing',
  brandName: 'Corsair',
  images: ['/uploads/casings/corsair-3500x-rs-r-argb-casing.webp'],
};

describe('catalog SEO', () => {
  it('builds a unique title, canonical path, and Product JSON-LD', () => {
    expect(productTitle(sample.name).length).toBeLessThanOrEqual(60);
    expect(productPath(sample.categorySlug, sample.slug)).toBe(
      '/computer-case/corsair-3500x-rs-r-argb-casing'
    );
    const json = productJsonLd(sample) as {
      '@type': string;
      aggregateRating?: unknown;
      review?: unknown;
      offers: { priceCurrency: string; price: number; availability: string };
    };
    expect(json['@type']).toBe('Product');
    expect(json.offers.priceCurrency).toBe('BDT');
    expect(json.offers.price).toBe(10500);
    expect(json.offers.availability).toBe('https://schema.org/InStock');
    expect(json.aggregateRating).toBeUndefined();
    expect(json.review).toBeUndefined();
    expect(JSON.parse(JSON.stringify(json)).name).toBe(sample.name);
  });

  it('omits ratings when there are no reviews', () => {
    expect(productJsonLd(sample)).not.toHaveProperty('aggregateRating');
  });

  it('marks filter URLs as noindex and keeps a clean category path indexable', () => {
    expect(listingShouldNoindex({ sub: 'computer-case', brand: 'corsair' })).toBe(true);
    expect(listingShouldNoindex({ sub: 'computer-case', sort: 'price_asc' })).toBe(true);
    expect(listingShouldNoindex({ sub: 'computer-case', page: '2' })).toBe(false);
  });

  it('matches out-of-stock schema to the visible state', () => {
    expect(schemaAvailability('OUT_OF_STOCK')).toBe('https://schema.org/OutOfStock');
    expect(productMetaDescription({ name: 'Sample SSD', price: 2500 }).length).toBeLessThanOrEqual(160);
    const fields = productSeoFields({
      name: sample.name,
      brand: sample.brandName,
      category: sample.categoryName,
      price: sample.price,
      shortDescription: sample.shortDescription,
    });
    expect(fields.metaTitle.length).toBeLessThanOrEqual(60);
    expect(fields.metaDescription.length).toBeLessThanOrEqual(160);
    expect(fields.metaKeywords).toContain('Corsair');
    expect(fields.metaDescription.toLowerCase()).not.toContain('price in bangladesh');
  });

  it('records a 301 target when a slug changes and keeps cart out of the sitemap', () => {
    const redirects = slugChangeRedirects({
      previousCategorySlug: 'computer-case',
      previousSlug: 'old-case',
      nextCategorySlug: 'computer-case',
      nextSlug: 'new-case',
    });
    expect(redirects[0]).toEqual({ fromPath: '/products/old-case', toPath: '/computer-case/new-case' });
    expect(sitemapAllows('/computer-case/new-case')).toBe(true);
    expect(sitemapAllows('/cart')).toBe(false);
  });
  it('builds a breadcrumb that matches the URL', () => {
    const crumb = breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Casing', path: '/computer-case' },
      { name: sample.name, path: productPath(sample.categorySlug, sample.slug) },
    ]);
    expect(crumb.itemListElement).toHaveLength(3);
    expect(crumb.itemListElement[2]!.item).toContain('/computer-case/corsair-3500x-rs-r-argb-casing');
  });
});
