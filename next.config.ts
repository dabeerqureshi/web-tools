import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Ensure client-heavy libraries don't fail during server compilation
  serverExternalPackages: ["pdfjs-dist", "ag-psd"],
};

export default nextConfig;

