import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*",
      },
      {
        source: "/sanctum/:path*",
        destination: "http://localhost:8000/sanctum/:path*",
      },
    ];
  },
};

export default nextConfig;
