import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  compress: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [360, 640, 828, 1080, 1200, 1920],
    imageSizes: [64, 128, 256, 350, 384],
  },
  experimental: {
    // keep prefetched dynamic pages in the client router cache so repeat visits are instant
    staleTimes: { dynamic: 60, static: 300 },
    optimizePackageImports: [
      "lucide-react",
      "react-icons",
      "radix-ui",
      "date-fns",
      "recharts",
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*\\.(png|jpg|jpeg|webp|avif|svg|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
