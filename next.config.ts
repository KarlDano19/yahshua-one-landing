import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/payroll",
        destination: "/yahshua-one-payroll",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
