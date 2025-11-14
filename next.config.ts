import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    // Example: adding an alias and custom file extension
    resolveAlias: {
      underscore: 'lodash',
      '@': './src',
    },
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.json'],
  },
};

export default nextConfig;
