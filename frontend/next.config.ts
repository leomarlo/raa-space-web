import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true, // disables optimization to support static export
  },
  /* config options here */
};

export default nextConfig;
