import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Tailwind CSS is small (~11 KB compressed): inline it so first visits
    // don't wait on a render-blocking stylesheet request.
    inlineCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // 60: large background plates, 75: default, 85: product cut-outs and packshots.
    qualities: [60, 75, 85],
  },
};

export default nextConfig;
