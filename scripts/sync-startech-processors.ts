/**
 * Sync in-stock Star Tech processors into LogicBay BD:
 *  - scrape listing (filter_status=7, limit=90)
 *  - create missing products (skip duplicates by slug/name)
 *  - update prices for existing matches
 *  - download PDP images → public/uploads/processors/
 *
 * Run: npx tsx scripts/sync-startech-processors.ts
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { PrismaClient, StockStatus } from '@prisma/client';
import { ProductService } from '../src/services/product.service';
import { loadEnvValue } from './load-env';
import { inferAmdSeriesFromName } from '../src/lib/processorFilterMappings';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');
const prisma = new PrismaClient();

const LIST_URL =
  'https://www.startech.com.bd/component/processor?filter_status=7&limit=90';
const OUT_DIR = path.join(process.cwd(), 'public', 'uploads', 'processors');
const LIST_JSON = path.join(process.cwd(), 'docs/imports/startech-processor-list.json');

type ScrapedCpu = {
  name: string;
  slug: string;
  productUrl: string;
  price: number;
  compareAtPrice: number | null;
  thumbUrl: string | null;
  features: string[];
};

function fetchText(url: string, redirects = 0): Promise<string> {
  return new Promise((resolve, reject) => {
    if (redirects > 5) {
      reject(new Error(`Too many redirects for ${url}`));
      return;
    }
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      },
      (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const next = res.headers.location.startsWith('http')
            ? res.headers.location
            : new URL(res.headers.location, url).toString();
          fetchText(next, redirects + 1).then(resolve, reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        const chunks: Buffer[] = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      }
    );
    req.on('error', reject);
    req.setTimeout(45000, () => {
      req.destroy();
      reject(new Error(`Timeout ${url}`));
    });
  });
}

function fetchBuffer(url: string, redirects = 0): Promise<{ buffer: Buffer; contentType: string }> {
  return new Promise((resolve, reject) => {
    if (redirects > 5) {
      reject(new Error(`Too many redirects for ${url}`));
      return;
    }
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
          Referer: 'https://www.startech.com.bd/',
        },
      },
      (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const next = res.headers.location.startsWith('http')
            ? res.headers.location
            : new URL(res.headers.location, url).toString();
          fetchBuffer(next, redirects + 1).then(resolve, reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        const chunks: Buffer[] = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () =>
          resolve({
            buffer: Buffer.concat(chunks),
            contentType: String(res.headers['content-type'] || ''),
          })
        );
      }
    );
    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error(`Timeout ${url}`));
    });
  });
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\(rebox\)/gi, 'rebox')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100);
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\(rebox\)/gi, '')
    .replace(/desktop processor/gi, '')
    .replace(/processor/gi, '')
    .replace(/with radeon[^]*$/i, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parsePrice(raw: string): number | null {
  const digits = raw.replace(/[^\d]/g, '');
  if (!digits) return null;
  return parseInt(digits, 10);
}

function absoluteUrl(href: string): string {
  if (href.startsWith('//')) return `https:${href}`;
  if (href.startsWith('/')) return `https://www.startech.com.bd${href}`;
  return href;
}

/** Parse Star Tech category listing product cards (schema.org + p-item) */
function parseListingHtml(html: string): ScrapedCpu[] {
  const items: ScrapedCpu[] = [];
  const seen = new Set<string>();

  const cardRe =
    /<div[^>]*class="p-item"[^>]*itemprop="itemListElement"[^>]*>([\s\S]*?)(?=<div[^>]*class="p-item"[^>]*itemprop="itemListElement"|$)/gi;
  const cards = [...html.matchAll(cardRe)].map((m) => m[1] || '');

  for (const card of cards) {
    const urlMeta =
      /itemprop="url"[^>]*content="([^"]+)"/i.exec(card)?.[1] ||
      /href="(https:\/\/www\.startech\.com\.bd\/[^"]+)"/i.exec(card)?.[1];
    const name =
      /itemprop="name"[^>]*content="([^"]+)"/i.exec(card)?.[1] ||
      /class="p-item-name"[^>]*>[\s\S]*?<a[^>]*>\s*([\s\S]*?)\s*<\/a>/i.exec(card)?.[1] ||
      /alt="([^"]+)"/i.exec(card)?.[1];

    if (!urlMeta || !name) continue;

    const cleanName = name
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (cleanName.length < 8) continue;

    const productUrl = absoluteUrl(urlMeta);
    // Prefer Star Tech product path as slug when clean
    let slug = productUrl.replace(/^https?:\/\/www\.startech\.com\.bd\//, '').replace(/\/$/, '');
    if (!slug || slug.includes('?') || slug.includes('/')) slug = slugify(cleanName);
    else slug = slugify(slug);

    if (seen.has(slug)) continue;
    seen.add(slug);

    const metaPrice = /itemprop="price"[^>]*content="([\d.]+)"/i.exec(card)?.[1];
    const priceNew = /class="price-new"[^>]*>\s*([\d,]+)\s*৳/i.exec(card)?.[1];
    const priceOld = /class="price-old"[^>]*>\s*([\d,]+)\s*৳/i.exec(card)?.[1];
    const singlePrice = /class="p-item-price"[^>]*>\s*([\d,]+)\s*৳/i.exec(card)?.[1];

    let price =
      (metaPrice ? Math.round(parseFloat(metaPrice)) : null) ||
      parsePrice(priceNew || '') ||
      parsePrice(singlePrice || '');
    if (!price || price <= 0) continue;

    const compareAtPrice = parsePrice(priceOld || '');
    const finalCompare =
      compareAtPrice && compareAtPrice > price ? compareAtPrice : null;

    const imgMatch =
      /class="p-item-img"[\s\S]*?<img[^>]+src="([^"]+)"/i.exec(card) ||
      /itemprop="image"[^>]*src="([^"]+)"/i.exec(card) ||
      /src="(https:\/\/www\.startech\.com\.bd\/image\/[^"]+)"/i.exec(card);
    const thumbUrl = imgMatch?.[1] ? absoluteUrl(imgMatch[1]) : null;

    const shortBlock =
      /class="short-description"[^>]*>\s*<ul>([\s\S]*?)<\/ul>/i.exec(card)?.[1] || '';
    const features = [...shortBlock.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map((li) =>
        li[1]!
          .replace(/<[^>]+>/g, '')
          .replace(/&amp;/g, '&')
          .replace(/&nbsp;/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
      )
      .filter(Boolean);

    items.push({
      name: cleanName,
      slug,
      productUrl,
      price,
      compareAtPrice: finalCompare,
      thumbUrl,
      features,
    });
  }

  return items;
}

