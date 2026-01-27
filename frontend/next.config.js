/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", 
      },
    ],
  },
  // ✅ FIX: Enable CSS inlining to eliminate render-blocking requests
  experimental: {
    inlineCss: true,
  },
};

module.exports = nextConfig;