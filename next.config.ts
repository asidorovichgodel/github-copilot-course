import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Empty turbopack config silences the "webpack config without turbopack" error.
  // pdfjs-dist's optional 'canvas' dep is not needed for server-side text
  // extraction, so no additional bundler config is required.
  turbopack: {},
};

export default nextConfig;
