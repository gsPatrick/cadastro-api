import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@sistemacadastro/shared'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8005/:path*',
      },
    ];
  },
};

export default nextConfig;
