import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media*.giphy.com",
      },
      {
        protocol: "https",
        hostname: "xscyhjniouateyibsogs.supabase.co",
      },
    ],
  },
};

export default nextConfig;
