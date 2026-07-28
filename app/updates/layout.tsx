import type { Metadata } from "next";

const BASE_URL = "https://www.yahshua.one";

export const metadata: Metadata = {
  title: "Updates — YAHSHUA One",
  description:
    "Latest product updates, feature releases, and compliance news from YAHSHUA One — the AI-powered payroll, BIR compliance, and HR platform for Filipino businesses.",
  alternates: {
    canonical: `${BASE_URL}/updates`,
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: `${BASE_URL}/updates`,
    siteName: "YAHSHUA One",
    title: "Updates — YAHSHUA One",
    description:
      "Latest product updates and feature releases from YAHSHUA One — AI-powered payroll and compliance for Filipino SMBs.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "YAHSHUA One Updates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Updates — YAHSHUA One",
    description:
      "Latest product updates and feature releases from YAHSHUA One — AI-powered payroll and compliance for Filipino SMBs.",
    images: ["/opengraph-image"],
  },
};

export default function UpdatesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
