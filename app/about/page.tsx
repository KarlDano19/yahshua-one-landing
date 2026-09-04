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
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <h1 style={{
              fontSize: "clamp(32px, 4.5vw, 48px)", letterSpacing: "-0.04em",
              fontWeight: 500, lineHeight: 1.1, margin: "0 0 20px",
            }}>
              About YAHSHUA One
            </h1>
            <p style={{ fontSize: "clamp(16px, 1.6vw, 19px)", lineHeight: 1.6, color: "var(--muted)", margin: "0 0 16px" }}>
              YAHSHUA One is built by{" "}
              <a href="https://www.theabbainitiative.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--ink)", textDecoration: "underline", textUnderlineOffset: 3 }}>
                The ABBA Initiative
              </a>
              , the company behind the YAHSHUA product suite.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--muted)", margin: 0 }}>
              Already using YAHSHUA Payroll or YAHSHUA HRIS? They&apos;re still fully supported. Prefer a done-for-you service instead?{" "}
              <a href="https://www.yahshua-abba.com/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--ink)", textDecoration: "underline", textUnderlineOffset: 3 }}>
                Visit YAHSHUA Outsourcing Worldwide
              </a>.
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
