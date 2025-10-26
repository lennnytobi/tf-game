import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimized for Vercel deployment
  poweredByHeader: false,
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Handle GLB and GLTF files
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/assets/[hash][ext][query]'
      }
    });

    // Handle image files
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg)$/i,
      type: 'asset/resource',
    });

    return config;
  },
};

export default nextConfig;
