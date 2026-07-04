import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/academy/embedded-c/index.html",
        destination: "/academy/embedded-c-roadmap/index.html",
        permanent: false,
      },
      { source: "/community/:path*", destination: "/", permanent: false },
      { source: "/profile/:path*", destination: "/", permanent: false },
      { source: "/projects/new", destination: "/", permanent: false },
      { source: "/projects/:path*", destination: "/", permanent: false },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

export default nextConfig;
