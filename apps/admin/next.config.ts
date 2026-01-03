import type { NextConfig } from "next";

// Force redeploy
const nextConfig: NextConfig = {
  output: 'standalone',
};

export default nextConfig;
