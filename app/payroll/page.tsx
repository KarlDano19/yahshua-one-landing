"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

/* ── Intersection observer ── */
function useInView<T extends Element = HTMLDivElement>(threshold = 0.12) {
  const ref = useRef<T>(null);
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
  }, [threshold]);
  return { ref, visible };
}

/* ── Count-up animation ── */
function useCountUp(from: number, to: number, duration: number, active: boolean): number {
  const [val, setVal] = useState(from);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const ease = 1 - Math.pow(1 - t, 4);
      setVal(from + (to - from) * ease);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, from, to, duration]);
  return val;
}

/* ── Reveal wrapper ── */
function Reveal({ children, delay = 0, className = "", direction = "up" }: {
  children: React.ReactNode; delay?: number; className?: string;
  direction?: "up" | "left" | "right" | "scale" | "clip" | "blur" | "img";
}) {
  const { ref, visible } = useInView();
  const base =
    direction === "left"  ? "reveal-left"  :
    direction === "right" ? "reveal-right" :
    direction === "scale" ? "reveal-scale" :
    direction === "clip"  ? "reveal-clip"  :
    direction === "blur"  ? "reveal-blur"  :
    direction === "img"   ? "reveal-img"   :
    "reveal";
  return (
    <div ref={ref}
      className={`${base}${visible ? " visible" : ""}${className ? " " + className : ""}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ── Icons ── */
function Dot({ light = false }: { light?: boolean }) {
  return (
    <span style={{
      display: "inline-block", width: 6, height: 6, borderRadius: "50%",
      background: light ? "var(--accent-3)" : "var(--accent)",
      boxShadow: light ? "0 0 0 4px oklch(0.78 0.13 215 / 0.2)" : "0 0 0 4px var(--accent-glow)",
      flexShrink: 0,
    }} />
  );
}

function Arrow({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={{ transition: "transform .2s ease", flexShrink: 0 }}>
      <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Check({ size = 14, color = "var(--accent-2)" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2.5 7L5.5 10L11.5 4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Animated stat ── */
function AnimatedStat({ from, to, format, delay, lbl }: {
  from: number; to: number; format: (v: number) => string; delay: number; lbl: string;
}) {
  const { ref, visible } = useInView<HTMLDivElement>(0.3);
  const val = useCountUp(from, to, 1400, visible);
  return (
    <div ref={ref} className="stat-item" style={{ padding: "40px 28px" }}>
      <Reveal delay={delay}>
        <div style={{ fontSize: "clamp(38px, 4.8vw, 60px)", letterSpacing: "-0.04em", fontWeight: 700, lineHeight: 1, marginBottom: 10 }}>
          <em style={{ fontStyle: "normal", color: "var(--accent-2)" }}>{format(val)}</em>
        </div>
        <div style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.5 }}>{lbl}</div>
      </Reveal>
    </div>
  );
}

/* ── FAQ item ── */
function FaqItem({ q, a, delay }: { q: string; a: React.ReactNode; delay: number }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={delay}>
      <div style={{ borderRadius: "var(--radius)", background: "var(--surface)", border: "1px solid var(--line)" }}>
        <button onClick={() => setOpen(v => !v)} aria-expanded={open} style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
          padding: "20px 24px", cursor: "pointer", textAlign: "left", background: "none", border: "none",
          color: "var(--ink)", fontWeight: 500, fontSize: 15, fontFamily: "inherit",
        }}>
          {q}
          <span aria-hidden style={{
            flexShrink: 0, fontSize: 20, color: "var(--accent-2)", fontWeight: 300, display: "inline-block",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
          }}>+</span>
        </button>
        <div style={{ display: "grid", gridTemplateRows: open ? "1fr" : "0fr", transition: "grid-template-rows 0.32s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          <div style={{ overflow: "hidden", minHeight: 0 }}>
            <div style={{ borderTop: "1px solid var(--line)", padding: "16px 24px 20px" }}>
              <div style={{ fontSize: 14, lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>{a}</div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ── Marquee strip ── */
function MarqueeStrip() {
  const items = [
    "SSS auto-compute", "₱1,125.00 employee share", "PhilHealth ₱1,250.00",
    "Pag-IBIG ₱200.00", "BIR 1601-C ready", "TRAIN Law withholding",
    "13th month per DOLE", "Night diff & overtime", "De minimis cap tracked",
    "₱14,705.62 net pay", "0 computation errors", "Theo AI answers compliance",
  ];
  return (
    <div className="marquee-wrapper" aria-hidden="true">
      <div className="marquee-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="marquee-item">
            <span className="marquee-dot" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SHOWCASE DATA
══════════════════════════════════════════════════════════ */
const SHOWCASE = [
  {
    num: "01", dark: true,
    label: "Theo AI",
    title: "Ask anything. Theo reads your actual company data.",
    body: "Theo is your payroll AI. It knows your configuration, your employees, your policies, and your compliance setup. Ask about your de minimis cap, your overtime multiplier, or how a specific employee's net was computed. Theo can also take action for you: drafting formulas, flagging anomalies, or pulling specific reports, all within your account permissions.",
    bullets: [
      "Reads your real payroll data, not generic answers",
      "Answers BIR, SSS, PhilHealth, Pag-IBIG questions",
      "Acts on your behalf within your permission level",
      "Full conversation history per topic",
    ],
    clip: "/clip-theo.mp4", img: "/ss-theo.jpg",
    alt: "Theo AI conversation showing de minimis cap analysis with ₱8,000 annual cap warning and formula suggestion",
    flip: true,
  },
  {
    num: "03", dark: false,
    label: "Policy Handbook",
    title: "Your policy manual, written from your settings.",
    body: "The Policy Handbook reads your payroll configuration and turns it into a plain-language document. Pay Schedule, Rate Calculation, Overtime Rules, Night Differential, Government Contributions, Withholding Tax, De Minimis Benefits: all explained, all linked back to the exact setting behind each rule. You didn't write any of it. When your settings change, it updates on its own.",
    bullets: [
      "Auto-generated from your actual settings",
      "Links every policy to the exact setting behind it",
      "HR-ready language, zero manual writing",
      "Updates automatically when settings change",
    ],
    clip: "/clip-handbook.mp4", img: "/ss-handbook.jpg",
    alt: "YAHSHUA One Policy Handbook showing Pay Schedule section with semi-monthly cutoffs and payday offset settings",
    flip: false,
  },
  {
    num: "04", dark: true,
    label: "Custom Reports",
    title: "Standard reports included. Anything else, just ask.",
    body: "YAHSHUA One Payroll ships with standard reports for every common payroll need. For anything beyond that, describe what you need and the AI generates it from your own company data: contribution summaries, overtime trends, headcount by department, payroll cost breakdowns. Every report respects your permission level.",
    bullets: [
      "Standard reports out of the box",
      "AI-generated custom reports on demand",
      "Timesheets, files, and payroll run previews",
      "Permission-aware output",
    ],
    clip: "/clip-reports.mp4", img: "/ss-reports.jpg",
    alt: "YAHSHUA One Reports page showing custom reports including Government Contributions Summary and Overtime Trend",
    flip: true,
  },
  {
    num: "05", dark: false,
    label: "Organizational Chart",
    title: "Set up your structure. See your org chart.",
    body: "Define your departments, divisions, sections, units, sub-units, and locations inside YAHSHUA One Payroll. The organizational chart builds itself from that data. One of the most requested features from existing YAHSHUA users, now built directly into the platform. No separate tool required.",
    bullets: [
      "Departments, divisions, sections, units",
      "Locations and cost centers",
      "Visual org chart from your structure",
      "Updates automatically as your org changes",
    ],
    clip: "/clip-orgchart.mp4", img: "/ss-orgchart.jpg",
    alt: "YAHSHUA One org chart showing hierarchical structure with Human Resources, Operations, and Customer Success departments",
    flip: false,
  },
  {
    num: "06", dark: true,
    label: "Components & Formulas",
    title: "Custom formulas. Theo writes them for you.",
    body: "Every pay component in YAHSHUA One Payroll is formula-driven. Basic pay, overtime, night differential, allowances: you can inspect and customize any of them. If formula syntax feels unfamiliar, you can ask Theo to draft it for you in plain language. The Flow Builder lets you control the full sequence of your payroll computation.",
    bullets: [
      "Formula editor for every pay component",
      "Ask Theo to write formulas in plain language",
      "Flow Builder for full payroll run sequence",
      "Decision rules, lookup tables, basis catalog",
    ],
    clip: "/clip-formulas.mp4", img: "/ss-formulas.jpg",
    alt: "YAHSHUA One Components and Formulas page showing Basic Pay formula with Ask Theo prompt to draft formulas",
    flip: true,
  },
] as const;

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
export default function PayrollPage() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [ctaOpen, setCtaOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 8);
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setVideoOpen(false); setCtaOpen(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = videoOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [videoOpen]);

  const btnBase: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 8, height: 44, padding: "0 18px",
    borderRadius: 999, border: "1px solid transparent", fontWeight: 500, fontSize: 14.5,
    cursor: "pointer", textDecoration: "none",
    transition: "background .2s ease, border-color .2s ease, box-shadow .2s ease",
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

  /* Hero-specific button styles (dark bg context) */
  const btnHeroPrimary: React.CSSProperties = {
    ...btnBase, background: "#F7F6F1", color: "var(--ink)", borderColor: "#F7F6F1",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
  };
  const btnHeroGhost: React.CSSProperties = {
    ...btnBase, background: "transparent", color: "oklch(0.82 0.01 250)", borderColor: "oklch(0.3 0.015 250)",
  };

  /* Dark showcase section CTA */
  const btnDarkCta: React.CSSProperties = {
    ...btnBase, background: "#F7F6F1", color: "var(--ink)", borderColor: "#F7F6F1",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
  };

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
              <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "var(--accent-50)", color: "var(--accent-2)", fontFamily: "var(--font-geist-mono, monospace)", letterSpacing: "0.04em", fontWeight: 500, marginLeft: 2 }}>Payroll</span>
            </a>
            <nav className="nav-links" aria-label="Primary">
              {[
                { label: "Features",       href: "#features"   },
                { label: "Compliance",     href: "#compliance" },
                { label: "FAQ",            href: "#faq"        },
                { label: "← All modules", href: "/#modules"   },
              ].map((link) => (
                <a key={link.label} href={link.href}
                  style={{ padding: "8px 12px", borderRadius: 8, fontSize: 14, color: "var(--ink-2)", transition: "background .15s ease" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-tint)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  {link.label}
                </a>
              ))}
              <div style={{ position: "relative" }}
                onMouseEnter={() => setAppsOpen(true)}
                onMouseLeave={() => setAppsOpen(false)}>
                <button style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "8px 12px", borderRadius: 8, fontSize: 14, color: "var(--ink-2)",
                  background: appsOpen ? "var(--bg-tint)" : "transparent",
                  border: "none", cursor: "pointer", fontFamily: "inherit",
                  transition: "background .15s ease",
                }}>
                  Apps
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ transition: "transform .15s ease", transform: appsOpen ? "rotate(180deg)" : "rotate(0deg)", opacity: 0.6 }}>
                    <path d="M2 4L5.5 7.5L9 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {appsOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)",
                    background: "var(--bg)", border: "1px solid var(--line)",
                    borderRadius: 12, padding: 6, minWidth: 220,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                    zIndex: 100,
                  }}>
                    <a href="/payroll" style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "10px 12px", borderRadius: 8,
                      color: "var(--ink)", textDecoration: "none", fontSize: 14,
                      transition: "background .15s ease",
                    }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-tint)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                      <Image src="/logo.jpg" alt="" width={22} height={22} style={{ borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 13, lineHeight: 1.3 }}>YAHSHUA One Payroll</div>
                        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}>Automated payroll & compliance</div>
                      </div>
                    </a>
                  </div>
                )}
              </div>
            </nav>
            <div className="nav-cta">
              <a href="https://app.yahshua.one/" style={{ ...btnGhost, ...btnSm }}>Sign in</a>
              <button onClick={() => setCtaOpen(true)} style={{ ...btnPrimary, ...btnSm }}>Get Started <Arrow /></button>
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
              { label: "Features",       href: "#features"   },
              { label: "Compliance",     href: "#compliance" },
              { label: "FAQ",            href: "#faq"        },
              { label: "← All modules", href: "/#modules"   },
            ].map((link) => (
              <a key={link.label} href={link.href} className="mobile-menu__link" onClick={() => setMobileNavOpen(false)}>{link.label}</a>
            ))}
            <hr />
            <div className="mobile-menu__ctas">
              <a href="https://app.yahshua.one/" style={{ ...btnGhost, ...btnSm }}>Sign in</a>
              <button onClick={() => setCtaOpen(true)} style={{ ...btnPrimary, ...btnSm }}>Get Started <Arrow /></button>
            </div>
          </div>
        </div>
      </div>

      {/* ── HERO (dark) ── */}
      <div style={{ background: "var(--ink)", color: "#F7F6F1" }}>
        <header style={{ padding: "72px 0 64px", position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", top: -180, left: "50%", transform: "translateX(-50%)",
            width: 1100, height: 600, pointerEvents: "none", zIndex: 0, filter: "blur(20px)",
            background: "radial-gradient(45% 55% at 50% 30%, oklch(0.78 0.13 215 / 0.22), transparent 70%), radial-gradient(35% 45% at 30% 50%, oklch(0.5 0.1 215 / 0.18), transparent 70%)",
          }} />
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px", position: "relative", zIndex: 1 }}>
            <div className="grid-2col-hero">

              {/* Left copy */}
              <div>
                <Reveal delay={60}>
                  <h1 style={{
                    margin: "0 0 22px",
                    fontSize: "clamp(46px, 6.5vw, 84px)",
                    lineHeight: 1.0, letterSpacing: "-0.04em", fontWeight: 300,
                    color: "#F7F6F1",
                    textWrap: "balance" as React.CSSProperties["textWrap"],
                  }}>
                    Payroll that{" "}
                    <em style={{ fontStyle: "normal", color: "var(--accent-3)", fontWeight: 800 }}>knows your company.</em>
                  </h1>
                </Reveal>
                <Reveal delay={120}>
                  <p style={{ fontSize: 18, lineHeight: 1.65, color: "oklch(0.68 0.01 250)", maxWidth: 500, margin: "0 0 32px" }}>
                    Set up once, run every cutoff without thinking about it. SSS, PhilHealth, Pag-IBIG, withholding tax, 13th month: all computed automatically. Payslips ready before you ask. And when a question comes up, Theo reads your actual data and gives you a precise answer.
                  </p>
                </Reveal>
                <Reveal delay={180}>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <button onClick={() => setCtaOpen(true)} style={btnHeroPrimary}>Get Started <Arrow /></button>
                    <a href="#features" style={btnHeroGhost}>See how it works</a>
                  </div>
                </Reveal>
              </div>

              {/* Right: video */}
              <Reveal direction="left" delay={80}>
                <div style={{
                  borderRadius: 18, overflow: "hidden",
                  boxShadow: "0 40px 100px rgba(0,0,0,0.55)",
                  border: "1px solid oklch(0.22 0.012 250)",
                }}>
                  <div style={{ height: 36, background: "oklch(0.1 0.01 250)", display: "flex", alignItems: "center", gap: 6, padding: "0 14px", borderBottom: "1px solid oklch(0.18 0.01 250)" }}>
                    {["oklch(0.55 0.18 25)", "oklch(0.7 0.16 70)", "oklch(0.6 0.18 145)"].map((bg, i) => (
                      <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: bg }} />
                    ))}
                    <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                      <span style={{ fontSize: 11, color: "oklch(0.38 0.01 250)", fontFamily: "var(--font-geist-mono, monospace)", background: "oklch(0.15 0.01 250)", border: "1px solid oklch(0.22 0.01 250)", borderRadius: 5, padding: "2px 12px" }}>
                        app.yahshua.one · Payroll
                      </span>
                    </div>
                  </div>
                  <div style={{ position: "relative" }}>
                    <video
                      autoPlay muted loop playsInline
                      poster="/ss-employees.jpg"
                      style={{ width: "100%", display: "block" }}
                    >
                      <source src="/payroll-preview.mp4" type="video/mp4" />
                    </video>
                    <button
                      onClick={() => setVideoOpen(true)}
                      aria-label="Watch the full walkthrough"
                      style={{
                        position: "absolute", bottom: 14, left: 14,
                        display: "inline-flex", alignItems: "center", gap: 7,
                        padding: "7px 14px 7px 10px",
                        background: "rgba(10,14,20,0.72)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.13)",
                        borderRadius: 999, color: "#fff",
                        fontSize: 12.5, fontWeight: 500,
                        cursor: "pointer", fontFamily: "inherit",
                        transition: "background .2s ease, border-color .2s ease",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(10,14,20,0.9)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(10,14,20,0.72)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.13)"; }}
                    >
                      <span style={{
                        width: 22, height: 22, borderRadius: "50%",
                        background: "var(--accent-3)", display: "grid", placeItems: "center", flexShrink: 0,
                      }}>
                        <svg width="8" height="10" viewBox="0 0 8 10" fill="none">
                          <path d="M1 1L7 5L1 9V1Z" fill="#0a1418" />
                        </svg>
                      </span>
                      Watch the full walkthrough
                    </button>
                  </div>
                </div>
              </Reveal>

            </div>
          </div>
        </header>
      </div>

      {/* ── STAT STRIP ── */}
      <section style={{ borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="stat-strip">
            <div className="stat-item" style={{ padding: "40px 28px" }}>
              <Reveal delay={0}>
                <div style={{ fontSize: "clamp(38px, 4.8vw, 60px)", letterSpacing: "-0.04em", fontWeight: 700, lineHeight: 1, marginBottom: 10 }}>
                  <em style={{ fontStyle: "normal", color: "var(--accent-2)" }}>0 errors</em>
                </div>
                <div style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.5 }}>Payroll computation accuracy across all employees</div>
              </Reveal>
            </div>
            <div className="stat-item" style={{ padding: "40px 28px" }}>
              <Reveal delay={40}>
                <div style={{ fontSize: "clamp(38px, 4.8vw, 60px)", letterSpacing: "-0.04em", fontWeight: 700, lineHeight: 1, marginBottom: 10 }}>
                  <em style={{ fontStyle: "normal", color: "var(--accent-2)" }}>{"< 5 min"}</em>
                </div>
                <div style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.5 }}>Average time to run full payroll for a 50-person team</div>
              </Reveal>
            </div>
            <AnimatedStat from={0} to={99.97}
              format={(v) => (v >= 99.9 ? v.toFixed(2) : Math.round(v).toString()) + "%"}
              delay={80} lbl="BIR filing accuracy on 1601-C, 2550M, quarterly returns" />
            <AnimatedStat from={4800} to={0}
              format={(v) => "₱ " + (Math.round(v) >= 1000 ? Math.round(v).toLocaleString("en-US") : Math.round(v).toString())}
              delay={120} lbl="Penalty exposure when deadlines are managed by YAHSHUA" />
          </div>
        </div>
      </section>

      {/* ── SHOWCASE ── */}
      <div id="features">
        {SHOWCASE.map((feat, i) => {
          const d = feat.dark;
          return (
            <section
              key={feat.num}
              className={`showcase-section${d ? " dark" : ""}`}
              style={{ background: d ? "var(--ink)" : "var(--bg)" }}
            >
              <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
                <div className={`showcase-grid${feat.flip ? " flip" : ""}`}>

                  {/* Text */}
                  <Reveal delay={60} direction="blur">
                    <div>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 8, marginBottom: 20,
                        fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11,
                        letterSpacing: "0.1em", textTransform: "uppercase",
                        color: d ? "var(--accent-3)" : "var(--accent-2)",
                      }}>
                        <Dot light={d} />{feat.label}
                      </div>
                      <h2 style={{
                        fontSize: "clamp(28px, 3.2vw, 44px)", fontWeight: 600,
                        letterSpacing: "-0.03em", lineHeight: 1.1,
                        margin: "0 0 18px",
                        color: d ? "#F7F6F1" : "var(--ink)",
                        textWrap: "balance" as React.CSSProperties["textWrap"],
                      }}>
                        {feat.title}
                      </h2>
                      <p style={{
                        fontSize: 16, lineHeight: 1.7,
                        color: d ? "oklch(0.65 0.01 250)" : "var(--muted)",
                        margin: "0 0 28px", maxWidth: 480,
                      }}>
                        {feat.body}
                      </p>
                      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 10 }}>
                        {feat.bullets.map((b) => (
                          <li key={b} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14.5, color: d ? "oklch(0.78 0.01 250)" : "var(--ink-2)" }}>
                            <span style={{ width: 20, height: 20, borderRadius: 6, background: d ? "oklch(0.2 0.025 215)" : "var(--accent-50)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                              <Check size={11} color={d ? "var(--accent-3)" : "var(--accent-2)"} />
                            </span>
                            {b}
                          </li>
                        ))}
                      </ul>
                      <button onClick={() => setCtaOpen(true)} style={d ? btnDarkCta : btnPrimary}>Get Started <Arrow /></button>
                    </div>
                  </Reveal>

                  {/* Feature clip */}
                  <Reveal delay={0} direction="img" className="showcase-img">
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      poster={feat.img}
                      aria-label={feat.alt}
                      style={{ width: "100%", display: "block" }}
                    >
                      <source src={feat.clip} type="video/mp4" />
                    </video>
                  </Reveal>

                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* ── COMPLIANCE ── */}
      <section id="compliance" className="section-pad" style={{ borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div className="grid-ai" style={{ background: "var(--ink)", color: "#F7F6F1", borderRadius: "var(--radius-xl)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(50% 60% at 90% 0%, var(--accent-glow), transparent 60%), radial-gradient(40% 50% at 0% 100%, oklch(0.7 0.12 215 / 0.18), transparent 60%)" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-3)", marginBottom: 14 }}>
                  <Dot light /> Philippine Compliance
                </div>
                <h2 style={{ fontSize: "clamp(28px, 3.2vw, 42px)", letterSpacing: "-0.03em", fontWeight: 500, lineHeight: 1.08, margin: "0 0 18px" }}>
                  Every statutory deduction,{" "}
                  <em style={{ fontStyle: "normal", color: "var(--accent-3)" }}>auto-computed.</em>
                </h2>
                <p style={{ color: "oklch(0.65 0.01 250)", fontSize: 16, lineHeight: 1.6, margin: "0 0 28px", maxWidth: 440 }}>
                  YAHSHUA One is built around Philippine government agencies from the start. Rates update automatically. No manual table lookups, no calculation errors.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
                  {[
                    { label: "SSS",        color: "#5B8EE8" },
                    { label: "PhilHealth", color: "#5BAF8E" },
                    { label: "Pag-IBIG",   color: "#E8965B" },
                    { label: "BIR 1601-C", color: "#C45BAF" },
                    { label: "DOLE",       color: "#8E8EE8" },
                  ].map((badge) => (
                    <div key={badge.label} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 999, border: `1px solid ${badge.color}44`, background: `${badge.color}18`, fontSize: 12.5, fontWeight: 500, color: badge.color }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: badge.color, flexShrink: 0 }} />{badge.label}
                    </div>
                  ))}
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    "Contribution tables update automatically when government rates change",
                    "Withholding tax computed per TRAIN Law and Revenue Regulations",
                    "13th month auto-computed per DOLE formula, filed on time",
                    "1601-C reports generated monthly, ready for eBIRForms upload",
                  ].map((item) => (
                    <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "oklch(0.78 0.01 250)" }}>
                      <span style={{ width: 20, height: 20, borderRadius: 5, background: "oklch(0.22 0.02 215)", color: "var(--accent-3)", display: "grid", placeItems: "center", flexShrink: 0, marginTop: 1 }}>
                        <svg width="11" height="11" viewBox="0 0 11 11"><path d="M2 5.5L4.5 8L9 3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid oklch(0.28 0.012 250)", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
                  <img
                    src="/ss-payslip.jpg"
                    alt="Payslip breakdown showing net pay, government contributions and year-to-date totals"
                    width={1200} height={800}
                    loading="lazy"
                    decoding="async"
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── BIR REGISTRATION ── */}
      <section className="section-pad" style={{ borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>
                <Dot /> Official Registration
              </div>
              <h2 style={{ fontSize: "clamp(24px, 3vw, 38px)", letterSpacing: "-0.03em", fontWeight: 500, lineHeight: 1.08, margin: "0 0 14px" }}>
                BIR Registered.
              </h2>
              <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
                YAHSHUA One holds active BIR registration. You can run payroll knowing the platform behind it is compliant.
              </p>
            </div>
          </Reveal>

          <div className="grid-badges" style={{ maxWidth: 900, margin: "0 auto" }}>
            {[
              { src: "/BIR%20Registration%20Seal%20Badge_1.png", label: "BIR Registration Seal Badge 1" },
              { src: "/BIR%20Registration%20Seal%20Badge_%202.png", label: "BIR Registration Seal Badge 2" },
              { src: "/BIR%20Registration%20Seal%20Badge_3.png", label: "BIR Registration Seal Badge 3" },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 80}>
                <div style={{
                  border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden",
                  background: "var(--surface)", boxShadow: "var(--shadow)",
                }}>
                  <img
                    src={item.src}
                    alt={item.label}
                    loading="lazy"
                    decoding="async"
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: "80px 0", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 768, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", letterSpacing: "-0.025em", fontWeight: 500, margin: "0 0 40px" }}>
              Payroll questions, answered.
            </h2>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <FaqItem delay={0} q="Does YAHSHUA One automatically compute SSS, PhilHealth, and Pag-IBIG contributions?"
              a="Yes. YAHSHUA One computes SSS (employee and employer share), PhilHealth (both shares), and Pag-IBIG (both shares) automatically based on each employee's monthly basic salary. Contribution tables are kept current. When government agencies update their rates, YAHSHUA updates too." />
            <FaqItem delay={40} q="How does YAHSHUA handle withholding tax computation?"
              a="YAHSHUA uses the BIR's TRAIN Law tax table (RR 11-2018) to compute monthly withholding tax for each employee. It accounts for exemptions, de minimis benefits, and 13th month pay exclusions. The monthly 1601-C report is generated automatically." />
            <FaqItem delay={80} q="Can it handle different pay schedules (semi-monthly, monthly)?"
              a="Yes. You can set semi-monthly or monthly payroll cutoffs per company or per department. Statutory contributions and tax are apportioned correctly across pay periods." />
            <FaqItem delay={120} q="What happens if an employee is absent or late?"
              a="Tardiness, undertime, and absences are auto-deducted based on the employee's daily rate and your attendance policy. Absences approved as leave are excluded from deductions." />
            <FaqItem delay={160} q="Does it generate BIR Form 2316 (Certificate of Compensation)?"
              a="Yes. YAHSHUA generates BIR Form 2316 for each employee at year-end, based on the full-year payroll data. Employees can download it from their self-service portal." />
            <FaqItem delay={200} q="Can YAHSHUA handle the 13th month pay computation?"
              a="Yes. 13th month pay is computed automatically per DOLE guidelines: your total basic pay for the year divided by 12. The Payroll module generates the disbursement and the required Establishment Report to DOLE." />
            <FaqItem delay={240} q="What are the differences between YPO and Y1P?"
              a={<>
                Y1P is a ground-up rebuild of the payroll platform. Key differences include:
                <ul style={{ margin: "10px 0 0", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 5 }}>
                  <li>Modern, faster tech stack with improved performance and scalability</li>
                  <li>Three-tier payroll configuration (company → pay group → individual employee) so rules can be tailored at any level without affecting others</li>
                  <li>Built-in employee self-service portal for leaves, overtime, payslips, and more</li>
                  <li>Integrated accounting module with direct GL posting</li>
                  <li>AI-assisted payroll copilot for faster issue resolution</li>
                  <li>Facial recognition attendance with geo-fencing</li>
                  <li>Mobile approvals for managers</li>
                </ul>
              </>} />
            <FaqItem delay={280} q="What new features does Y1P offer?"
              a={<>
                Y1P includes features not available in YPO:
                <ul style={{ margin: "10px 0 0", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 5 }}>
                  <li>Employee self-service portal — file leaves, OT, OB, cash advances, and view payslips anytime</li>
                  <li>Facial recognition + geo-fencing — modern attendance clocking with location validation</li>
                  <li>Mobile approvals — managers can approve requests from any device</li>
                  <li>Configurable formula engine — full catalogue of premium pay types (OT, night differential, all holiday types, rest day, retro pay, longevity pay, and more) plus support for custom formulas</li>
                  <li>Three-tier config cascade — rules differ per pay group or per employee without manual overrides each run</li>
                  <li>Automated allowance and deduction rules — triggered by employee status changes</li>
                  <li>Back pay and final pay modules</li>
                  <li>Deduction priority management</li>
                  <li>Full audit logs — every rate, formula, and income setup change is tracked</li>
                  <li>Integrated accounting — payroll entries post directly to GL accounts</li>
                </ul>
              </>} />
            <FaqItem delay={320} q='What does "AI-driven payroll" mean?'
              a="Y1P includes an AI copilot accessible from within the app. It helps you understand payroll computations, surface discrepancies, and answer questions about your payroll data in plain language — without needing to dig through reports manually. It works on top of your actual company data, not generic templates." />
            <FaqItem delay={360} q="Will Y1P support our current payroll processes?"
              a="Yes. Y1P covers the complete Philippine payroll cycle: time and attendance, leave management, pay computation with full premium pay support, government contributions (SSS, PhilHealth, Pag-IBIG), BIR withholding tax, payslip generation, and all statutory compliance reports. Complex setups — multiple pay schedules, shift work, night differential, per-employee rate overrides — are all supported through the three-tier configuration system." />
            <FaqItem delay={400} q="What pay frequencies does Y1P support?"
              a="Y1P supports Monthly, Semi-Monthly, Weekly, and Bi-Weekly pay frequencies. These are configurable per pay group, so different employee groups can have different pay schedules within the same company." />
            <FaqItem delay={440} q="What premium pay types are built in?"
              a={<>
                Y1P ships with a full predefined formula catalogue aligned with Philippine labor law:
                <ul style={{ margin: "10px 0 0", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 5 }}>
                  <li>Straight Time (ST) and Regular Day OT</li>
                  <li>Night Differential (ND) — ST ND, OT ND, configurable time windows</li>
                  <li>Rest Day (ST, OT, ND combinations)</li>
                  <li>Regular Holiday (ST, OT, ND, Rest Day combinations)</li>
                  <li>Special Holiday (ST, OT, ND, Rest Day combinations)</li>
                  <li>Double Holiday</li>
                  <li>Preshift OT and Preshift OT ND</li>
                  <li>Retro Pay (ST, OT, ND, Rest Day, Holiday)</li>
                  <li>13th Month Pay proration</li>
                  <li>Longevity Pay</li>
                  <li>Leave conversions (Sick, Vacation, Emergency)</li>
                  <li>Standard deductions (absent, late, undertime)</li>
                  <li>SSS, PhilHealth, Pag-IBIG, and Withholding Tax</li>
                </ul>
                <p style={{ margin: "8px 0 0" }}>Custom formulas can also be created for company-specific needs.</p>
              </>} />
            <FaqItem delay={480} q="Does Y1P handle SSS, PhilHealth, Pag-IBIG, and BIR?"
              a={<>
                Yes. All four are handled automatically:
                <ul style={{ margin: "10px 0 0", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 5 }}>
                  <li>SSS, PhilHealth, Pag-IBIG — computed based on configurable statutory tables, with contribution reports included</li>
                  <li>BIR withholding tax — computed per BIR tax tables, with BIR-specific reports (including 1604-C support) and full audit trails</li>
                </ul>
                <p style={{ margin: "8px 0 0" }}>Government-mandated table updates are applied as compliance updates throughout the transition period.</p>
              </>} />
            <FaqItem delay={520} q="What reports are available in Y1P?"
              a={<>
                Y1P includes the following report types:
                <ul style={{ margin: "10px 0 0", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 5 }}>
                  <li>Payslips</li>
                  <li>Payroll Register</li>
                  <li>Payroll Summary</li>
                  <li>Ledger Reports</li>
                  <li>Contribution Reports (SSS, PhilHealth, Pag-IBIG)</li>
                  <li>BIR Reports</li>
                  <li>13th Month Pay Report</li>
                  <li>Attendance Reports</li>
                  <li>Activity Reports</li>
                  <li>Accounting/GL Reports</li>
                </ul>
                <p style={{ margin: "8px 0 0" }}>YPO-specific custom reports will be reviewed during migration planning to confirm availability or a Y1P equivalent.</p>
              </>} />
            <FaqItem delay={560} q="Can Y1P handle our current company structure?"
              a="Yes. Y1P supports multi-company setups, multiple pay groups per company, and per-employee configuration overrides. Complex organizational structures — departments, sections, cost centers, and different employee classifications — are all supported." />
            <FaqItem delay={600} q="Is Y1P faster than YPO?"
              a="Yes. Y1P is built on a modern, performance-optimized stack. The payroll computation engine is designed for batch efficiency — all configuration is loaded upfront so that processing large employee rosters does not create bottlenecks during a payroll run." />
            <FaqItem delay={640} q="Can we request a Y1P demo?"
              a="Yes. Demos can be scheduled upon request. Please reach out to your account manager or the YAHSHUA implementation team to set one up." />
            <FaqItem delay={680} q="Can we compare YPO vs. Y1P features?"
              a="Yes. A feature comparison matrix is available and can be shared upon request. Your account manager can walk you through it during a pre-migration consultation." />
            <FaqItem delay={720} q="Will historical payroll data be migrated?"
              a="Yes. Historical and active employee and payroll data will be migrated as part of the transition. The exact scope (how far back, which records) will be confirmed during migration planning. Data is validated by both the client and the implementation team before go-live." />
            <FaqItem delay={760} q="Is there a risk of data loss?"
              a="Data is validated before and after migration to ensure accuracy and integrity. Parallel testing is conducted before go-live. If discrepancies are found, corrections can be made — even after go-live." />
            <FaqItem delay={800} q="Will we do testing before go-live?"
              a="Yes. Parallel testing is a required step in the migration process. Both the client team and the YAHSHUA implementation team validate results before the system goes live." />
            <FaqItem delay={840} q="How will Y1P feature requests be evaluated?"
              a="Feature requests for Y1P are reviewed based on: business need, client value, alignment with the product roadmap, technical feasibility, and priority relative to ongoing development. Requests can be submitted through your account manager." />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="waitlist" style={{ borderTop: "1px solid var(--line)" }}>
        <div style={{ background: "var(--ink)", paddingTop: "clamp(56px, 8vw, 100px)", paddingBottom: "clamp(56px, 8vw, 100px)", paddingLeft: 28, paddingRight: 28, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(60% 80% at 50% 110%, oklch(0.78 0.13 215 / 0.22), transparent 60%)" }} />
          <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
            <Reveal direction="scale">
              <h2 style={{ fontSize: "clamp(36px, 5.5vw, 72px)", letterSpacing: "-0.04em", fontWeight: 700, lineHeight: 1.0, margin: "0 0 18px", color: "#fff" }}>
                Stop doing payroll<br />manually.
              </h2>
              <p style={{ color: "oklch(0.65 0.01 250)", fontSize: 18, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.6 }}>
                Join 1,200+ Filipino business owners on the YAHSHUA One waitlist. No credit card required.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => setCtaOpen(true)} style={{ ...btnBase, background: "#fff", color: "var(--ink)", borderColor: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,0.12)" }}>
                  Get Started <Arrow />
                </button>
                <a href="/" style={{ ...btnBase, background: "transparent", color: "#fff", borderColor: "oklch(0.35 0.02 250)" }}>
                  See all modules
                </a>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 32, flexWrap: "wrap" }}>
                {["SSS compliant", "BIR-ready", "DOLE-aligned", "PhilHealth"].map((badge) => (
                  <div key={badge} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "oklch(0.48 0.01 250)" }}>
                    <Check size={12} color="var(--accent)" />{badge}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
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
            {[{ label: "Home", href: "/" }, { label: "Modules", href: "/#modules" }, { label: "Updates", href: "/updates" }, { label: "Waitlist", href: "/#waitlist" }].map((link) => (
              <a key={link.label} href={link.href}
                style={{ color: "var(--muted)", transition: "color .15s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}>
                {link.label}
              </a>
            ))}
          </nav>
          <span style={{ fontSize: 13, color: "var(--soft)" }}>© 2026 YAHSHUA One · Built in the Philippines 🇵🇭</span>
        </div>
      </footer>

      {/* ── VIDEO MODAL ── */}
      {videoOpen && (
        <div
          onClick={() => setVideoOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Full walkthrough video"
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(0,0,0,0.88)",
            backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "24px",
          }}
        >
          <button
            onClick={() => setVideoOpen(false)}
            aria-label="Close video"
            style={{
              position: "absolute", top: 20, right: 24,
              width: 38, height: 38, borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.08)",
              color: "#fff", cursor: "pointer",
              display: "grid", placeItems: "center",
              fontSize: 20, lineHeight: 1, fontFamily: "inherit",
              transition: "background .15s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
          >
            ×
          </button>

          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: "min(92vw, 1100px)",
              borderRadius: 14, overflow: "hidden",
              boxShadow: "0 40px 100px rgba(0,0,0,0.8)",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "#000",
            }}
          >
            <video
              ref={modalVideoRef}
              autoPlay
              controls
              playsInline
              style={{ width: "100%", display: "block", maxHeight: "80vh" }}
            >
              <source src="/payroll-preview.mp4" type="video/mp4" />
            </video>
          </div>

          <div style={{
            position: "absolute", bottom: 20,
            fontSize: 12, color: "rgba(255,255,255,0.35)",
            fontFamily: "var(--font-geist-mono, monospace)",
          }}>
            Press ESC or click outside to close
          </div>
        </div>
      )}

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
            onClick={e => e.stopPropagation()}
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
                onClick={() => {
                  setCtaOpen(false);
                  window.location.href = "/#waitlist";
                }}
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
