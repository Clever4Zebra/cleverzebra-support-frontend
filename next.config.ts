import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://support-api.cleverzebra.nl/api/:path*",
      },
      {
        source: "/sanctum/:path*",
        destination: "https://support-api.cleverzebra.nl/sanctum/:path*",
      },
    ];
  },
};

export default nextConfig;
