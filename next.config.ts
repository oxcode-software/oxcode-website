import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Stray package-lock.json files in parent folders make Turbopack infer the
  // wrong workspace root, which breaks resolving `tailwindcss` from globals.css.
  turbopack: {
    root: __dirname,
  },
  devIndicators: false,
};

export default nextConfig;
