/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['rssecom.netlify.app'],
    remotePatterns: [
      {
        hostname: 'rssecom.netlify.app',
        protocol: 'https',
      },
    ],
    unoptimized: true,
  },
  output: 'standalone',
  reactStrictMode: true,
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  webpack(config) {
    // Configure SVGR
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default nextConfig;
