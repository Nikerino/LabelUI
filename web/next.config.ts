import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'http://127.0.0.1:8001/:path*', // Matched parameters can be used in the destination
      },
    ]
  },
};

export default nextConfig;
