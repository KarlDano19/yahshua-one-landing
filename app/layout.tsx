import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Analytics from "./components/Analytics";
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
const PARENT_ORG_ID = "https://www.theabbainitiative.com/#organization";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "YAHSHUA One — Automated Payroll, BIR Compliance & HR System for Filipino Businesses",
    template: "%s | YAHSHUA One",
  },
  description:
    "YAHSHUA One Payroll computes SSS, PhilHealth, Pag-IBIG and withholding tax, generates payslips and BIR files, and adds an Android clock-in app.",
  keywords: [
    "automated payroll Philippines",
    "payroll system Philippines",
    "BIR compliance software Philippines",
    "BIR filing system Philippines",
    "HR system Philippines",
    "SSS PhilHealth Pag-IBIG automatic computation",
    "business management system Philippines",
    "AI payroll Philippines",
    "Filipino business software",
    "HR software Philippines",
    "leave management system Philippines",
    "payslip generator Philippines",
    "employee management system Philippines",
    "small business software Philippines",
    "government contribution calculator Philippines",
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
      "Stop doing payroll manually. YAHSHUA One computes your payroll and generates payslips and BIR, SSS, PhilHealth and Pag-IBIG files, built specifically for Filipino businesses.",
    images: [
      {
        url: "/opengraph-image",
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
      "Automated payroll, BIR files, SSS, PhilHealth and Pag-IBIG contributions, and payslips, built for Filipino businesses.",
    images: ["/opengraph-image"],
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
        <meta name="geo.region" content="PH" />
        <meta name="geo.placename" content="Philippines" />
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
                    "An AI-powered back-office platform for Filipino SMBs, starting with payroll: salary computation, SSS, PhilHealth and Pag-IBIG contributions, withholding tax, payslips, BIR and government files, leave and attendance tracking, and an Android clock-in app.",
                  url: BASE_URL,
                  applicationCategory: "BusinessApplication",
                  operatingSystem: "Web",
                  offers: {
                    "@type": "Offer",
                    priceCurrency: "PHP",
                    description: "YAHSHUA One Payroll: PHP 7,000 per month for up to 100 employees, PHP 60 per additional employee, with no setup fee. The YAHSHUA HRIS app is included at no extra charge once it launches. Plan prices exclude VAT. Theo AI is optional and uses pay-as-you-go credits, priced separately.",
                    url: `${BASE_URL}/pricing`,
                  },
                  featureList: [
                    "Automated payroll generation",
                    "SSS contribution computation",
                    "PhilHealth contribution computation",
                    "Pag-IBIG contribution computation",
                    "BIR forms: 1601-C, 1604-C with alphalists and 2316",
                    "2307 withholding summary per contractor (PDF, Excel)",
                    "SSS, PhilHealth and Pag-IBIG remittance files",
                    "Leave requests and approvals",
                    "Attendance and time tracking",
                    "Android clock-in app with facial recognition and geo-fencing",
                    "Payslip generation",
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
                  screenshot: `${BASE_URL}/opengraph-image`,
                  publisher: { "@id": PARENT_ORG_ID },
                },
                {
                  "@type": "WebSite",
                  "@id": `${BASE_URL}/#website`,
                  url: BASE_URL,
                  name: "YAHSHUA One",
                  description:
                    "AI-powered payroll, BIR compliance, HR, and accounting system for Filipino businesses",
                  publisher: { "@id": PARENT_ORG_ID },
                  inLanguage: "en-PH",
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
                        text: "Partly. YAHSHUA One Payroll generates the BIR files your payroll produces: 1601-C (PDF, Excel and the BIR eSubmission file), 1604-C with alphalists, and 2316, plus a 2307 summary for each contractor in PDF and Excel (a summary layout, not the official BIR form). It also produces SSS, PhilHealth and Pag-IBIG remittance files. You download them and upload them to the government portals yourself. It does not track deadlines, send alerts or file for you, and it does not cover VAT or income tax returns.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "Can YAHSHUA One handle HR onboarding and offboarding?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Partly. YAHSHUA One Payroll keeps employee records and handles leave requests, attendance and time tracking: employees clock in and file requests from the Android app, and managers approve them. A fuller YAHSHUA HRIS app is launching soon.",
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
                        text: "Most systems only cover one area: payroll, HR, or accounting. YAHSHUA One is being built to bring them together in one AI-powered platform, starting with payroll, which is available today. It is built specifically for Filipino SMBs, not adapted from a foreign product.",
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
        <Analytics />
      </body>
    </html>
  );
}

