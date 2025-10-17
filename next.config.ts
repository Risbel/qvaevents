import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wkbkpitwnujokbqucubh.supabase.co",
        port: "",
      },
      {
        protocol: "https",
        hostname: "wkbkpitwnujokbqucubh.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/organizers/profile-logos/**",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
