import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.7", "192.168.0.7:3000", "192.168.0.1", "192.168.1.1", "localhost:3000"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
