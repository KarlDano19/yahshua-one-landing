import type { Metadata } from "next";
import Link from "next/link";

const BASE_URL = "https://www.yahshua.one";
const SUPPORT_EMAIL = "clientrelations@abba.works";
const EFFECTIVE_DATE = "August 3, 2026";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the YAHSHUA One Terms of Service, including account responsibilities, acceptable use, service availability, payment obligations, and liability limits.",
  alternates: {
    canonical: `${BASE_URL}/terms`,
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: `${BASE_URL}/terms`,
    siteName: "YAHSHUA One",
    title: "YAHSHUA One Terms of Service",
    description:
      "Review the terms that govern use of the YAHSHUA One website, app, and related services.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "YAHSHUA One Terms of Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YAHSHUA One Terms of Service",
    description:
      "Review the terms that govern use of the YAHSHUA One website, app, and related services.",
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

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p style={{ margin: "0 0 8px", fontSize: 16, color: "var(--muted)" }}>
            Effective date: {EFFECTIVE_DATE}
          </p>
          <p style={{ margin: 0, maxWidth: 680, fontSize: 18, lineHeight: 1.65, color: "var(--muted)" }}>
            These terms govern access to and use of the YAHSHUA One website, application, support channels, and related services.
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
            <Section title="1. Acceptance of terms">
              <p>
                By accessing or using YAHSHUA One, you agree to be bound by these Terms of Service. If you are using the service on behalf of a company or organization, you represent that you have authority to bind that entity to these terms.
              </p>
            </Section>

            <Section title="2. Service provider">
              <p>
                YAHSHUA One is operated by <strong style={{ color: "var(--ink-2)" }}>The ABBA Initiative, OPC</strong>.
              </p>
            </Section>

            <Section title="3. Eligibility and account responsibility">
              <p>
                You must provide accurate information, keep account credentials secure, and use the service only in a lawful and authorized way. You are responsible for activity under your account and for managing user access within your organization.
              </p>
            </Section>

            <Section title="4. Permitted use">
              <p>
                You may use YAHSHUA One for legitimate business, payroll, HR, accounting, compliance, support, and related internal operational purposes, subject to these terms and any applicable order, proposal, or customer agreement.
              </p>
            </Section>

            <Section title="5. Prohibited conduct">
              <p>You agree not to:</p>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>misuse the service, attempt unauthorized access, or interfere with security or availability;</li>
                <li>upload malicious code, exploit vulnerabilities, or disrupt the platform or other users;</li>
                <li>use the service in violation of law, regulation, employment obligations, or privacy rights;</li>
                <li>reverse engineer, copy, resell, or commercially exploit the service except as expressly allowed;</li>
                <li>use the service to store or process information you do not have the right to provide.</li>
              </ul>
            </Section>

            <Section title="6. Customer data">
              <p>
                You retain responsibility for the accuracy, legality, and appropriateness of data you submit to YAHSHUA One, including payroll, employee, accounting, and compliance information. You represent that you have all necessary permissions and lawful bases to provide and process that data through the service.
              </p>
            </Section>

            <Section title="7. Availability and changes">
              <p>
                We may improve, modify, suspend, or discontinue parts of the service from time to time. We aim for a reliable platform, but uninterrupted or error-free operation cannot be guaranteed.
              </p>
            </Section>

            <Section title="8. Fees and payment">
              <p>
                Certain parts of the service may be offered under paid plans, custom pricing, pilot terms, proposals, or separate commercial agreements. If fees apply, you agree to pay the amounts and timing communicated to you under the applicable commercial arrangement.
              </p>
            </Section>

            <Section title="9. Intellectual property">
              <p>
                The service, including its software, design, branding, content, and underlying technology, is owned by or licensed to The ABBA Initiative, OPC and protected by applicable intellectual property laws. These terms do not transfer ownership of the service or its underlying rights.
              </p>
            </Section>

            <Section title="10. Feedback">
              <p>
                If you share ideas, suggestions, or feedback, we may use them to improve the service without restriction or obligation to you, unless otherwise agreed in writing.
              </p>
            </Section>

            <Section title="11. Privacy">
              <p>
                Your use of the service is also governed by our <Link href="/privacy" style={{ color: "var(--accent-2)", fontWeight: 500 }}>Privacy Policy</Link>.
              </p>
            </Section>

            <Section title="12. Disclaimers">
              <p>
                YAHSHUA One is provided on an “as is” and “as available” basis to the fullest extent permitted by law. While we work hard to make the platform useful and dependable, we do not promise that it will be uninterrupted, error-free, or suitable for every specific use case without customer review and oversight.
              </p>
            </Section>

            <Section title="13. Limitation of liability">
              <p>
                To the fullest extent permitted by law, The ABBA Initiative, OPC and its affiliates, officers, employees, and service providers will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for loss of profits, revenue, data, goodwill, or business opportunity arising out of or related to the service.
              </p>
              <p>
                To the fullest extent permitted by law, total liability for claims arising out of or relating to the service will not exceed the amount paid by the customer for the relevant service during the twelve months preceding the event giving rise to the claim, or if no fees were paid, a reasonable nominal amount under applicable law.
              </p>
            </Section>

            <Section title="14. Indemnity">
              <p>
                You agree to indemnify and hold harmless The ABBA Initiative, OPC from claims, losses, liabilities, damages, and expenses arising out of your misuse of the service, your violation of these terms, or your infringement of another party’s rights.
              </p>
            </Section>

            <Section title="15. Termination">
              <p>
                We may suspend or terminate access if we reasonably believe the service is being misused, security is at risk, payment obligations are not met where applicable, or continued access would expose us or others to legal or operational harm.
              </p>
            </Section>

            <Section title="16. Governing terms and updates">
              <p>
                We may update these Terms of Service from time to time. Continued use of the service after updates take effect means you accept the revised terms.
              </p>
            </Section>

            <Section title="17. Contact us">
              <p>
                For questions about these terms, contact <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: "var(--accent-2)", fontWeight: 500 }}>{SUPPORT_EMAIL}</a> or use our <Link href="/support" style={{ color: "var(--accent-2)", fontWeight: 500 }}>Support page</Link>.
              </p>
            </Section>
          </div>
        </div>
      </section>
    </main>
  );
}
