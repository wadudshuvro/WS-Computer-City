/** @type {import('next').NextConfig} */

function remoteImageHosts() {
  const hosts = (process.env.IMAGE_REMOTE_HOSTS || 'placehold.co,utfs.io')
    .split(',')
    .map((host) => host.trim())
    .filter(Boolean);
  return hosts.map((hostname) => ({
    protocol: 'https',
    hostname,
  }));
}

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "connect-src 'self'",
      "object-src 'none'",
    ].join('; '),
  },
];

if (process.env.APP_ENV === 'production' || process.env.NODE_ENV === 'production') {
  securityHeaders.push({
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  });
}

const nextConfig = {
  // Lets a production build run beside the dev server (NEXT_DIST_DIR=.next-prod)
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Image optimization configuration
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 768, 1080, 1200, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    remotePatterns: remoteImageHosts(),
  },

  // Experimental features
  experimental: {
    // Server Actions are enabled by default in Next.js 15
  },

  // Compiler options
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // Performance optimizations
  compress: true,

  // Environment variables available to the browser
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'LogicBay BD',
  },

  // Redirect trailing slashes
  trailingSlash: false,

  // Power by header (disable for security)
  poweredByHeader: false,

  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        source: '/uploads/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Add custom webpack configuration here if needed
    return config;
  },
};

module.exports = nextConfig;
