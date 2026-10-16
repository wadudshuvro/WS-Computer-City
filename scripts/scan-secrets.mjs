import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

const skipDirs = new Set(['node_modules', '.git', '.next', 'public', 'backups', 'coverage']);
const patterns = [
  /sk_live_[0-9A-Za-z]+/,
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY-----/,
  /postgres:\/\/[^:\s]+:[^@\s]+@(?!localhost)/,
];

function walk(dir, hits) {
  for (const name of readdirSync(dir)) {
    if (skipDirs.has(name)) continue;
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walk(full, hits);
      continue;
    }
    if (!/\.(ts|tsx|js|mjs|yml|yaml|md|json|example|env)$/.test(name) && name !== '.env.example') continue;
    if (name === '.env' || name.endsWith('.env.local')) continue;
    const text = readFileSync(full, 'utf8');
    for (const pattern of patterns) {
      if (pattern.test(text)) hits.push(`${full} matches ${pattern}`);
    }
  }
}

const hits = [];
walk(process.cwd(), hits);
if (hits.length) {
  console.error(hits.join('\n'));
  process.exit(1);
}
console.log('secret scan: no live key patterns in tracked source');
