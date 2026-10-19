/**
 * Read Star Tech selling prices for products that already have sourceUrl.
 * Usage:
 *   npx tsx scripts/sync-startech-prices.ts
 *   npx tsx scripts/sync-startech-prices.ts --dry-run --limit 3
 */
import { Prisma, PrismaClient } from '@prisma/client';
import { loadEnvValue } from './load-env';
import { applyPriceRule, ruleLabel } from '../src/lib/priceSync/applyPriceRule';
import {
  fetchSourcePrice,
  PRICE_SYNC_USER_AGENT,
  robotsDisallowsProductPages,
  SOURCE_SITE,
} from '../src/lib/priceSync/fetchSourcePrice';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');
const prisma = new PrismaClient();

const WAIT_MS = 1500;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function args() {
  const dryRun = process.argv.includes('--dry-run');
  const limitFlag = process.argv.indexOf('--limit');
  const limit = limitFlag >= 0 ? Number(process.argv[limitFlag + 1]) : undefined;
  return { dryRun, limit: limit && limit > 0 ? limit : undefined };
}

async function robotsAllow(): Promise<string | null> {
  try {
    const response = await fetch(`${SOURCE_SITE}/robots.txt`, {
      headers: { 'User-Agent': PRICE_SYNC_USER_AGENT, Accept: 'text/plain' },
    });
    if (!response.ok) return `Could not read robots.txt (HTTP ${response.status}). Stopped.`;
    const text = await response.text();
    if (robotsDisallowsProductPages(text)) {
      return 'robots.txt disallows product pages. Stopped.';
    }
    return null;
  } catch (error) {
    return `Could not read robots.txt (${error instanceof Error ? error.message : 'network error'}). Stopped.`;
  }
}

async function main() {
  const { dryRun, limit } = args();
  const blocked = await robotsAllow();
  if (blocked) {
    console.log(blocked);
    process.exitCode = 1;
    return;
  }

  const products = await prisma.product.findMany({
    where: { sourceUrl: { not: null } },
    select: {
      id: true,
      name: true,
      price: true,
      compareAtPrice: true,
      stockStatus: true,
      sourceUrl: true,
      sourcePrice: true,
      priceRule: true,
      priceRuleValue: true,
    },
    orderBy: { name: 'asc' },
    ...(limit ? { take: limit } : {}),
  });

  const counts = { updated: 0, unchanged: 0, flagged: 0, failed: 0 };
  const run = dryRun
    ? null
    : await prisma.priceSyncRun.create({ data: { dryRun: false } });

  console.log(`${dryRun ? 'Dry run' : 'Sync'} ${products.length} linked product(s)`);

  for (let index = 0; index < products.length; index++) {
    const product = products[index]!;
    if (index > 0) await sleep(WAIT_MS);
    const url = product.sourceUrl!;
    const oldPrice = Math.round(Number(product.price));
    const ruleValue = product.priceRuleValue == null ? null : Number(product.priceRuleValue);
    let status: 'UPDATED' | 'UNCHANGED' | 'FLAGGED' | 'ERROR' = 'ERROR';
    let reason: string | null = null;
    let sourcePrice: number | null = null;
    let newPrice: number | null = null;

    try {
      const read = await fetchSourcePrice(url);
      if ('blocked' in read && read.blocked) {
        console.log(`Star Tech blocked the reader (${read.error}). Stopped.`);
        if (run) {
          await prisma.priceSyncRun.update({
            where: { id: run.id },
            data: { ...counts, finishedAt: new Date(), stoppedReason: read.error },
          });
        }
        process.exitCode = 1;
        return;
      }
      if (!read.ok) {
        status = 'ERROR';
        reason = read.error;
        counts.failed++;
      } else {
        sourcePrice = read.price;
        const decision = applyPriceRule({
          sourcePrice: read.price,
          previousSourcePrice: product.sourcePrice,
          currentPrice: oldPrice,
          compareAtPrice: product.compareAtPrice == null ? null : Number(product.compareAtPrice),
          currentStock: product.stockStatus,
          nextStock: read.availability,
          rule: product.priceRule,
          ruleValue,
        });
        if (decision.status === 'unchanged') {
          status = 'UNCHANGED';
          counts.unchanged++;
        } else if (decision.status === 'flagged') {
          status = 'FLAGGED';
          reason = decision.reason;
          counts.flagged++;
        } else if (decision.status === 'error') {
          status = 'ERROR';
          reason = decision.reason;
          counts.failed++;
        } else {
          status = 'UPDATED';
          newPrice = decision.price;
          counts.updated++;
          if (!dryRun) {
            const data: Prisma.ProductUpdateInput = {
              price: new Prisma.Decimal(decision.price),
              sourcePrice: read.price,
              priceSyncStatus: 'UPDATED',
              priceFlagReason: null,
            };
            if (decision.stock) data.stockStatus = decision.stock;
            if (decision.clearCompareAt) data.compareAtPrice = null;
            await prisma.product.update({ where: { id: product.id }, data });
          }
        }
      }
    } catch (error) {
      status = 'ERROR';
      reason = error instanceof Error ? error.message : 'Unknown error';
      counts.failed++;
    }

    if (!dryRun && status !== 'UPDATED') {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          priceSyncStatus: status,
          priceFlagReason: reason,
          ...(status === 'UNCHANGED' && sourcePrice != null ? { sourcePrice } : {}),
        },
      });
    }

    if (!dryRun && run) {
      await prisma.priceSyncLog.create({
        data: {
          runId: run.id,
          productId: product.id,
          productName: product.name,
          oldPrice,
          newPrice,
          sourcePrice,
          rule: ruleLabel(product.priceRule, ruleValue),
          status,
          reason,
        },
      });
    }

    console.log(
      `${status} ${product.name} old=${oldPrice} new=${newPrice ?? '-'} source=${sourcePrice ?? '-'} ${reason ?? ''}`.trim()
    );
  }

  if (run) {
    await prisma.priceSyncRun.update({
      where: { id: run.id },
      data: { ...counts, finishedAt: new Date() },
    });
  }

  console.log(
    `Summary updated=${counts.updated} unchanged=${counts.unchanged} flagged=${counts.flagged} failed=${counts.failed}`
  );
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
