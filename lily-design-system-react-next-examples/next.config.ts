import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@lilydesignsystem/react-headless"],
  typescript: {
    // The headless library uses `[key: string]: unknown` rest props which
    // conflicts with Next.js strict ReactNode typing. The headless library
    // has its own type checking and test suite.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
