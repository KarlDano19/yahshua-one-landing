import type { Metadata } from "next";

const BASE_URL = "https://www.yahshua.one";

export const metadata: Metadata = {
  title: "Pricing — YAHSHUA One",
  description:
    "Simple, transparent pricing for YAHSHUA One — automated payroll, BIR compliance, HR, and accounting for Filipino SMBs. Join the early access waitlist today.",
  alternates: {
    canonical: `${BASE_URL}/pricing`,
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: `${BASE_URL}/pricing`,
    siteName: "YAHSHUA One",
    title: "Pricing — YAHSHUA One",
    description:
      "Simple, transparent pricing for automated payroll, BIR compliance, HR, and accounting. Built for Filipino SMBs.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "YAHSHUA One Pricing — AI-Powered Backoffice for Filipino Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — YAHSHUA One",
    description:
      "Simple, transparent pricing for automated payroll, BIR compliance, HR, and accounting. Built for Filipino SMBs.",
    images: ["/opengraph-image"],
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
