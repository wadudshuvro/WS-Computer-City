import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export function loadEnvValue(key: string): string {
  const envPath = join(process.cwd(), '.env');
  if (!existsSync(envPath)) {
    throw new Error('.env file not found. Copy .env.example to .env first.');
  }

  const content = readFileSync(envPath, 'utf-8');

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;

    const envKey = trimmed.slice(0, eqIndex).trim();
    if (envKey !== key) continue;

    let value = trimmed.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (value) return value;
  }

  throw new Error(`${key} not found in .env`);
}

export function parseDatabaseUrl(url: string) {
  const parsed = new URL(url);
  const database = parsed.pathname.replace(/^\//, '').split('?')[0];

  return {
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    host: parsed.hostname,
    port: parsed.port || '5432',
    database,
  };
}
