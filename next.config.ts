import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  reloadOnOnline: false,
  maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  images: { unoptimized: true },
};

export default withSerwist(nextConfig);
