/** @type {import('next').NextConfig} */
const nextConfig = {
  // No eslint dependency is installed in this prototype; don't block
  // `next build` on it.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
