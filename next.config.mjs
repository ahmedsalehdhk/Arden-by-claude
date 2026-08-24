/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: {
    // Serve images verbatim (as plain <img>) — Passenger on cPanel doesn't run
    // Next's image optimizer reliably, and every image already lives on the
    // same origin. Turning this off makes broken images render Next's fallback
    // SVG instead of the actual file, which we don't want.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256, 320, 384],
  },
  trailingSlash: true,
};

export default nextConfig;
