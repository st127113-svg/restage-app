/** @type {import('next').NextConfig} */
const nextConfig = {
  // No eslint dependency is installed in this prototype; don't block
  // `next build` on it.
  eslint: {
    ignoreDuringBuilds: true,
  },
  // The GitHub Pages workflow (.github/workflows/deploy-pages.yml) builds
  // a static export with STATIC_EXPORT=true. That job also deletes
  // app/api before building, since a static export can't run the
  // /api/generate route handler — GitHub Pages only serves static files.
  // A normal `npm run build` (e.g. deploying to Vercel/Node) is untouched
  // and keeps the full app, API route included.
  ...(process.env.STATIC_EXPORT === "true" ? { output: "export" } : {}),
};

export default nextConfig;
