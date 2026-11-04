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
    loader: "custom",
    loaderFile: "./lib/static-image-loader.ts",
    // 60: large background plates, 75: default, 85: product cut-outs and packshots.
    qualities: [60, 75, 85],
  },
  async headers() {
    return [
      { source: "/image-cache/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/products/:path*.:extension(webp|png|jpg|jpeg)", headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }] },
      ...["frames", "hero", "worlds", "home", "categories", "breakdowns", "lifestyle", "footer"].map((folder) => ({
        source: `/${folder}/:path*`,
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      })),
    ];
  },
};

export default nextConfig;
