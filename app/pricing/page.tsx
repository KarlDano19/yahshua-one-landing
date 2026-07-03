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

export default function PricingPage() {
  const [ctaOpen, setCtaOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

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

  const platformFeatures = [
    "ERP — Inventory, orders, procurement, vendors",
    "People & Payroll — Timekeeping, SSS, PhilHealth, Pag-IBIG",
    "Tax & Compliance — BIR forms auto-drafted and filed",
    "Accounting — Books tied to every transaction",
    "Theo AI — One assistant across all modules",
    "Multi-branch and multi-entity support",
  ];

  const payrollFeatures = [
    "Payroll computation, payslips, and payroll runs",
    "SSS, PhilHealth, Pag-IBIG auto-computed",
    "BIR 1601-C, 2316, 2306 ready",
    "Theo AI — answers from your actual payroll data",
    "Policy Handbook auto-generated from your settings",
    "Custom reports on demand",
  ];

  const pricingPrinciples = [
    {
      n: "01",
      title: "Per company, not per seat",
      body: "Your whole team — finance, HR, management — uses the platform for one company price. No per-user multipliers as your headcount grows.",
    },
    {
      n: "02",
      title: "Module-based",
      body: "Pay for the modules you activate. Start with payroll, add ERP and accounting when you're ready. You're not locked into the full suite on day one.",
    },
    {
      n: "03",
      title: "Always in pesos",
      body: "Quoted, billed, and collected in ₱. No FX math, no USD conversion surprises when the peso moves.",
    },
  ];

  const quoteSteps = [
    { n: "1", title: "Book a 30-minute call", desc: "Pick any open slot in our calendar. No prep required." },
    { n: "2", title: "We map your setup", desc: "Modules, team size, migration from existing YAHSHUA products, your current compliance pain points." },
    { n: "3", title: "You get a number", desc: "A clear ₱ figure, what's included, and a timeline to go live. Same call." },
  ];

  const faqs = [
    {
      q: "Is there a public price list?",
      a: "Not yet — we're in early access. Pricing is confirmed after a short discovery call where we understand your setup: team size, modules needed, and whether you're migrating from existing YAHSHUA products. Most clients get a number in one meeting.",
    },
    {
      q: "Is there a free trial?",
      a: "Early access partners get a structured onboarding session and a 30-day period to run their first payroll cycle before committing to a subscription.",
    },
    {
      q: "I'm an existing YAHSHUA client. Does my pricing change?",
      a: "No. Existing clients transition to YAHSHUA One with their current pricing intact. YAHSHUA One is the new platform foundation — not a rebrand with new fees.",
    },
    {
      q: "Is pricing in pesos?",
      a: "Always ₱. Billing, invoices, and all client communications are in Philippine pesos. No FX math, no USD rate surprises.",
    },
    {
      q: "What if I only need payroll?",
      a: "YAHSHUA One Payroll is available as a standalone product. You get the full payroll engine, Theo AI, and BIR compliance tools without the broader ERP and accounting modules.",
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
                Get Started <Arrow />
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
              { label: "What's New",   href: "/updates" },
              { label: "Payroll",      href: "/payroll" },
            ].map((link) => (
              <a key={link.label} href={link.href} className="mobile-menu__link" onClick={() => setMobileNavOpen(false)}>{link.label}</a>
            ))}
            <hr />
            <div className="mobile-menu__ctas">
              <a href="https://app.yahshua.one/" style={{ ...btnGhost, ...btnSm }}>Sign in</a>
              <button onClick={() => { setCtaOpen(true); setMobileNavOpen(false); }} style={{ ...btnPrimary, ...btnSm }}>Get Started <Arrow /></button>
            </div>
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <section style={{ padding: "96px 0 80px", textAlign: "center", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div style={{
              fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "var(--muted)", marginBottom: 20,
            }}>
              Pricing
            </div>
            <h1 style={{
              fontSize: "clamp(36px, 5.5vw, 68px)", letterSpacing: "-0.04em",
              fontWeight: 500, lineHeight: 1.0, margin: "0 0 20px",
            }}>
              Priced for Philippine SMBs.{" "}
              <em style={{ fontStyle: "normal", color: "var(--accent-2)" }}>Not repriced from&nbsp;USD.</em>
            </h1>
            <p style={{ fontSize: 18, color: "var(--muted)", lineHeight: 1.65, maxWidth: 520, margin: "0 auto 36px" }}>
              One platform. Modular pricing. No per-seat surprises. Start with the modules your business actually needs, and add more as you grow.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href={CALENDLY} target="_blank" rel="noopener noreferrer" style={btnPrimary}>
                Book a call <Arrow />
              </a>
              <a href="/#waitlist" style={btnGhost}>
                Join the waitlist
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TWO TRACKS ── */}
      <section style={{ padding: "80px 0", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <p style={{
              textAlign: "center", fontFamily: "var(--font-geist-mono, monospace)",
              fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
              color: "var(--muted)", marginBottom: 48,
            }}>
              Two ways in
            </p>
          </Reveal>

          <div className="grid-2col" style={{ gap: 24, alignItems: "stretch" }}>

            {/* Platform — dark card */}
            <Reveal>
              <div style={{
                border: "1px solid var(--ink)", borderRadius: "var(--radius-xl)",
                padding: "40px 36px", background: "var(--ink)", color: "#F7F6F1",
                display: "flex", flexDirection: "column", height: "100%",
              }}>
                <div style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-3)", marginBottom: 12 }}>
                  Full platform
                </div>
                <h2 style={{ fontSize: 26, fontWeight: 500, letterSpacing: "-0.025em", margin: "0 0 10px", color: "#fff" }}>
                  YAHSHUA One
                </h2>
                <p style={{ fontSize: 15, color: "oklch(0.65 0.01 250)", lineHeight: 1.65, margin: "0 0 28px" }}>
                  The complete back office. ERP, payroll, tax, accounting, and AI — sharing one dataset, one login, one source of truth.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 auto", display: "flex", flexDirection: "column", gap: 11 }}>
                  {platformFeatures.map((f) => (
                    <li key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "oklch(0.82 0.01 250)" }}>
                      <span style={{ marginTop: 2 }}><CheckIcon color="var(--accent-3)" /></span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid oklch(0.24 0.012 250)" }}>
                  <div style={{ fontSize: 13, color: "oklch(0.48 0.01 250)", marginBottom: 14 }}>
                    Quoted per company · Billed in ₱
                  </div>
                  <a href={CALENDLY} target="_blank" rel="noopener noreferrer" style={{
                    display: "inline-flex", alignItems: "center", gap: 8, height: 44, padding: "0 18px",
                    borderRadius: 999, background: "#fff", color: "var(--ink)",
                    fontWeight: 500, fontSize: 14.5, textDecoration: "none",
                  }}>
                    Get a quote <Arrow />
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Payroll standalone — light card */}
            <Reveal delay={80}>
              <div style={{
                border: "1px solid var(--line)", borderRadius: "var(--radius-xl)",
                padding: "40px 36px", background: "var(--surface)",
                display: "flex", flexDirection: "column", height: "100%",
              }}>
                <div style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 12 }}>
                  Standalone
                </div>
                <h2 style={{ fontSize: 26, fontWeight: 500, letterSpacing: "-0.025em", margin: "0 0 10px" }}>
                  YAHSHUA One Payroll
                </h2>
                <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.65, margin: "0 0 28px" }}>
                  The full payroll engine without the broader ERP and accounting modules. Everything your payroll team needs, nothing it doesn&apos;t.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 auto", display: "flex", flexDirection: "column", gap: 11 }}>
                  {payrollFeatures.map((f) => (
                    <li key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "var(--ink-2)" }}>
                      <span style={{ marginTop: 2 }}><CheckIcon /></span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--line)" }}>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>
                    Quoted per company · Billed in ₱
                  </div>
                  <a href={CALENDLY} target="_blank" rel="noopener noreferrer" style={btnPrimary}>
                    Get a quote <Arrow />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── HOW PRICING WORKS ── */}
      <section style={{ padding: "80px 0", background: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <h2 style={{ fontSize: "clamp(26px, 3vw, 38px)", letterSpacing: "-0.03em", fontWeight: 500, margin: "0 0 48px", textAlign: "center" }}>
              How pricing works
            </h2>
          </Reveal>
          <div className="grid-steps">
            {pricingPrinciples.map((step, i) => (
              <Reveal key={step.n} delay={i * 70}>
                <div style={{
                  padding: 32, border: "1px solid var(--line)",
                  borderRadius: "var(--radius-lg)", background: "var(--bg)", height: "100%",
                }}>
                  <div style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, color: "var(--accent-2)", letterSpacing: "0.08em", marginBottom: 16 }}>
                    {step.n}
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 10px" }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 14.5, color: "var(--muted)", lineHeight: 1.65, margin: 0 }}>
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTE PROCESS ── */}
      <section style={{ padding: "80px 0", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 28px" }}>
          <div className="grid-2col-hero">
            <Reveal>
              <div>
                <div style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>
                  Getting a quote
                </div>
                <h2 style={{ fontSize: "clamp(26px, 3.2vw, 40px)", letterSpacing: "-0.03em", fontWeight: 500, lineHeight: 1.08, margin: "0 0 16px" }}>
                  One call.<br />One number.
                </h2>
                <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.65, margin: "0 0 28px" }}>
                  No RFP, no enterprise sales theater. Book a 30-minute call. We understand your setup — team size, modules, whether you&apos;re coming from existing YAHSHUA products. You leave with a ₱ figure.
                </p>
                <a href={CALENDLY} target="_blank" rel="noopener noreferrer" style={btnPrimary}>
                  Schedule a call <Arrow />
                </a>
              </div>
            </Reveal>

            <Reveal direction="left">
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {quoteSteps.map((item) => (
                  <div key={item.n} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <span style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: "var(--accent-50)", color: "var(--accent-2)",
                      display: "grid", placeItems: "center",
                      fontSize: 13, fontWeight: 600, flexShrink: 0,
                      fontFamily: "var(--font-geist-mono, monospace)",
                    }}>
                      {item.n}
                    </span>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.55 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "80px 0", background: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
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
      <section style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <Reveal direction="scale">
            <div className="cta-card" style={{
              border: "1px solid var(--line)",
              background: "radial-gradient(70% 100% at 0% 100%, var(--accent-glow), transparent 60%), radial-gradient(60% 100% at 100% 0%, oklch(0.95 0.03 215 / 0.5), transparent 60%), var(--surface)",
              borderRadius: "var(--radius-xl)", textAlign: "center", position: "relative", overflow: "hidden",
            }}>
              <h2 style={{ fontSize: "clamp(30px, 4vw, 52px)", letterSpacing: "-0.035em", fontWeight: 500, lineHeight: 1.05, margin: "0 0 14px" }}>
                Ready to talk numbers?
              </h2>
              <p style={{ color: "var(--muted)", fontSize: 17, maxWidth: 460, margin: "0 auto 28px", lineHeight: 1.6 }}>
                Book a call with our team. 30 minutes, one outcome: a clear ₱ figure for your business.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <a href={CALENDLY} target="_blank" rel="noopener noreferrer" style={btnPrimary}>
                  Book a call <Arrow />
                </a>
                <a href="/#waitlist" style={btnGhost}>
                  Join the waitlist
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
          <span style={{ fontSize: 13 }}>© 2026 YAHSHUA One, Inc.</span>
        </div>
      </footer>

      {/* ── GET STARTED MODAL ── */}
      {ctaOpen && (
        <div
          onClick={() => setCtaOpen(false)}
          role="dialog" aria-modal="true" aria-label="Get started"
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
                <span style={{ fontSize: 13, color: "oklch(0.58 0.01 250)" }}>Book a free presentation with our team</span>
              </a>
              <button
                onClick={() => { setCtaOpen(false); window.location.href = "/#waitlist"; }}
                style={{
                  display: "flex", flexDirection: "column", gap: 3, padding: "16px 20px",
                  borderRadius: 12, background: "var(--surface)", border: "1px solid var(--line)",
                  textAlign: "left", cursor: "pointer", fontFamily: "inherit",
                }}
              >
                <span style={{ fontWeight: 500, fontSize: 15, color: "var(--ink)" }}>Yes, I&apos;m an existing client</span>
                <span style={{ fontSize: 13, color: "var(--muted)" }}>Join the waitlist for early platform access</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