function brandFromName(name: string): 'intel' | 'amd' {
  const n = name.toLowerCase();
  if (n.includes('intel') || n.includes('pentium') || n.includes('celeron') || n.includes('core i')) {
    return 'intel';
  }
  return 'amd';
}

function skuFromSlug(slug: string, brand: 'intel' | 'amd'): string {
  const short = slug
    .replace(/^(amd|intel)-/, '')
    .replace(/-desktop-processor.*$/, '')
    .replace(/-processor.*$/, '')
    .slice(0, 40)
    .toUpperCase()
    .replace(/-/g, '');
  return `CPU-${brand === 'intel' ? 'I' : 'A'}-${short}`.slice(0, 48);
}

function extractMainImageUrl(html: string): string | null {
  const patterns = [
    /class=["']main-img["'][^>]*src=["']([^"']+)["']/i,
    /src=["']([^"']+)["'][^>]*class=["'][^"']*main-img[^"']*["']/i,
    /property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
    /<img[^>]*src=["'](https?:\/\/[^"']*\/image\/(?:cache\/)?catalog\/[^"']+)["']/i,
  ];
  for (const re of patterns) {
    const m = re.exec(html);
    if (m?.[1]) return absoluteUrl(m[1].trim());
  }
  return null;
}

function upgradeImageUrl(url: string): string[] {
  const candidates = [url];
  if (/-500x500\./i.test(url)) {
    candidates.unshift(url.replace(/-500x500\./i, '-800x800.'));
  }
  const noCache = url
    .replace('/image/cache/catalog/', '/image/catalog/')
    .replace(/-\d+x\d+\.(jpg|jpeg|png|webp)$/i, '.$1');
  if (noCache !== url) candidates.push(noCache);
  return [...new Set(candidates)];
}

function extFrom(url: string, contentType: string): string {
  try {
    const fromUrl = path.extname(new URL(url).pathname).toLowerCase();
    if (fromUrl && fromUrl.length <= 5) return fromUrl;
  } catch {
    /* ignore */
  }
  if (contentType.includes('png')) return '.png';
  if (contentType.includes('webp')) return '.webp';
  return '.jpg';
}

async function downloadBest(imageUrl: string): Promise<{ buffer: Buffer; ext: string }> {
  let lastErr: unknown;
  for (const candidate of upgradeImageUrl(imageUrl)) {
    try {
      const { buffer, contentType } = await fetchBuffer(candidate);
      if (buffer.length < 1000) throw new Error('file too small');
      return { buffer, ext: extFrom(candidate, contentType) };
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

async function upsertLocalImage(productId: string, localPath: string, alt: string) {
  const existing = await prisma.productImage.findMany({ where: { productId } });
  const primary = existing.find((i) => i.isPrimary) || existing[0];
  if (primary) {
    await prisma.productImage.update({
      where: { id: primary.id },
      data: { url: localPath, alt, isPrimary: true },
    });
    for (const img of existing) {
      if (img.id !== primary.id && img.isPrimary) {
        await prisma.productImage.update({ where: { id: img.id }, data: { isPrimary: false } });
      }
    }
  } else {
    await prisma.productImage.create({
      data: { productId, url: localPath, alt, order: 0, isPrimary: true },
    });
  }
}

async function ensureWarrantySpec(categoryId: string) {
  await prisma.specificationDefinition.upsert({
    where: { categoryId_key: { categoryId, key: 'warranty' } },
    update: { name: 'Warranty', isRequired: true },
    create: {
      categoryId,
      key: 'warranty',
      name: 'Warranty',
      dataType: 'TEXT',
      isRequired: true,
      order: 99,
    },
  });
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(LIST_JSON), { recursive: true });

  console.log('Fetching Star Tech processor listing…');
  const html = await fetchText(LIST_URL);
  const scraped = parseListingHtml(html);
  console.log(`Parsed ${scraped.length} processors from listing`);

  if (scraped.length < 20) {
    fs.writeFileSync(
      path.join(process.cwd(), 'docs/imports/startech-processor-list-raw.html'),
      html,
      'utf8'
    );
    throw new Error(
      `Too few products parsed (${scraped.length}). Saved raw HTML for inspection.`
    );
  }

  fs.writeFileSync(LIST_JSON, JSON.stringify(scraped, null, 2), 'utf8');
  console.log(`Wrote ${LIST_JSON}`);

  const processorCat = await prisma.category.findUnique({ where: { slug: 'processor' } });
  if (!processorCat) throw new Error('Category "processor" not found');

  const intelBrand = await prisma.brand.findFirst({
    where: { OR: [{ slug: 'intel' }, { name: { equals: 'Intel', mode: 'insensitive' } }] },
  });
  const amdBrand = await prisma.brand.findFirst({
    where: { OR: [{ slug: 'amd' }, { name: { equals: 'AMD', mode: 'insensitive' } }] },
  });
  if (!intelBrand || !amdBrand) throw new Error('Intel/AMD brands missing');

  const intelCat = await prisma.category.findUnique({ where: { slug: 'intel' } });
  const amdCat =
    (await prisma.category.findUnique({ where: { slug: 'amd' } })) ||
    (await prisma.category.findUnique({ where: { slug: 'amd-ryzen' } }));

  for (const catId of [processorCat.id, intelCat?.id, amdCat?.id].filter(Boolean) as string[]) {
    await ensureWarrantySpec(catId);
  }

  const existingProducts = await prisma.product.findMany({
    where: {
      OR: [
        { categoryId: processorCat.id },
        { category: { parentId: processorCat.id } },
        { category: { slug: { in: ['intel', 'amd', 'amd-ryzen', 'processor'] } } },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      sku: true,
      price: true,
      compareAtPrice: true,
      images: { select: { id: true, url: true, isPrimary: true } },
    },
  });

  const bySlug = new Map(existingProducts.map((p) => [p.slug, p]));
  const byNorm = new Map(existingProducts.map((p) => [normalizeName(p.name), p]));

  let created = 0;
  let priceUpdated = 0;
  let skipped = 0;
  let imagesOk = 0;
  let imageFail = 0;

  for (const item of scraped) {
    const brand = brandFromName(item.name);
    const brandId = brand === 'intel' ? intelBrand.id : amdBrand.id;
    const brandCat = brand === 'intel' ? intelCat : amdCat;
    const categoryId =
      brandCat?.parentId === processorCat.id ? brandCat.id : processorCat.id;

    let product =
      bySlug.get(item.slug) ||
      byNorm.get(normalizeName(item.name)) ||
      null;

    // Exact model token match only (avoid false hits like 4100 ↔ i3-14100)
    if (!product) {
      const modelTokens = item.name.match(
        /\b(?:i[3579]|ultra\s*[579]|ryzen\s*[3579]|pentium|celeron|athlon)[^\s,]{0,20}\b/gi
      );
      if (modelTokens?.length) {
        const key = modelTokens.join(' ').toLowerCase().replace(/\s+/g, ' ');
        product =
          existingProducts.find((p) => {
            const n = p.name.toLowerCase();
            return modelTokens.every((t) => n.includes(t.toLowerCase()));
          }) || null;
        if (product) {
          const pTokens = product.name.match(
            /\b(?:i[3579]|ultra\s*[579]|ryzen\s*[3579]|pentium|celeron|athlon)[^\s,]{0,20}\b/gi
          );
          const pKey = (pTokens || []).join(' ').toLowerCase().replace(/\s+/g, ' ');
          if (pKey !== key) product = null;
        }
      }
    }

    if (product) {
      const priceChanged =
        Number(product.price) !== item.price ||
        Number(product.compareAtPrice || 0) !== Number(item.compareAtPrice || 0);
      if (priceChanged) {
        await prisma.product.update({
          where: { id: product.id },
          data: {
            price: item.price,
            compareAtPrice: item.compareAtPrice,
            stockStatus: StockStatus.IN_STOCK,
            ...(item.features.length
              ? { shortDescription: item.features.join('\n') }
              : {}),
          },
        });
        priceUpdated++;
        console.log(`PRICE ${product.slug} → ৳${item.price}`);
      } else if (item.features.length) {
        await prisma.product.update({
          where: { id: product.id },
          data: { shortDescription: item.features.join('\n') },
        });
        skipped++;
        console.log(`SKIP existing ${product.slug} (features refreshed)`);
      } else {
        skipped++;
        console.log(`SKIP existing ${product.slug}`);
      }
    } else {
      // unique slug/sku
      let slug = item.slug;
      let n = 2;
      while (await prisma.product.findUnique({ where: { slug } })) {
        slug = `${item.slug}-${n++}`;
      }
      let sku = skuFromSlug(item.slug, brand);
      n = 2;
      while (await prisma.product.findUnique({ where: { sku } })) {
        sku = `${skuFromSlug(item.slug, brand)}-${n++}`.slice(0, 48);
      }

      try {
        const createdProduct = await ProductService.create({
          name: item.name,
          slug,
          sku,
          shortDescription: null,
          description: null,
          price: item.price,
          compareAtPrice: item.compareAtPrice,
          costPrice: null,
          stockStatus: 'IN_STOCK',
          stockQuantity: 10,
          lowStockAlert: 3,
          categoryId,
          brandId,
          metaTitle: `${item.name} Price in Bangladesh | LogicBay BD`,
          metaDescription: `Buy ${item.name} at ৳${item.price.toLocaleString()} from LogicBay BD.`,
          metaKeywords: null,
          isFeatured: false,
          isActive: true,
          shortDescription: item.features.length ? item.features.join('\n') : null,
          images: [
            {
              url: item.thumbUrl || '/uploads/processors/placeholder.jpg',
              alt: item.name,
              order: 0,
              isPrimary: true,
            },
          ],
          specifications: (() => {
            const specs: { key: string; value: string }[] = [{ key: 'warranty', value: '03 Years' }];
            if (brand === 'amd') {
              const inferred = inferAmdSeriesFromName(item.name);
              if (inferred?.generation) specs.push({ key: 'generation', value: inferred.generation });
              if (inferred?.processorModel) {
                specs.push({ key: 'processor_model', value: inferred.processorModel });
              }
            }
            return specs;
          })(),
        } as any);

        product = {
          id: createdProduct.id,
          name: item.name,
          slug,
          sku,
          price: item.price as any,
          compareAtPrice: item.compareAtPrice as any,
          images: [],
        };
        bySlug.set(slug, product as any);
        byNorm.set(normalizeName(item.name), product as any);
        created++;
        console.log(`CREATED ${sku} ${slug} @ ৳${item.price}`);
      } catch (err) {
        console.error(`FAIL create ${item.name}:`, err instanceof Error ? err.message : err);
        continue;
      }
    }

    // Image download
    if (!product?.id) continue;
    const localPrimary = product.images?.find((i) => i.url?.startsWith('/uploads/processors/'));
    const expectedFile = path.join(OUT_DIR, `${product.slug}.jpg`);
    const alreadyLocal =
      localPrimary ||
      fs.existsSync(path.join(OUT_DIR, `${product.slug}.jpg`)) ||
      fs.existsSync(path.join(OUT_DIR, `${product.slug}.webp`)) ||
      fs.existsSync(path.join(OUT_DIR, `${product.slug}.png`));

    try {
      let imageUrl = item.thumbUrl;
      try {
        const pdpHtml = await fetchText(item.productUrl);
        imageUrl = extractMainImageUrl(pdpHtml) || imageUrl;
      } catch {
        /* use thumb */
      }
      if (!imageUrl) throw new Error('no image url');

      const { buffer, ext } = await downloadBest(imageUrl);
      const filename = `${product.slug}${ext}`;
      const abs = path.join(OUT_DIR, filename);
      fs.writeFileSync(abs, buffer);
      const localPath = `/uploads/processors/${filename}`;
      await upsertLocalImage(product.id, localPath, item.name);
      imagesOk++;
      console.log(`  IMG ${localPath}`);
      await sleep(250);
    } catch (err) {
      imageFail++;
      console.warn(
        `  IMG fail ${product.slug}:`,
        err instanceof Error ? err.message : err
      );
    }

    // avoid hammering
    await sleep(150);
  }

  console.log(
    `\nDone. scraped=${scraped.length} created=${created} priceUpdated=${priceUpdated} skippedSame=${skipped} imagesOk=${imagesOk} imageFail=${imageFail}`
  );
  console.log(`Files in ${OUT_DIR}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
