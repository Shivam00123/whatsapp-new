/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "valiant-partridge-243.convex.cloud" },
      { hostname: "oaidalleapiprodscus.blob.core.windows.net" },
      { hostname: "utmost-snail-692.convex.cloud" },
    ],
  },
};

export default nextConfig;
