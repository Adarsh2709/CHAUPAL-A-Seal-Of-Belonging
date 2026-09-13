/** @type {import('next').NextConfig} */
const webpack = require('webpack');
const path = require('path');

const emptyModule = path.resolve(__dirname, 'src', 'lib', 'empty-module.js');

const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // Stub out ALL @x402/* modules that @coinbase/cdp-sdk tries to import.
    // These are optional payment modules we don't use.
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^@x402\//,
        emptyModule
      )
    );

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
