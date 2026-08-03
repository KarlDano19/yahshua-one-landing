import type { Metadata } from "next";
import Link from "next/link";

const BASE_URL = "https://www.yahshua.one";
const SUPPORT_EMAIL = "clientrelations@abba.owkrs";

export const metadata: Metadata = {
  title: "YAHSHUA One Support",
  description:
    "Need help with the YAHSHUA One app? Contact our support team, send a question or bug report, and find answers to common account, payroll, billing, and privacy questions.",
  alternates: {
    canonical: `${BASE_URL}/support`,
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: `${BASE_URL}/support`,
    siteName: "YAHSHUA One",
    title: "YAHSHUA One Support",
    description:
      "Need help with the YAHSHUA One app? Contact our support team and we’ll usually respond within 1–2 business days.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "YAHSHUA One Support",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YAHSHUA One Support",
    description:
      "Need help with the YAHSHUA One app? Contact our support team and we’ll usually respond within 1–2 business days.",
    images: ["/og-image.jpg"],
  },
};

const faqs = [
  {
    q: "I can’t log in. What should I do?",
    a: "First, double-check your email address and password. If that still fails, use your company’s password reset flow if available, then contact support if you’re locked out or no reset email arrives.",
  },
  {
    q: "I think there’s a payroll issue. What should I include?",
    a: "Send your company name, payroll period, affected employee or report, screenshots if possible, and a short note explaining what looks wrong. That helps the team investigate faster.",
  },
  {
    q: "How do I request account deletion?",
    a: "Email support with the account email address, company name, and your deletion request. We may need to verify account ownership before processing the request.",
  },
  {
    q: "Who do I contact for billing questions?",
    a: "Use the support form below or email support directly. Include your company name, billing contact, invoice reference if you have one, and the question or issue you want reviewed.",
  },
  {
    q: "How do I report a bug?",
    a: "Please share the steps you took, what you expected to happen, what actually happened, screenshots if available, and the device or browser you were using. Clear bug reports save everybody time.",
  },
];

