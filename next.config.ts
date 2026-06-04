import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  async headers() {
    return [{
      source: '/api/:path*',
      headers: [{ key: 'Cache-Control', value: 's-maxage=3600, stale-while-revalidate' }]
    }]
  }
};

export default nextConfig;
