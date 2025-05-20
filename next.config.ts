import withFlowbiteReact from "flowbite-react/plugin/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizeCss: false,
  }, 
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default withFlowbiteReact(nextConfig);
