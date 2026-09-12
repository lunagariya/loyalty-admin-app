import type { NextConfig } from 'next';

if (process.env.NODE_ENV === 'production') {
  for (const name of ['NEXT_PUBLIC_SHOPIFY_API_KEY', 'NEXT_PUBLIC_BACKEND_URL']) {
    if (!process.env[name]) throw new Error(`Missing required environment variable: ${name}`);
  }
}

const allowedDevOrigins = (process.env.ALLOWED_DEV_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(allowedDevOrigins.length ? { allowedDevOrigins } : {}),
};

export default nextConfig;
