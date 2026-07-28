import type { Metadata } from "next";

const BASE_URL = "https://www.yahshua.one";

export const metadata: Metadata = {
  title: {
    default: "Blog — YAHSHUA One",
    template: "%s | YAHSHUA One Blog",
  },
  description:
    "Payroll, HR, and compliance guides for Filipino business owners — written by the team building YAHSHUA One.",
  alternates: {
    canonical: `${BASE_URL}/blog`,
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: `${BASE_URL}/blog`,
    siteName: "YAHSHUA One",
    title: "Blog — YAHSHUA One",
    description:
      "Payroll, HR, and compliance guides for Filipino business owners.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "YAHSHUA One Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — YAHSHUA One",
    description: "Payroll, HR, and compliance guides for Filipino business owners.",
    images: ["/opengraph-image"],
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
