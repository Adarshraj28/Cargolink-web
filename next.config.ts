import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow dev/HMR access when the site is opened over the local network.
  allowedDevOrigins: ["192.168.0.109"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
