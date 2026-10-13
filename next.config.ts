import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "cloudflare:workers": "./lib/cloudflare-workers-shim.ts",
    },
  },
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias["cloudflare:workers"] = path.resolve(process.cwd(), "lib/cloudflare-workers-shim.ts");
    return config;
  },
};

export default nextConfig;
