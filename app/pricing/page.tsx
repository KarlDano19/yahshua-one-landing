"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

function useInView<T extends Element = HTMLDivElement>(threshold = 0.12) {
  const ref = { current: null as T | null };
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  });
  return { ref, visible };
}

import { useRef } from "react";

function Reveal({ children, delay = 0, direction = "up" }: {
  children: React.ReactNode; delay?: number;
  direction?: "up" | "left" | "right" | "scale";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const base = direction === "left" ? "reveal-left" : direction === "right" ? "reveal-right" : direction === "scale" ? "reveal-scale" : "reveal";
  return (
    <div ref={ref} className={`${base}${visible ? " visible" : ""}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ color = "var(--accent-2)" }: { color?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2.5 6.5L5 9L10.5 3.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const CALENDLY = "https://calendly.com/clientrelations-abba/presentation?utm_source=pricing&utm_medium=web&utm_campaign=yahshuaone";

const BASE_PRICE = 7000;
const INCLUDED_EMPLOYEES = 100;
const PER_EXTRA_EMPLOYEE = 60;
const VAT_RATE = 0.12;
const peso = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", minimumFractionDigits: 0, maximumFractionDigits: 0 });

const PAYROLL_INCLUDES = [
  "Automated payroll computation every cutoff",
  "SSS, PhilHealth, Pag-IBIG and BIR withholding tax",
  "Payslips and bank disbursement files",
];

const HRIS_INCLUDES = [
  "Employee management and 201 files",
  "Job posting and recruitment",
  "Leave, attendance, and time tracking",
  "DOLE compliance reports",
  "Performance management",
];

interface PricingModule {
  id: string;
  name: string;
  sub: string;
  live: boolean;
  text?: string;
}

const MODULES: PricingModule[] = [
  { id: "payroll", name: "Payroll", sub: "HRIS included", live: true },
  { id: "accounting", name: "Accounting", sub: "Books and reports", live: false, text: "Real-time bookkeeping and profit and loss reports." },
  { id: "tax", name: "Tax and compliance", sub: "BIR filings", live: false, text: "BIR deadlines tracked and returns drafted from your books." },
  { id: "erp", name: "ERP", sub: "Inventory, sales, purchasing", live: false, text: "Inventory, sales orders, purchasing, and vendors on one ledger." },
];

export default function PricingPage() {
  const [ctaOpen, setCtaOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [employees, setEmployees] = useState("25");
  const [moduleId, setModuleId] = useState("payroll");
  const activeModule = MODULES.find((m) => m.id === moduleId) ?? MODULES[0];

  const headcount = Math.max(1, Math.floor(Number(employees) || 0));
  const extraEmployees = Math.max(0, headcount - INCLUDED_EMPLOYEES);
  const subtotal = BASE_PRICE + extraEmployees * PER_EXTRA_EMPLOYEE;
  const vat = Math.round(subtotal * VAT_RATE);
  const total = subtotal + vat;

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 8);
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setCtaOpen(false); setMobileNavOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const btnBase: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 8,
    height: 44, padding: "0 18px", borderRadius: 999, border: "1px solid transparent",
    fontWeight: 500, fontSize: 14.5, cursor: "pointer", textDecoration: "none",
    transition: "background .2s ease, border-color .2s ease",
    fontFamily: "inherit",
  };
  const btnPrimary: React.CSSProperties = {
    ...btnBase, background: "var(--ink)", color: "#fff", borderColor: "var(--ink)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 2px rgba(15,17,21,0.18)",
  };
  const btnGhost: React.CSSProperties = {
    ...btnBase, background: "transparent", color: "var(--ink)", borderColor: "var(--line)",
  };
  const btnSm: React.CSSProperties = { height: 36, padding: "0 14px", fontSize: 13.5 };

  const faqs = [
    {
      q: "How much does YAHSHUA One Payroll cost?",
      a: "₱7,000 per month for up to 100 employees, with YAHSHUA HRIS included. Above 100 employees it is ₱60 per additional employee per month. There is no setup fee. Plan prices exclude VAT. Theo AI is optional and uses pay-as-you-go credits, which are priced separately and still being finalized.",
    },
    {
      q: "Does the plan include Theo AI credits?",
      a: "Not at the moment. Theo AI is optional and runs on pay-as-you-go credits. Credit pricing is still being finalized, so ask us for current rates. Theo needs a credit balance above zero to answer.",
    },
    {
      q: "Do I need a subscription to use Theo?",
      a: "No. You can buy credits whenever you need them, and Theo works as long as your balance is above zero.",
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
      a: "No. There is no setup fee.",
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
      q: "Is VAT included in the plan price?",
      a: "No. Plan prices are VAT excluded. The 12% VAT is added to your invoice.",
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

  return (
    <div style={{ background: "var(--bg)", color: "var(--ink)", minHeight: "100vh" }}>

      {/* ── NAV ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        backdropFilter: "blur(14px)",
        background: "color-mix(in oklab, var(--bg) 78%, transparent)",
        borderBottom: navScrolled ? "1px solid var(--line)" : "1px solid transparent",
        transition: "border-color .2s ease",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
            <a href="/" style={{ display: "flex", alignItems: "center", gap: 10 }} aria-label="YAHSHUA One home">
              <Image src="/logo.jpg" alt="YAHSHUA One" width={28} height={28} style={{ borderRadius: 8, objectFit: "cover", flexShrink: 0 }} priority />
              <span style={{ fontWeight: 600, letterSpacing: "-0.02em", fontSize: 16 }}>
                YAHSHUA <span style={{ color: "var(--muted)", fontWeight: 400 }}>One</span>
              </span>
            </a>

            <nav className="nav-links" aria-label="Primary">
              {[
                { label: "Platform",     href: "/#platform" },
                { label: "Modules",      href: "/#modules" },
                { label: "Intelligence", href: "/#intelligence" },
                { label: "Pricing",      href: "/pricing" },
                { label: "Support",      href: "/support" },
                { label: "What's New",   href: "/updates" },
              ].map((link) => (
                <a key={link.label} href={link.href} style={{
                  padding: "8px 12px", borderRadius: 8, fontSize: 14,
                  color: link.href === "/pricing" ? "var(--ink)" : "var(--ink-2)",
                  fontWeight: link.href === "/pricing" ? 500 : 400,
                  transition: "background .15s ease",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-tint)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="nav-cta">
              <a href="https://app.yahshua.one/" style={{ ...btnGhost, ...btnSm }}>Sign in</a>
              <button onClick={() => setCtaOpen(true)} style={{ ...btnPrimary, ...btnSm }}>
                Book a Demo <Arrow />
              </button>
            </div>
            <button className="nav-burger" onClick={() => setMobileNavOpen(v => !v)} aria-label="Toggle menu" aria-expanded={mobileNavOpen}>
              {mobileNavOpen
                ? <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                : <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 6H17M3 10H17M3 14H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              }
            </button>
          </div>
          <div className={`mobile-menu${mobileNavOpen ? " open" : ""}`}>
            {[
              { label: "Platform",     href: "/#platform" },
              { label: "Modules",      href: "/#modules" },
              { label: "Intelligence", href: "/#intelligence" },
              { label: "Pricing",      href: "/pricing" },
              { label: "Support",      href: "/support" },
              { label: "What's New",   href: "/updates" },
              { label: "Payroll",      href: "/payroll" },
            ].map((link) => (
              <a key={link.label} href={link.href} className="mobile-menu__link" onClick={() => setMobileNavOpen(false)}>{link.label}</a>
            ))}
            <hr />
            <div className="mobile-menu__ctas">
              <a href="https://app.yahshua.one/" style={{ ...btnGhost, ...btnSm }}>Sign in</a>
              <button onClick={() => { setCtaOpen(true); setMobileNavOpen(false); }} style={{ ...btnPrimary, ...btnSm }}>Book a Free Demo <Arrow /></button>
            </div>
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="section-pad-lg" style={{ textAlign: "center", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <h1 style={{
              fontSize: "clamp(36px, 5.5vw, 68px)", letterSpacing: "-0.04em",
              fontWeight: 500, lineHeight: 1.0, margin: "0 0 20px",
              textWrap: "balance" as React.CSSProperties["textWrap"],
            }}>
              Pricing by{" "}
              <em style={{ fontStyle: "normal", color: "var(--accent-2)" }}>module.</em>
            </h1>
            <p style={{ fontSize: 18, color: "var(--muted)", lineHeight: 1.65, maxWidth: 520, margin: "0 auto" }}>
              Payroll is available today. More modules are on the way.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── MODULE SELECTOR ── */}
      <section aria-label="Choose a module" style={{ padding: "48px 0 0" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 28px" }}>
          <div className="module-grid">
            {MODULES.map((m, i) => {
              const active = m.id === moduleId;
              return (
                <Reveal key={m.id} delay={i * 50}>
                  <button
                    type="button"
                    onClick={() => setModuleId(m.id)}
                    aria-pressed={active}
                    style={{
                      display: "block", textAlign: "left", width: "100%", height: "100%", cursor: "pointer",
                      fontFamily: "inherit", color: "var(--ink)", background: "var(--surface)",
                      borderRadius: "var(--radius)",
                      border: active ? "2px solid var(--accent)" : "1px solid var(--line)",
                      padding: active ? "17px 19px" : "18px 20px",
                    }}
                  >
                    <span style={{ display: "block", fontSize: 16, fontWeight: 500, letterSpacing: "-0.01em", marginBottom: 2 }}>{m.name}</span>
                    <span style={{ display: "block", fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>{m.sub}</span>
                    <span style={{
                      display: "inline-block", fontSize: 12, padding: "2px 10px", borderRadius: 999,
                      background: m.live ? "var(--accent-50)" : "var(--bg-tint)",
                      color: m.live ? "var(--accent-2)" : "var(--muted)",
                    }}>
                      {m.live ? "Available now" : "Coming soon"}
                    </span>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {activeModule.live ? (
      <>
      {/* ── PLAN ── */}
      <section id="plan" className="section-pad" style={{ borderBottom: "1px solid var(--line)", scrollMarginTop: 80 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 28px" }}>
          <div className="grid-2col-hero">
            <Reveal>
              <div style={{
                background: "var(--surface)", border: "1px solid var(--line)",
                borderRadius: "var(--radius-xl)", padding: 32, boxShadow: "var(--shadow)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
                  <span style={{ fontWeight: 600, fontSize: 17, letterSpacing: "-0.01em" }}>YAHSHUA One Payroll</span>
                  <span style={{
                    fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, padding: "3px 10px",
                    borderRadius: 999, background: "var(--accent-50)", color: "var(--accent-2)",
                  }}>
                    HRIS included
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                  <span style={{ fontSize: "clamp(40px, 5vw, 56px)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1 }}>
                    {peso.format(BASE_PRICE)}
                  </span>
                  <span style={{ color: "var(--muted)", fontSize: 16 }}>/month</span>
                </div>
                <div style={{ color: "var(--muted)", fontSize: 13, marginBottom: 28 }}>
                  Up to {INCLUDED_EMPLOYEES} employees. VAT excluded.
                </div>

                <label htmlFor="headcount" style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 8, color: "var(--ink-2)" }}>
                  How many employees?
                </label>
                <input
                  id="headcount"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={10000}
                  value={employees}
                  onChange={(e) => setEmployees(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: "var(--radius)",
                    fontSize: 15, color: "var(--ink)", background: "var(--bg)", border: "1px solid var(--line)",
                    outline: "none", fontFamily: "inherit",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--line)"; e.target.style.boxShadow = "none"; }}
                />

                <div style={{ marginTop: 24, fontSize: 14 }} aria-live="polite">
                  <div style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 10 }}>
                    Monthly breakdown
                  </div>
                  {[
                    { label: `Base (up to ${INCLUDED_EMPLOYEES} employees)`, value: peso.format(BASE_PRICE), show: true },
                    { label: `${extraEmployees} additional ${extraEmployees === 1 ? "employee" : "employees"} × ${peso.format(PER_EXTRA_EMPLOYEE)}`, value: peso.format(extraEmployees * PER_EXTRA_EMPLOYEE), show: extraEmployees > 0 },
                    { label: "Subtotal (VAT excl.)", value: peso.format(subtotal), show: true },
                    { label: "VAT (12%)", value: peso.format(vat), show: true },
                  ].filter((row) => row.show).map((row) => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "7px 0", color: "var(--muted)", borderBottom: "1px solid var(--line-2)" }}>
                      <span>{row.label}</span><span style={{ color: "var(--ink-2)" }}>{row.value}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "12px 0 0", fontWeight: 600, fontSize: 16 }}>
                    <span>Total with VAT</span><span>{peso.format(total)}</span>
                  </div>
                </div>

                <div style={{ marginTop: 24, padding: "16px 18px", borderRadius: "var(--radius)", background: "var(--bg-tint)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16, fontWeight: 500, fontSize: 15 }}>
                    <span>Setup fee</span><span>None</span>
                  </div>
                </div>

                <a href={CALENDLY} target="_blank" rel="noopener noreferrer"
                  style={{ ...btnPrimary, width: "100%", justifyContent: "center", marginTop: 24 }}>
                  Book a Free Demo <Arrow />
                </a>
                <div style={{ textAlign: "center", color: "var(--muted)", fontSize: 13, marginTop: 12 }}>
                  The trial is 30 days.
                </div>
              </div>
            </Reveal>

            <Reveal direction="left">
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 14px" }}>
                    YAHSHUA One Payroll
                  </h2>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                    {PAYROLL_INCLUDES.map((item) => (
                      <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 15, color: "var(--ink-2)", lineHeight: 1.5 }}>
                        <span style={{ marginTop: 4 }}><CheckIcon /></span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 14px" }}>
                    YAHSHUA HRIS, included
                  </h2>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                    {HRIS_INCLUDES.map((item) => (
                      <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 15, color: "var(--ink-2)", lineHeight: 1.5 }}>
                        <span style={{ marginTop: 4 }}><CheckIcon /></span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div id="theo-credits" style={{ scrollMarginTop: 90 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 14px" }}>
                    Theo AI, optional
                  </h2>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10, fontSize: 15, lineHeight: 1.6, color: "var(--muted)" }}>
                    <li style={{ color: "var(--ink-2)", fontWeight: 500 }}>
                      Theo AI runs on optional pay-as-you-go credits.
                    </li>
                    <li>
                      Credit pricing is still being finalized.{" "}
                      <a href={`${CALENDLY}&utm_content=theo-credits`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-2)", textDecoration: "underline", textUnderlineOffset: 2 }}>
                        Ask us for current rates
                      </a>.
                    </li>
                    <li>For now, no credits are included in the plan.</li>
                    <li>
                      Credits power Theo chat, payslip design, AI-generated reports, and handbook polish. Theo&apos;s onboarding setup and our human support don&apos;t use credits.
                    </li>
                    <li>Theo needs a credit balance above zero to answer.</li>
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── HOW PRICING SCALES ── */}
      <section className="section-pad" style={{ borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <h2 style={{ fontSize: "clamp(26px, 3.2vw, 40px)", letterSpacing: "-0.03em", fontWeight: 500, lineHeight: 1.1, margin: "0 0 12px" }}>
                Flat up to {INCLUDED_EMPLOYEES} employees.{" "}
                <em style={{ fontStyle: "normal", color: "var(--accent-2)" }}>A simple per-head fee after that.</em>
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: 16 }}>
            {[
              { label: `Up to ${INCLUDED_EMPLOYEES} employees`, value: peso.format(BASE_PRICE), note: "flat monthly rate" },
              { label: `${INCLUDED_EMPLOYEES + 1}+ employees`, value: peso.format(PER_EXTRA_EMPLOYEE), note: "per additional employee, per month" },
              { label: "Setup", value: peso.format(0), note: "no setup fee" },
            ].map((box, i) => (
              <Reveal key={box.label} delay={i * 60}>
                <div style={{ height: "100%", padding: "24px 24px 26px", borderRadius: "var(--radius)", background: "var(--surface)", border: "1px solid var(--line)" }}>
                  <div style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 12 }}>
                    {box.label}
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 8 }}>{box.value}</div>
                  <div style={{ color: "var(--muted)", fontSize: 14 }}>{box.note}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 13, margin: "24px 0 0" }}>
            Plan prices are VAT excluded. Prices verified: October 2026.
          </p>
        </div>
      </section>
      </>
      ) : (
      <section className="section-pad" style={{ borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-xl)", padding: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
                <h2 style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.02em", margin: 0 }}>{activeModule.name}</h2>
                <span style={{ fontSize: 12, padding: "2px 10px", borderRadius: 999, background: "var(--bg-tint)", color: "var(--muted)" }}>
                  Coming soon
                </span>
              </div>
              <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.6, margin: "0 0 8px" }}>{activeModule.text}</p>
              <p style={{ fontSize: 16, lineHeight: 1.6, margin: "0 0 24px" }}>Pricing for this module is not published yet.</p>
              <a href={`${CALENDLY}&utm_content=${activeModule.id}`} target="_blank" rel="noopener noreferrer" style={btnPrimary}>
                Ask about {activeModule.name} <Arrow />
              </a>
            </div>
          </Reveal>
        </div>
      </section>
      )}

      {/* ── FAQ ── */}
      <section className="section-pad" style={{ background: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <h2 style={{ fontSize: "clamp(26px, 3vw, 38px)", letterSpacing: "-0.03em", fontWeight: 500, margin: "0 0 40px", textAlign: "center" }}>
              Common questions
            </h2>
          </Reveal>
          {faqs.map((item, i) => (
            <Reveal key={item.q} delay={i * 40}>
              <details style={{
                borderTop: "1px solid var(--line)",
                ...(i === faqs.length - 1 ? { borderBottom: "1px solid var(--line)" } : {}),
              }}>
                <summary style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                  padding: "20px 4px", cursor: "pointer", listStyle: "none",
                  userSelect: "none", color: "var(--ink)", fontWeight: 500, fontSize: 15,
                }}>
                  {item.q}
                  <span style={{ flexShrink: 0, fontSize: 20, color: "var(--accent-2)", fontWeight: 300 }}>+</span>
                </summary>
                <div style={{ padding: "0 4px 20px", borderTop: "1px solid var(--line)" }}>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--muted)", margin: "16px 0 0" }}>{item.a}</p>
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="section-pad">
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <Reveal direction="scale">
            <div className="cta-card" style={{
              border: "1px solid var(--line)",
              background: "radial-gradient(70% 100% at 0% 100%, var(--accent-glow), transparent 60%), radial-gradient(60% 100% at 100% 0%, oklch(0.95 0.03 215 / 0.5), transparent 60%), var(--surface)",
              borderRadius: "var(--radius-xl)", textAlign: "center", position: "relative", overflow: "hidden",
            }}>
              <h2 style={{ fontSize: "clamp(30px, 4vw, 52px)", letterSpacing: "-0.035em", fontWeight: 500, lineHeight: 1.05, margin: "0 0 14px" }}>
                Ready to see it run?
              </h2>
              <p style={{ color: "var(--muted)", fontSize: 17, maxWidth: 460, margin: "0 auto 28px", lineHeight: 1.6 }}>
                Book a free 30-minute demo with our team. No prep required.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <a href={CALENDLY} target="_blank" rel="noopener noreferrer" style={btnPrimary}>
                  Book a Free Demo <Arrow />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: "40px 0", borderTop: "1px solid var(--line)", color: "var(--muted)", fontSize: 14 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Image src="/logo.jpg" alt="YAHSHUA One" width={24} height={24} style={{ borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
            <span style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>YAHSHUA One</span>
          </a>
          <nav style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[
              { label: "Home",     href: "/" },
              { label: "Payroll",  href: "/payroll" },
              { label: "Support",  href: "/support" },
              { label: "Updates",  href: "/updates" },
              { label: "Pricing",  href: "/pricing" },
            ].map((link) => (
              <a key={link.label} href={link.href}
                style={{ color: "var(--muted)", transition: "color .15s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}>
                {link.label}
              </a>
            ))}
          </nav>
          <span style={{ fontSize: 13 }}>© 2026 The ABBA Initiative (OPC). All rights reserved.</span>
        </div>
      </footer>

      {/* ── GET STARTED MODAL ── */}
      {ctaOpen && (
        <div
          onClick={() => setCtaOpen(false)}
          role="dialog" aria-modal="true" aria-label="Book a free demo"
          style={{
            position: "fixed", inset: 0, zIndex: 300,
            background: "rgba(10,14,20,0.72)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--bg)", borderRadius: 20,
              border: "1px solid var(--line)",
              padding: "44px 36px 36px",
              maxWidth: 420, width: "100%",
              boxShadow: "0 40px 100px rgba(0,0,0,0.28)",
              position: "relative",
            }}
          >
            <button
              onClick={() => setCtaOpen(false)}
              aria-label="Close"
              style={{
                position: "absolute", top: 16, right: 16,
                width: 30, height: 30, borderRadius: "50%",
                border: "1px solid var(--line)", background: "var(--surface)",
                color: "var(--muted)", cursor: "pointer",
                display: "grid", placeItems: "center", fontSize: 17, lineHeight: 1,
                fontFamily: "inherit",
              }}
            >×</button>
            <h3 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 500, letterSpacing: "-0.02em", color: "var(--ink)" }}>
              Are you a current YAHSHUA client?
            </h3>
            <p style={{ margin: "0 0 24px", fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>
              Let us point you to the right place.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a
                href="https://calendly.com/clientrelations-abba/presentation?utm_source=website&utm_medium=web&utm_campaign=yahshuaone"
                target="_blank" rel="noopener noreferrer"
                onClick={() => setCtaOpen(false)}
                style={{
                  display: "flex", flexDirection: "column", gap: 3, padding: "16px 20px",
                  borderRadius: 12, background: "var(--ink)", border: "1px solid var(--ink)",
                  textDecoration: "none",
                }}
              >
                <span style={{ fontWeight: 500, fontSize: 15, color: "#fff" }}>I&apos;m new to YAHSHUA</span>
                <span style={{ fontSize: 13, color: "oklch(0.58 0.01 250)" }}>Book a free demo with our team</span>
              </a>
              <a
                href="/support"
                onClick={() => setCtaOpen(false)}
                style={{
                  display: "flex", flexDirection: "column", gap: 3, padding: "16px 20px",
                  borderRadius: 12, background: "var(--surface)", border: "1px solid var(--line)",
                  textDecoration: "none",
                }}
              >
                <span style={{ fontWeight: 500, fontSize: 15, color: "var(--ink)" }}>Yes, I&apos;m an existing client</span>
                <span style={{ fontSize: 13, color: "var(--muted)" }}>Get help from support or your account manager</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
