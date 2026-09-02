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

  const navLinks = [
    { label: "Platform",     href: "/#platform" },
    { label: "Modules",      href: "/#modules" },
    { label: "Intelligence", href: "/#intelligence" },
    { label: "Pricing",      href: "/pricing" },
    { label: "What's New",   href: "/updates" },
  ];

  const paths = [
    {
      label: "Run it yourself",
      heading: "Prefer to run it yourself?",
      body: (
        <>
          <strong style={{ color: "var(--ink)", fontWeight: 500 }}>YAHSHUA One</strong> is our AI-native software platform: payroll, HR, accounting, and tax compliance in one workspace, currently in early access.{" "}
          <a href="https://www.yahshuapayroll.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--ink)", textDecoration: "underline", textUnderlineOffset: 3 }}>YAHSHUA Payroll</a>{" "}
          and{" "}
          <a href="https://www.yahshuahris.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--ink)", textDecoration: "underline", textUnderlineOffset: 3 }}>YAHSHUA HRIS</a>{" "}
          are our earlier software products, still fully supported for existing customers.
        </>
      ),
      cta: { label: "Explore YAHSHUA One", href: "/" },
    },
    {
      label: "Run it for you",
      heading: "Prefer someone to run it for you?",
      body: (
        <>
          <strong style={{ color: "var(--ink)", fontWeight: 500 }}>YAHSHUA Outsourcing Worldwide Inc.</strong> is our outsourcing services company, a subsidiary of The ABBA Initiative, handling payroll, HR, and compliance work directly for client businesses, powered by our own YAHSHUA software.
        </>
      ),
      cta: { label: "Visit YAHSHUA Outsourcing Worldwide", href: "https://www.yahshua-abba.com/", external: true },
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

      {/* ── HERO ── */}
      <section className="section-pad-lg" style={{ textAlign: "center", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <h1 style={{
              fontSize: "clamp(36px, 5.5vw, 60px)", letterSpacing: "-0.04em",
              fontWeight: 500, lineHeight: 1.05, margin: "0 0 20px",
            }}>
              Who&apos;s behind YAHSHUA
            </h1>
            <p style={{ fontSize: "clamp(16px, 1.6vw, 19px)", lineHeight: 1.6, color: "var(--muted)", margin: 0 }}>
              The ABBA Initiative (OPC) is the parent company behind the YAHSHUA name. Based in Cagayan de Oro, Philippines, we&apos;ve been building payroll, HR, and compliance software and services for Filipino businesses for over 17 years.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── TWO PATHS ── */}
      <section className="section-pad-lg">
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <p style={{
              textAlign: "center", fontSize: 15, color: "var(--muted)",
              margin: "0 0 40px", fontWeight: 500,
            }}>
              There are two ways to work with us.
            </p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
            {paths.map((path, i) => (
              <Reveal key={path.label} delay={i * 80}>
                <div style={{
                  height: "100%", padding: 32, borderRadius: 16,
                  border: "1px solid var(--line)", background: "var(--surface)",
                  display: "flex", flexDirection: "column", gap: 14,
                }}>
                  <div style={{
                    fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11,
                    letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)",
                  }}>
                    {path.label}
                  </div>
                  <h2 style={{ fontSize: 21, fontWeight: 500, letterSpacing: "-0.02em", margin: 0 }}>
                    {path.heading}
                  </h2>
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--muted)", margin: 0, flexGrow: 1 }}>
                    {path.body}
                  </p>
                  <a
                    href={path.cta.href}
                    target={path.cta.external ? "_blank" : undefined}
                    rel={path.cta.external ? "noopener noreferrer" : undefined}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      fontSize: 14.5, fontWeight: 500, color: "var(--ink)",
                      textDecoration: "none", marginTop: 4,
                    }}
                  >
                    {path.cta.label} <Arrow />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p style={{ textAlign: "center", fontSize: 14, color: "var(--muted)", margin: "40px 0 0" }}>
              If you&apos;re already a customer of any of these products or services, nothing changes for you today.
            </p>
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
            ].map((link) => (
              <a key={link.label} href={link.href}
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
