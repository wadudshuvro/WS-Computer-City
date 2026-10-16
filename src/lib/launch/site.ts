/** Public site origin. Set NEXT_PUBLIC_APP_URL when the domain is ready. */
export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return raw.replace(/\/$/, '');
}

export function siteName(): string {
  return process.env.NEXT_PUBLIC_APP_NAME || 'LogicBay BD';
}

export function isProduction(): boolean {
  return process.env.APP_ENV === 'production' || process.env.NODE_ENV === 'production';
}
