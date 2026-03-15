/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for さくらインターネット shared hosting (Apache / FreeBSD)
  output: "export",

  // Append trailing slashes so Apache can serve index.html correctly
  trailingSlash: true,

  // Next.js image optimization requires a Node.js server — disable for static
  images: {
    unoptimized: true,
  },

  // No server-side compression for static export
  compress: false,
};

export default nextConfig;
