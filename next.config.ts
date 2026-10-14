import type { NextConfig } from "next";
import path from "node:path";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://*.firebaseapp.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com data:;
  img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co https://*.r2.cloudflarestorage.com https://i.ytimg.com https://i.vimeocdn.com https://*.googleusercontent.com;
  media-src 'self' blob: https://*.r2.cloudflarestorage.com https://*.supabase.co;
  frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://*.firebaseapp.com;
  connect-src 'self' https://*.supabase.co https://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://api.resend.com https://api.openai.com https://generativelanguage.googleapis.com https://*.r2.cloudflarestorage.com;
  frame-ancestors 'self';
`.replace(/\s{2,}/g, ' ').trim();

const securityHeaders = [
  { key: 'Content-Security-Policy', value: cspHeader },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
];

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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
