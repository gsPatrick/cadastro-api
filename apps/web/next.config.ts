import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@sistemacadastro/shared'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.amplo.app.br/:path*',
      },
    ];
  },
};

export default nextConfig;
