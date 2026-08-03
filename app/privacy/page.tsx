import type { Metadata } from "next";
import Link from "next/link";

const BASE_URL = "https://www.yahshua.one";
const SUPPORT_EMAIL = "clientrelations@abba.works";
const EFFECTIVE_DATE = "August 3, 2026";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the YAHSHUA One Privacy Policy, including what information we collect, how we use it, how we protect it, and how to contact us about privacy requests.",
  alternates: {
    canonical: `${BASE_URL}/privacy`,
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: `${BASE_URL}/privacy`,
    siteName: "YAHSHUA One",
    title: "YAHSHUA One Privacy Policy",
    description:
      "Learn how YAHSHUA One collects, uses, stores, and protects personal and business information.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "YAHSHUA One Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YAHSHUA One Privacy Policy",
    description:
      "Learn how YAHSHUA One collects, uses, stores, and protects personal and business information.",
    images: ["/og-image.jpg"],
  },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 36 }}>
      <h2
        style={{
          fontSize: 24,
          lineHeight: 1.15,
          letterSpacing: "-0.03em",
          fontWeight: 500,
          margin: "0 0 12px",
        }}
      >
        {title}
      </h2>
      <div style={{ display: "grid", gap: 14, color: "var(--muted)", fontSize: 15, lineHeight: 1.75 }}>{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <main style={{ background: "var(--bg)", color: "var(--ink)", minHeight: "100vh" }}>
      <section style={{ borderBottom: "1px solid var(--line)", background: "var(--surface)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "88px 28px 72px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              borderRadius: 999,
              border: "1px solid var(--line)",
              background: "var(--bg)",
              fontFamily: "var(--font-geist-mono, monospace)",
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 20,
            }}
          >
            Legal
          </div>
          <h1
            style={{
              fontSize: "clamp(38px, 5vw, 64px)",
              lineHeight: 1.02,
              letterSpacing: "-0.04em",
              fontWeight: 500,
              margin: "0 0 16px",
              maxWidth: 720,
            }}
          >
            Privacy Policy
          </h1>
          <p style={{ margin: "0 0 8px", fontSize: 16, color: "var(--muted)" }}>
            Effective date: {EFFECTIVE_DATE}
          </p>
          <p style={{ margin: 0, maxWidth: 680, fontSize: 18, lineHeight: 1.65, color: "var(--muted)" }}>
            This explains what information YAHSHUA One collects, how we use it, how we protect it, and how to reach us if you have privacy questions.
          </p>
        </div>
      </section>

      <section style={{ padding: "56px 0 88px" }}>
        <div
          style={{
            maxWidth: 860,
            margin: "0 auto",
            padding: "0 28px",
          }}
        >
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-xl)",
              padding: "32px clamp(24px, 4vw, 40px)",
              boxShadow: "var(--shadow)",
            }}
          >
            <Section title="1. Who this policy applies to">
              <p>
                This Privacy Policy applies to YAHSHUA One websites, applications, support channels, and related services operated by <strong style={{ color: "var(--ink-2)" }}>The ABBA Initiative, OPC</strong>.
              </p>
              <p>
                It applies to visitors, customers, prospective customers, account administrators, employees invited into customer workspaces, and people who contact us for support, billing, or other service questions.
              </p>
            </Section>

            <Section title="2. Information we collect">
              <p>We may collect information such as:</p>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>name, email address, company name, job title, and contact details;</li>
                <li>account credentials and authentication-related information;</li>
                <li>support requests, bug reports, billing questions, and related correspondence;</li>
                <li>usage, device, browser, log, and diagnostic information needed to operate and secure the service;</li>
                <li>customer-provided business, payroll, HR, accounting, compliance, or employee data processed inside YAHSHUA One.</li>
              </ul>
            </Section>

            <Section title="3. How we use information">
              <p>We use information to:</p>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>provide, maintain, secure, and improve YAHSHUA One;</li>
                <li>authenticate users and prevent fraud, abuse, or unauthorized access;</li>
                <li>respond to support requests, investigate incidents, and communicate with customers;</li>
                <li>process onboarding, billing, product updates, and operational notices;</li>
                <li>comply with legal obligations and enforce our agreements.</li>
              </ul>
            </Section>

            <Section title="4. Customer data and workspace information">
              <p>
                Customers may upload or input employee records, payroll information, government contribution details, tax data, schedules, reports, attachments, and other operational data. We process this information on behalf of the customer to provide the service.
              </p>
              <p>
                Customers are responsible for ensuring they have the right to provide this information and for configuring access appropriately within their organizations.
              </p>
            </Section>

            <Section title="5. Legal bases and permitted uses">
              <p>
                Depending on the context, we may process information because it is necessary to provide the service, respond to your request, pursue legitimate business interests such as security and product improvement, comply with law, or act on your consent where required.
              </p>
            </Section>

            <Section title="6. Sharing of information">
              <p>We do not sell personal information. We may share information only as reasonably necessary with:</p>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>service providers and infrastructure vendors who help us operate the platform;</li>
                <li>professional advisers, auditors, or legal counsel when needed;</li>
                <li>authorities or counterparties when required by law, regulation, court order, or to protect rights and security;</li>
                <li>successors in connection with a merger, acquisition, restructuring, or asset transfer.</li>
              </ul>
            </Section>

            <Section title="7. Data retention">
              <p>
                We retain information for as long as reasonably necessary to provide the service, maintain records, resolve disputes, enforce agreements, meet legal requirements, and support legitimate security and operational needs.
              </p>
              <p>
                Retention periods can vary depending on the type of information, the customer relationship, contractual obligations, and applicable law.
              </p>
            </Section>

            <Section title="8. Security">
              <p>
                We use reasonable administrative, technical, and organizational safeguards to protect information against unauthorized access, loss, misuse, alteration, or disclosure. No system is perfect, but we take security seriously and keep improving the controls around sensitive data.
              </p>
            </Section>

            <Section title="9. Your choices and rights">
              <p>
                Depending on applicable law, you may have rights to request access, correction, deletion, restriction, or objection regarding certain personal information. You may also request account-related help, support records, or deletion review by contacting us.
              </p>
              <p>
                If your information is processed through a customer workspace, we may direct your request to the relevant customer administrator where appropriate.
              </p>
            </Section>

            <Section title="10. Children’s privacy">
              <p>
                YAHSHUA One is intended for business use and is not directed to children. We do not knowingly collect personal information from children for consumer-facing use through this service.
              </p>
            </Section>

            <Section title="11. International processing">
              <p>
                Information may be processed where we or our service providers operate. By using the service, you understand that information may be transferred, stored, or processed in locations that may have different data protection rules than your jurisdiction, subject to appropriate safeguards where required.
              </p>
            </Section>

            <Section title="12. Changes to this policy">
              <p>
                We may update this Privacy Policy from time to time. When we do, we will update the effective date above and may provide additional notice when changes are material.
              </p>
            </Section>

            <Section title="13. Contact us">
              <p>
                If you have questions about this Privacy Policy or want to submit a privacy-related request, contact us at <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: "var(--accent-2)", fontWeight: 500 }}>{SUPPORT_EMAIL}</a>.
              </p>
              <p>
                You can also visit our <Link href="/support" style={{ color: "var(--accent-2)", fontWeight: 500 }}>Support page</Link> for general help requests.
              </p>
            </Section>
          </div>
        </div>
      </section>
    </main>
  );
}
