import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export function loadEnvValue(key: string): string {
  const envPath = join(process.cwd(), '.env');
  if (!existsSync(envPath)) {
    throw new Error('.env file not found. Copy .env.example to .env first.');
  }

  const content = readFileSync(envPath, 'utf-8');
  const pattern = new RegExp(`^${key}="([^"]*)"`, 'm');
  const match = content.match(pattern);

  if (!match?.[1]) {
    throw new Error(`${key} not found in .env`);
  }

  return match[1];
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
