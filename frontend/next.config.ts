import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://calendarsync-rtqs.onrender.com/api/:path*",
      },
    ];
  },
  
  // 👇 Ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // 👇 Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
