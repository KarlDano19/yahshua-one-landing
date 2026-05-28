import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const BASE_URL = "https://www.yahshua.one";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "YAHSHUA One — Automated Payroll, BIR Compliance & HR System for Filipino Businesses",
    template: "%s | YAHSHUA One",
  },
  description:
    "YAHSHUA One is an AI-powered business management system for Filipino SMBs. Automate payroll generation, BIR compliance, SSS/PhilHealth/Pag-IBIG filings, HR onboarding & offboarding, and accounting — all in one platform.",
  keywords: [
    "automated payroll Philippines",
    "payroll system Philippines",
    "BIR compliance software Philippines",
    "BIR filing system Philippines",
    "HR system Philippines",
    "HR onboarding offboarding Philippines",
    "SSS PhilHealth Pag-IBIG automatic computation",
    "accounting software Philippines SMB",
    "business management system Philippines",
    "AI payroll Philippines",
    "Filipino business software",
    "HR software Philippines",
    "leave management system Philippines",
    "compliance tracking Philippines",
    "automated accounting Philippines",
    "payslip generator Philippines",
    "employee management system Philippines",
    "small business software Philippines",
    "government contribution calculator Philippines",
    "BIR deadline tracker",
  ],
  authors: [{ name: "ABBA Initiative", url: BASE_URL }],
  creator: "ABBA Initiative",
  publisher: "YAHSHUA One",
  category: "Business Software",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: BASE_URL,
    siteName: "YAHSHUA One",
    title: "YAHSHUA One — Automated Payroll, BIR Compliance & HR for Filipino Businesses",
    description:
      "Stop doing payroll manually. YAHSHUA One automates your payroll, BIR filings, SSS/PhilHealth/Pag-IBIG, HR onboarding, and accounting — built specifically for Filipino businesses.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "YAHSHUA One — AI-Powered Backoffice for Filipino Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YAHSHUA One — Automated Payroll & BIR Compliance for Filipino SMBs",
    description:
      "Automated payroll, BIR compliance, HR onboarding & offboarding, and accounting — all in one AI-powered platform built for Filipino businesses.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add Google Search Console verification token here when available
    // google: "your-verification-token",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-PH" className={`${geist.variable} ${geistMono.variable}`}>
      <head>
        <link rel="canonical" href={BASE_URL} />
        <meta name="geo.region" content="PH" />
        <meta name="geo.placename" content="Philippines" />
        <meta name="language" content="English" />
        <meta name="target" content="all" />
        <meta name="audience" content="business owners, HR managers, accountants, employees" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "SoftwareApplication",
                  "@id": `${BASE_URL}/#software`,
                  name: "YAHSHUA One",
                  alternateName: ["YAHSHUA 1", "Yahshua One"],
                  description:
                    "An AI-powered business management platform for Filipino SMBs that automates payroll, BIR tax compliance, SSS/PhilHealth/Pag-IBIG government contributions, HR onboarding and offboarding, leave management, and accounting.",
                  url: BASE_URL,
                  applicationCategory: "BusinessApplication",
                  operatingSystem: "Web",
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "PHP",
                    description: "Free early access — join the waitlist",
                  },
                  featureList: [
                    "Automated payroll generation",
                    "BIR compliance and tax filing",
                    "SSS contribution computation",
                    "PhilHealth contribution computation",
                    "Pag-IBIG contribution computation",
                    "HR onboarding and offboarding",
                    "Leave and overtime management",
                    "Employee self-service portal",
                    "Real-time accounting and bookkeeping",
                    "Profit and loss reporting",
                    "Compliance deadline tracking",
                    "Payslip generation and distribution",
                  ],
                  audience: {
                    "@type": "Audience",
                    audienceType:
                      "Filipino small and medium business owners, HR managers, accountants, finance officers",
                    geographicArea: {
                      "@type": "Country",
                      name: "Philippines",
                    },
                  },
                  inLanguage: "en-PH",
                  isAccessibleForFree: true,
                  screenshot: `${BASE_URL}/og-image.jpg`,
                },
                {
                  "@type": "Organization",
                  "@id": `${BASE_URL}/#org`,
                  name: "ABBA Initiative",
                  url: BASE_URL,
                  logo: `${BASE_URL}/logo.jpg`,
                  foundingLocation: {
                    "@type": "Country",
                    name: "Philippines",
                  },
                  description:
                    "Building AI-powered software for Filipino businesses under the YAHSHUA One platform.",
                },
                {
                  "@type": "WebSite",
                  "@id": `${BASE_URL}/#website`,
                  url: BASE_URL,
                  name: "YAHSHUA One",
                  description:
                    "AI-powered payroll, BIR compliance, HR, and accounting system for Filipino businesses",
                  publisher: { "@id": `${BASE_URL}/#org` },
                  inLanguage: "en-PH",
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate: `${BASE_URL}/?q={search_term_string}`,
                    },
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "FAQPage",
                  "@id": `${BASE_URL}/#faq`,
                  mainEntity: [
                    {
                      "@type": "Question",
                      name: "Does YAHSHUA One automate payroll computation in the Philippines?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Yes. YAHSHUA One automatically computes payroll for all employees including SSS, PhilHealth, Pag-IBIG, and withholding tax deductions. It generates payslips and prepares bank disbursement files with no manual computation required.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "Does it handle BIR compliance and tax filings?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Yes. YAHSHUA One tracks all BIR deadlines including 1601-C, 2550M, and quarterly returns. It generates BIR-ready reports and alerts you weeks before every filing deadline so you never incur penalties.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "Can YAHSHUA One handle HR onboarding and offboarding?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Yes. YAHSHUA One manages the full employee lifecycle — from digital onboarding and contract management to leave requests, overtime, and offboarding. Employees get a self-service portal to access their own records.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "Is YAHSHUA One built for Filipino businesses?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Yes. YAHSHUA One is specifically built for the Philippine business environment — including BIR, SSS, PhilHealth, and Pag-IBIG compliance, Philippine Labor Code leave policies, and peso-denominated reporting.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "How is YAHSHUA One different from other payroll or HR systems?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "YAHSHUA One combines payroll, accounting, compliance, and HR into one AI-powered platform — instead of four separate tools. It's built from the ground up for Filipino SMBs, which means Philippine-specific rules are baked in, not bolted on.",
                      },
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
