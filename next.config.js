/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.ignoreWarnings = [
      { module: /node_modules\/web-worker/ },
      { module: /node_modules\/ox/ },
      { module: /node_modules\/snarkjs/ },
      { message: /Critical dependency: the request of a dependency is an expression/ }
    ];
    return config;
  },
}
module.exports = nextConfig
