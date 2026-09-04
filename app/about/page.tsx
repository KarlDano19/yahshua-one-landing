"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

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

export default function AboutPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 8);
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => document.removeEventListener("scroll", onScroll);
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

  const eyebrow: React.CSSProperties = {
    fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11,
    letterSpacing: "0.12em", textTransform: "uppercase",
    color: "var(--accent-2)", marginBottom: 16,
  };
  const sectionH2: React.CSSProperties = {
    fontSize: "clamp(24px, 3vw, 32px)", letterSpacing: "-0.03em",
    fontWeight: 500, lineHeight: 1.2, margin: "0 0 16px",
  };
  const linkStyle: React.CSSProperties = {
    color: "var(--accent-2)", textDecoration: "underline", textUnderlineOffset: 3,
  };
  const gradientText: React.CSSProperties = {
    fontStyle: "normal",
    background: "linear-gradient(110deg, var(--accent-2) 5%, var(--accent) 50%, var(--accent-3) 95%)",
    WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
  };
  const accentWord: React.CSSProperties = { fontStyle: "normal", color: "var(--accent-2)" };

  const navLinks = [
    { label: "Platform",     href: "/#platform" },
    { label: "Modules",      href: "/#modules" },
    { label: "Intelligence", href: "/#intelligence" },
    { label: "Pricing",      href: "/pricing" },
    { label: "What's New",   href: "/updates" },
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
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} style={{
                  padding: "8px 12px", borderRadius: 8, fontSize: 14,
                  color: "var(--ink-2)", fontWeight: 400,
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
              <a href="/#waitlist" style={{ ...btnPrimary, ...btnSm }}>
                Get Started <Arrow />
              </a>
            </div>
            <button className="nav-burger" onClick={() => setMobileNavOpen(v => !v)} aria-label="Toggle menu" aria-expanded={mobileNavOpen}>
              {mobileNavOpen
                ? <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                : <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 6H17M3 10H17M3 14H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              }
            </button>
          </div>
          <div className={`mobile-menu${mobileNavOpen ? " open" : ""}`}>
            {[...navLinks, { label: "Payroll", href: "/payroll" }, { label: "About", href: "/about" }].map((link) => (
              <a key={link.label} href={link.href} className="mobile-menu__link" onClick={() => setMobileNavOpen(false)}>{link.label}</a>
            ))}
            <hr />
            <div className="mobile-menu__ctas">
              <a href="https://app.yahshua.one/" style={{ ...btnGhost, ...btnSm }}>Sign in</a>
              <a href="/#waitlist" style={{ ...btnPrimary, ...btnSm }} onClick={() => setMobileNavOpen(false)}>Get Started <Arrow /></a>
            </div>
          </div>
        </div>
      </div>

      {/* ── ABOUT ── */}
      <section className="section-pad-lg" style={{ textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <p style={eyebrow}>About</p>
            <h1 style={{
              fontSize: "clamp(32px, 4.5vw, 48px)", letterSpacing: "-0.04em",
              fontWeight: 500, lineHeight: 1.15, margin: "0 0 20px",
            }}>
              Built by a team that has done this for{" "}
              <em style={gradientText}>17 years.</em>
            </h1>
            <p style={{ fontSize: "clamp(16px, 1.6vw, 19px)", lineHeight: 1.6, color: "var(--muted)", margin: 0 }}>
              YAHSHUA One is an AI-native back-office platform for Filipino businesses: ERP, HR, payroll, accounting, and tax compliance unified in one workspace, built specifically for how Philippine businesses actually operate.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── WHAT WE DO ── */}
      <section className="section-pad-lg" style={{ borderTop: "1px solid var(--line)", background: "var(--bg-tint)" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <p style={eyebrow}>What we do</p>
            <h2 style={sectionH2}>Everything back-office, in <em style={accentWord}>one system.</em></h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--muted)", margin: "0 0 12px" }}>
              From day-to-day operations to year-end filings, YAHSHUA One keeps every transaction, employee record, and tax form in one schema: inventory and sales orders, payroll and statutory contributions, real-time accounting, and BIR-ready compliance reporting.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--muted)", margin: 0 }}>
              An AI assistant reads your actual data directly, so its answers come from your books, not the internet.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── SECURITY & COMPLIANCE ── */}
      <section className="section-pad-lg" style={{ borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <p style={eyebrow}>Security & compliance</p>
            <h2 style={sectionH2}>Compliance is <em style={accentWord}>never an afterthought.</em></h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--muted)", margin: 0 }}>
              YAHSHUA One is BIR-registered and independently audited for security, data privacy, and information security management.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <p style={{
              fontFamily: "var(--font-geist-mono, monospace)", fontSize: 10,
              letterSpacing: "0.10em", textTransform: "uppercase",
              color: "var(--soft)", margin: "32px 0 12px",
            }}>
              Bureau of Internal Revenue
            </p>
            <div className="grid-badges" style={{ marginBottom: 28 }}>
              {[
                { src: "/BIR%20Registration%20Seal%20Badge_1.png",  alt: "BIR Registration Seal Badge 1" },
                { src: "/BIR%20Registration%20Seal%20Badge_%202.png", alt: "BIR Registration Seal Badge 2" },
                { src: "/BIR%20Registration%20Seal%20Badge_3.png",  alt: "BIR Registration Seal Badge 3" },
              ].map((item, i) => (
                <div key={i} style={{
                  border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden",
                  background: "var(--surface)", boxShadow: "var(--shadow-sm)",
                }}>
                  <img src={item.src} alt={item.alt} loading="lazy" decoding="async"
                    style={{ width: "100%", height: "auto", display: "block" }} />
                </div>
              ))}
            </div>

            <p style={{
              fontFamily: "var(--font-geist-mono, monospace)", fontSize: 10,
              letterSpacing: "0.10em", textTransform: "uppercase",
              color: "var(--soft)", marginBottom: 12,
            }}>
              Security & privacy
            </p>
            <div className="grid-badges">
              {[
                { src: "/SOC2%20TYPE%202.png",                       alt: "SOC 2 Type II certified" },
                { src: "/EU%20GDPR.png",                             alt: "GDPR compliant" },
                { src: "/ISO27001-certificate-logo-4%20%281%29.png", alt: "ISO 27001 certified" },
              ].map((item, i) => (
                <div key={i} style={{
                  border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden",
                  background: "var(--surface)", boxShadow: "var(--shadow-sm)",
                }}>
                  <img src={item.src} alt={item.alt} loading="lazy" decoding="async"
                    style={{ width: "100%", height: "auto", display: "block" }} />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── WHO WE ARE ── */}
      <section className="section-pad-lg" style={{ borderTop: "1px solid var(--line)", background: "var(--bg-tint)" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <p style={eyebrow}>Who we are</p>
            <h2 style={sectionH2}>Part of a bigger <em style={accentWord}>back-office effort.</em></h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--muted)", margin: "0 0 12px" }}>
              YAHSHUA One is part of{" "}
              <a href="https://www.theabbainitiative.com/" target="_blank" rel="noopener noreferrer" style={linkStyle}>The ABBA Initiative</a>
              , the Philippine company behind the YAHSHUA name. Based in Cagayan de Oro, we&apos;ve been building payroll, HR, and compliance software for Filipino businesses for over 17 years.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--muted)", margin: 0 }}>
              The ABBA Initiative also builds{" "}
              <a href="https://www.yahshuapayroll.com" target="_blank" rel="noopener noreferrer" style={linkStyle}>YAHSHUA Payroll</a>
              {" "}and{" "}
              <a href="https://www.yahshuahris.com" target="_blank" rel="noopener noreferrer" style={linkStyle}>YAHSHUA HRIS</a>
              , our earlier products, still fully supported for existing customers. Prefer a done-for-you service instead?{" "}
              <a href="https://www.yahshua-abba.com/" target="_blank" rel="noopener noreferrer" style={linkStyle}>YAHSHUA Outsourcing Worldwide</a>
              {" "}runs it for you.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-pad-lg" style={{ borderTop: "1px solid var(--line)", textAlign: "center" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <h2 style={{ ...sectionH2, margin: "0 0 8px" }}>See it for <em style={accentWord}>yourself.</em></h2>
            <p style={{ fontSize: 15, color: "var(--muted)", margin: "0 0 24px" }}>
              Join the waitlist. No credit card required.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/#waitlist" style={btnPrimary}>Get Started <Arrow /></a>
              <a
                href="https://calendly.com/clientrelations-abba/presentation?utm_source=about&utm_medium=web&utm_campaign=yahshuaone"
                target="_blank" rel="noopener noreferrer" style={btnGhost}
              >
                Book a Demo
              </a>
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
              { label: "About",    href: "/about" },
              { label: "Payroll",  href: "/payroll" },
              { label: "Updates",  href: "/updates" },
              { label: "Pricing",  href: "/pricing" },
              { label: "The ABBA Initiative", href: "https://www.theabbainitiative.com/", external: true },
            ].map((link) => (
              <a key={link.label} href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                style={{ color: link.href === "/about" ? "var(--ink)" : "var(--muted)", transition: "color .15s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = link.href === "/about" ? "var(--ink)" : "var(--muted)")}>
                {link.label}
              </a>
            ))}
          </nav>
          <span style={{ fontSize: 13 }}>© 2026 The ABBA Initiative (OPC). All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