export default function SupportPage() {
  return (
    <main style={{ background: "var(--bg)", color: "var(--ink)", minHeight: "100vh" }}>
      <section style={{ borderBottom: "1px solid var(--line)", background: "var(--surface)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "88px 28px 72px" }}>
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
            Support
          </div>
          <h1
            style={{
              fontSize: "clamp(38px, 5vw, 64px)",
              lineHeight: 1.02,
              letterSpacing: "-0.04em",
              fontWeight: 500,
              margin: "0 0 18px",
              maxWidth: 760,
            }}
          >
            YAHSHUA One Support
          </h1>
          <p
            style={{
              fontSize: 19,
              lineHeight: 1.6,
              color: "var(--muted)",
              maxWidth: 680,
              margin: 0,
            }}
          >
            Need help with the YAHSHUA One app? Contact our support team.
          </p>
        </div>
      </section>

      <section style={{ padding: "56px 0 32px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 28px" }}>
          <div className="grid-feature" style={{ alignItems: "start" }}>
            <div>
              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-xl)",
                  padding: 32,
                  boxShadow: "var(--shadow)",
                }}
              >
                <h2 style={{ fontSize: 28, letterSpacing: "-0.03em", margin: "0 0 12px", fontWeight: 500 }}>
                  Contact support
                </h2>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--muted)", margin: "0 0 24px" }}>
                  Use the form below for questions, account issues, payroll concerns, billing follow-up, or bug reports.
                </p>

                <form
                  action={`mailto:${SUPPORT_EMAIL}`}
                  method="post"
                  encType="text/plain"
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {[
                    { label: "Full name", name: "name", type: "text", placeholder: "Your name" },
                    { label: "Work email", name: "email", type: "email", placeholder: "you@company.com" },
                    { label: "Company", name: "company", type: "text", placeholder: "Your company" },
                    { label: "Subject", name: "subject", type: "text", placeholder: "What do you need help with?" },
                  ].map((field) => (
                    <label key={field.name} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-2)" }}>{field.label}</span>
                      <input
                        name={field.name}
                        type={field.type}
                        required
                        placeholder={field.placeholder}
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: "var(--radius)",
                          border: "1px solid var(--line)",
                          background: "var(--bg)",
                          color: "var(--ink)",
                          fontSize: 14,
                          outline: "none",
                          fontFamily: "inherit",
                        }}
                      />
                    </label>
                  ))}

                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-2)" }}>Issue type</span>
                    <select
                      name="issueType"
                      defaultValue=""
                      required
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "var(--radius)",
                        border: "1px solid var(--line)",
                        background: "var(--bg)",
                        color: "var(--ink)",
                        fontSize: 14,
                        outline: "none",
                        fontFamily: "inherit",
                      }}
                    >
                      <option value="" disabled>
                        Select one
                      </option>
                      <option value="login">Login or access</option>
                      <option value="payroll">Payroll or report issue</option>
                      <option value="billing">Billing</option>
                      <option value="account-deletion">Account deletion</option>
                      <option value="bug-report">Bug report</option>
                      <option value="other">Other</option>
                    </select>
                  </label>

                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-2)" }}>Message</span>
                    <textarea
                      name="message"
                      required
                      placeholder="Tell us what happened, what you need, and any details that will help us investigate faster."
                      rows={7}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "var(--radius)",
                        border: "1px solid var(--line)",
                        background: "var(--bg)",
                        color: "var(--ink)",
                        fontSize: 14,
                        outline: "none",
                        fontFamily: "inherit",
                        resize: "vertical",
                      }}
                    />
                  </label>

                  <button
                    type="submit"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      height: 48,
                      padding: "0 18px",
                      borderRadius: 999,
                      border: "1px solid var(--ink)",
                      background: "var(--ink)",
                      color: "#fff",
                      fontWeight: 500,
                      fontSize: 14.5,
                      fontFamily: "inherit",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 2px rgba(15,17,21,0.18)",
                    }}
                  >
                    Send support request
                  </button>
                </form>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-xl)",
                  padding: 28,
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <h2 style={{ fontSize: 22, letterSpacing: "-0.02em", margin: "0 0 14px", fontWeight: 500 }}>
                  Support details
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14.5, lineHeight: 1.65 }}>
                  <div>
                    <div style={{ color: "var(--soft)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>
                      Support email
                    </div>
                    <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: "var(--accent-2)", fontWeight: 500 }}>
                      {SUPPORT_EMAIL}
                    </a>
                  </div>
                  <div>
                    <div style={{ color: "var(--soft)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>
                      Response time
                    </div>
                    <p style={{ margin: 0, color: "var(--muted)" }}>We usually respond within 1–2 business days.</p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-xl)",
                  padding: 28,
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <h2 style={{ fontSize: 22, letterSpacing: "-0.02em", margin: "0 0 14px", fontWeight: 500 }}>
                  Company and legal
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 14.5, lineHeight: 1.65 }}>
                  <div>
                    <div style={{ color: "var(--soft)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>
                      Business name
                    </div>
                    <p style={{ margin: 0, color: "var(--ink-2)" }}>The ABBA Initiative, OPC</p>
                  </div>
                  <div>
                    <div style={{ color: "var(--soft)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>
                      Legal links
                    </div>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      <Link href="/privacy" style={{ color: "var(--accent-2)", fontWeight: 500 }}>
                        Privacy Policy
                      </Link>
                      <Link href="/terms" style={{ color: "var(--accent-2)", fontWeight: 500 }}>
                        Terms
                      </Link>
                    </div>
                  </div>
                  <p style={{ margin: 0, color: "var(--muted)", fontSize: 13.5 }}>
                    Additional legal contact details such as business address and phone number can be added here once confirmed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "24px 0 80px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 28px" }}>
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-xl)",
              padding: 32,
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontFamily: "var(--font-geist-mono, monospace)",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: 10,
                }}
              >
                FAQ
              </div>
              <h2 style={{ fontSize: 28, letterSpacing: "-0.03em", margin: 0, fontWeight: 500 }}>Common questions</h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {faqs.map((item) => (
                <details
                  key={item.q}
                  style={{
                    borderRadius: "var(--radius)",
                    overflow: "hidden",
                    border: "1px solid var(--line)",
                    background: "var(--bg)",
                  }}
                >
                  <summary
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 16,
                      padding: "18px 20px",
                      cursor: "pointer",
                      listStyle: "none",
                      fontWeight: 500,
                      fontSize: 15,
                    }}
                  >
                    {item.q}
                    <span style={{ color: "var(--accent-2)", fontSize: 20, fontWeight: 300 }}>+</span>
                  </summary>
                  <div style={{ padding: "0 20px 18px", borderTop: "1px solid var(--line)" }}>
                    <p style={{ margin: "14px 0 0", fontSize: 14, lineHeight: 1.7, color: "var(--muted)" }}>{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
