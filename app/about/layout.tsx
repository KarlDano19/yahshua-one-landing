import type { Metadata } from "next";

const BASE_URL = "https://www.yahshua.one";

export const metadata: Metadata = {
  title: "About — YAHSHUA One",
  description:
    "The ABBA Initiative (OPC) is the Philippine parent company behind YAHSHUA One, YAHSHUA Payroll, YAHSHUA HRIS, and YAHSHUA Outsourcing Worldwide Inc.",
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: `${BASE_URL}/about`,
    siteName: "YAHSHUA One",
    title: "About — YAHSHUA One",
    description:
      "The ABBA Initiative (OPC) is the Philippine parent company behind YAHSHUA One, YAHSHUA Payroll, YAHSHUA HRIS, and YAHSHUA Outsourcing Worldwide Inc.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "About YAHSHUA — The ABBA Initiative (OPC)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About — YAHSHUA One",
    description:
      "The ABBA Initiative (OPC) is the Philippine parent company behind YAHSHUA One, YAHSHUA Payroll, YAHSHUA HRIS, and YAHSHUA Outsourcing Worldwide Inc.",
    images: ["/opengraph-image"],
  },
};

const aboutSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${BASE_URL}/about#webpage`,
      url: `${BASE_URL}/about`,
      name: "About — YAHSHUA One",
      isPartOf: { "@id": `${BASE_URL}/#website` },
      about: { "@id": `${BASE_URL}/#org` },
      description:
        "How YAHSHUA One, YAHSHUA Payroll, YAHSHUA HRIS, and YAHSHUA Outsourcing Worldwide Inc. relate to The ABBA Initiative (OPC).",
      inLanguage: "en-PH",
    },
  ],
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      {children}
    </>
  );
}
