/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  pageExtensions: ['page.tsx'],
  transpilePackages: [
  ],
  experimental: {
    appDir: false,
  },
  images: {
    remotePatterns: [],
  },
};

module.exports = nextConfig;
