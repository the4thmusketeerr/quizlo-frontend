/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // This tells Turbopack exactly where your project root is
    turbopack: {
      root: "./",
    },
  },
};

export default nextConfig;
