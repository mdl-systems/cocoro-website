import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output for Node.js server deployment (さくらインターネット / VPS)
  // Produces .next/standalone/ — run with: node .next/standalone/server.js
  output: "standalone",

  // Compress responses at Next.js level (nginx will also gzip, but keep for safety)
  compress: true,

  // Allow images from cocoro-os.com domains in production
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cocoro-os.com" },
      { protocol: "https", hostname: "www.cocoro-os.com" },
      { protocol: "https", hostname: "console.cocoro.ai" },
    ],
    formats: ["image/avif", "image/webp"],
  },


  // Security headers (in addition to vercel.json / nginx)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
