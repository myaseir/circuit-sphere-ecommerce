/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // 👈 This allows images from ANY website
      },
    ],
  },
};

module.exports = nextConfig;