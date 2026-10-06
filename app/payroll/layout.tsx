import type { Metadata } from "next";

const BASE_URL = "https://www.yahshua.one";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.abba.yahshuaone.mobile";

export const metadata: Metadata = {
  title: "YAHSHUA One Payroll — Automated Payroll & Statutory Contributions for Filipino Businesses ",
  description:
    "Automate payroll computation, SSS, PhilHealth, Pag-IBIG, and BIR 1601-C for every employee. YAHSHUA One Payroll is built for Philippine Labor Code compliance — runs itself every cutoff.",
  keywords: [
    "payroll system Philippines",
    "automated payroll Philippines",
    "SSS computation Philippines",
    "PhilHealth contribution Philippines",
    "Pag-IBIG contribution Philippines",
    "BIR 1601-C Philippines",
    "withholding tax computation Philippines",
    "13th month pay Philippines",
    "payslip generator Philippines",
    "HR payroll software Philippines",
    "TRAIN law withholding tax",
    "DOLE compliant payroll",
    "payroll cutoff automation",
    "bank disbursement payroll Philippines",
    "payroll for SMB Philippines",
  ],
  alternates: {
    canonical: `${BASE_URL}/payroll`,
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: `${BASE_URL}/payroll`,
    siteName: "YAHSHUA One",
    title: "YAHSHUA One Payroll — Payroll That Runs Itself",
    description:
      "Auto-compute payroll, SSS, PhilHealth, Pag-IBIG, and withholding tax for every employee. Built for Philippine Labor Code. Runs every cutoff with zero manual work.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "YAHSHUA One Payroll — Automated Payroll for Filipino Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YAHSHUA One Payroll — Payroll That Runs Itself",
    description:
      "Auto-compute payroll, SSS, PhilHealth, Pag-IBIG, and BIR 1601-C for every employee. Built for Filipino businesses.",
    images: ["/opengraph-image"],
  },
};

const payrollSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": `${BASE_URL}/payroll#software`,
      name: "YAHSHUA One Payroll",
      url: `${BASE_URL}/payroll`,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "Automated payroll system for Filipino businesses. Computes SSS, PhilHealth, Pag-IBIG, and BIR 1601-C withholding tax for every employee — runs every cutoff with zero manual work.",
      featureList: [
        "Automated payroll computation every cutoff",
        "SSS contribution auto-calculation",
        "PhilHealth contribution auto-calculation",
        "Pag-IBIG contribution auto-calculation",
        "BIR 1601-C withholding tax computation",
        "TRAIN Law tax table compliance",
        "13th month pay computation",
        "Payslip generation and distribution",
        "Bank disbursement file export",
        "Philippine Labor Code compliance",
      ],
      offers: {
        "@type": "Offer",
        priceCurrency: "PHP",
        description: "Custom quote after a short discovery call. Book a free demo.",
      },
      audience: {
        "@type": "Audience",
        audienceType: "Filipino business owners, HR managers, payroll officers",
        geographicArea: { "@type": "Country", name: "Philippines" },
      },
      inLanguage: "en-PH",
    },
    {
      "@type": "MobileApplication",
      "@id": `${BASE_URL}/payroll#mobile-app`,
      name: "YAHSHUA One",
      operatingSystem: "ANDROID",
      applicationCategory: "BusinessApplication",
      downloadUrl: PLAY_STORE_URL,
      installUrl: PLAY_STORE_URL,
      url: `${BASE_URL}/payroll#mobile-app`,
      description:
        "Employee mobile app for YAHSHUA One Payroll. Clock in and out with facial recognition or a system ID with geo-fencing, file requests such as leave, and approve requests from any device. Syncs to the payroll web app.",
      inLanguage: "en-PH",
    },
    {
      "@type": "FAQPage",
      "@id": `${BASE_URL}/payroll#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Does YAHSHUA One Payroll automatically compute SSS, PhilHealth, and Pag-IBIG?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. YAHSHUA One Payroll auto-computes SSS, PhilHealth, and Pag-IBIG contributions for every employee based on current government-mandated tables — both employee and employer shares — every payroll cutoff.",
          },
        },
        {
          "@type": "Question",
          name: "Does it handle BIR 1601-C withholding tax computation?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. YAHSHUA One Payroll computes monthly withholding tax per employee using the TRAIN Law tax table and generates the data needed for BIR Form 1601-C filing.",
          },
        },
        {
          "@type": "Question",
          name: "Can it generate payslips automatically?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. After every payroll run, YAHSHUA One generates itemized payslips for each employee showing gross pay, all deductions (SSS, PhilHealth, Pag-IBIG, withholding tax), and net pay.",
          },
        },
        {
          "@type": "Question",
          name: "Is YAHSHUA One Payroll compliant with the Philippine Labor Code?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. YAHSHUA One Payroll is built for the Philippine Labor Code — including semi-monthly cutoff schedules, 13th month pay, overtime, holiday pay, and night differential computation.",
          },
        },
        {
          "@type": "Question",
          name: "Does Theo read my actual payroll data?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Theo looks up records in your company's account, including payroll runs, employee records, leave requests and attendance logs, and answers from what it finds.",
          },
        },
        {
          "@type": "Question",
          name: "Can Theo change my payroll?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Only with your say-so. A change needs a role that's allowed to make it and your explicit confirmation.",
          },
        },
        {
          "@type": "Question",
          name: "Who can see what Theo shows?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Each person sees only what their role allows. Users without access to calculation details get a shorter answer with the formulas hidden.",
          },
        },
        {
          "@type": "Question",
          name: "Does YAHSHUA One have a mobile app?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The YAHSHUA One mobile app is currently available on Google Play for Android only. Employees clock in and out with facial recognition or their system ID, with geo-fencing for location validation, and file requests such as leave. Managers can approve requests from any device, and everything syncs to the payroll web app.",
          },
        },
        {
          "@type": "Question",
          name: "Is there an iPhone or iOS version of the YAHSHUA One app?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. The YAHSHUA One mobile app is currently available on Google Play for Android only. Managers can still approve requests from any device.",
          },
        },
      ],
    },
  ],
};

export default function PayrollLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(payrollSchema) }}
      />
      {children}
    </>
  );
}
