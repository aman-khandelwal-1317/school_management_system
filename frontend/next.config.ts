import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['ui-avatars.com', 'placehold.co', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/api/**',
      },
    ],
  },
};

export default nextConfig;
