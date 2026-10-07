import type { Metadata } from "next";

const BASE_URL = "https://www.yahshua.one";

const DESCRIPTION =
  "YAHSHUA One Payroll with YAHSHUA HRIS included: ₱7,000 per month for up to 100 employees, ₱60 per additional employee, and a one-time ₱35,000 setup. VAT excluded. Book a free demo.";

export const metadata: Metadata = {
  title: "Pricing — YAHSHUA One",
  description: DESCRIPTION,
  alternates: {
    canonical: `${BASE_URL}/pricing`,
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: `${BASE_URL}/pricing`,
    siteName: "YAHSHUA One",
    title: "Pricing — YAHSHUA One",
    description: DESCRIPTION,
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
    description: DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

const faqs = [
  {
    q: "How much does YAHSHUA One Payroll cost?",
    a: "₱7,000 per month for up to 100 employees, with YAHSHUA HRIS included. Above 100 employees it is ₱60 per additional employee per month. There is a one-time ₱35,000 setup fee. All prices exclude VAT.",
  },
  {
    q: "Which YAHSHUA One modules can I buy today?",
    a: "YAHSHUA One Payroll is available today, with YAHSHUA HRIS included. Accounting, Tax and compliance, and ERP are coming soon and are not priced yet.",
  },
  {
    q: "What happens when I go over 100 employees?",
    a: "An additional ₱60 per employee per month is added on top of the ₱7,000 base rate. The calculator above shows your exact monthly cost for any headcount.",
  },
  {
    q: "Is there a setup fee?",
    a: "Yes. There is a one-time setup fee of ₱35,000, which covers full implementation, data migration, and dedicated onboarding training.",
  },
  {
    q: "Does YAHSHUA One Payroll come with YAHSHUA HRIS?",
    a: "Yes. Every plan includes YAHSHUA HRIS at no extra charge: employee management and 201 files, job posting and recruitment, leave, attendance and time tracking, DOLE compliance reports, and performance management.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes. The trial is 30 days, long enough to run your first payroll cycle before you commit.",
  },
  {
    q: "Is VAT included in the prices?",
    a: "No. All prices are VAT excluded. The 12% VAT is added to your invoice.",
  },
  {
    q: "I'm an existing YAHSHUA client. Does my pricing change?",
    a: "No. Existing clients transition to YAHSHUA One with their current pricing intact. YAHSHUA One is the new platform foundation, not a rebrand with new fees.",
  },
  {
    q: "Is pricing in pesos?",
    a: "Always ₱. Billing, invoices, and all client communications are in Philippine pesos. No FX math, no USD rate surprises.",
  },
  {
    q: "What if I only need payroll?",
    a: "YAHSHUA One Payroll runs as a standalone product, without the broader ERP and accounting modules. YAHSHUA HRIS is included, so you can use as much or as little of it as you need.",
  },
];

const pricingSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "@id": `${BASE_URL}/pricing#faq`,
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />
      {children}
    </>
  );
}
