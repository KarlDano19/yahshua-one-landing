import type { Metadata } from "next";

const BASE_URL = "https://www.yahshua.one";
const PARENT_ORG_ID = "https://www.theabbainitiative.com/#organization";

export const metadata: Metadata = {
  title: "About — YAHSHUA One",
  description:
    "YAHSHUA One is built by The ABBA Initiative, the company behind the YAHSHUA product suite.",
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
      "YAHSHUA One is built by The ABBA Initiative, the company behind the YAHSHUA product suite.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "About YAHSHUA One",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About — YAHSHUA One",
    description:
      "YAHSHUA One is built by The ABBA Initiative, the company behind the YAHSHUA product suite.",
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
      about: { "@id": PARENT_ORG_ID },
      description: "YAHSHUA One is a product of The ABBA Initiative.",
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
