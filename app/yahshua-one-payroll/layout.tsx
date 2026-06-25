import type { Metadata } from "next";

const BASE_URL = "https://www.yahshua.one";

export const metadata: Metadata = {
  title: "YAHSHUA One Payroll — Automated Payroll & Statutory Contributions for Filipino Businesses",
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
    canonical: `${BASE_URL}/yahshua-one-payroll`,
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: `${BASE_URL}/yahshua-one-payroll`,
    siteName: "YAHSHUA One",
    title: "YAHSHUA One Payroll — Payroll That Runs Itself",
    description:
      "Auto-compute payroll, SSS, PhilHealth, Pag-IBIG, and withholding tax for every employee. Built for Philippine Labor Code. Runs every cutoff with zero manual work.",
    images: [
      {
        url: "/og-image.jpg",
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
    images: ["/og-image.jpg"],
  },
};

export default function PayrollLayout({ children }: { children: React.ReactNode }) {
  return children;
}
