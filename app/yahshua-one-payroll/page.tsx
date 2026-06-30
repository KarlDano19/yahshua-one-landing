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
  direction?: "up" | "left" | "right" | "scale" | "clip";
}) {
  const { ref, visible } = useInView();
  const base = direction === "left" ? "reveal-left" : direction === "right" ? "reveal-right"
    : direction === "scale" ? "reveal-scale" : direction === "clip" ? "reveal-clip" : "reveal";
  return (
    <div ref={ref}
      className={`${base}${visible ? " visible" : ""}${className ? " " + className : ""}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Dot() {
  return <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 0 4px var(--accent-glow)", flexShrink: 0 }} />;
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
function FaqItem({ q, a, delay }: { q: string; a: string; delay: number }) {
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
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>{a}</p>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ══════════════════════════════════════════════════════════
   SHOWCASE DATA
══════════════════════════════════════════════════════════ */
const SHOWCASE = [
  {
    num: "01",
    label: "Payroll & Pay Slips",
    title: "Your people get paid right, every cutoff.",
    body: "YAHSHUA One Payroll computes every payslip automatically — basic pay, overtime, night differential, 13th month, and all statutory deductions. The payslip breakdown shows exactly what each employee earned, what was taken out, and what the employer contributed. On cutoff day, you review and approve.",
    bullets: [
      "Automatic computation per employee",
      "Government contributions auto-deducted",
      "Year-to-date summary on every payslip",
      "Download PDF, export XLSX, or email direct",
    ],
    img: "/ss-payslip.jpg",
    imgW: 1200, imgH: 800,
    alt: "YAHSHUA One Payroll payslip for Ana Reyes showing ₱14,705.62 net pay with earnings and deduction breakdown",
    flip: false,
  },
  {
    num: "02",
    label: "Theo AI",
    title: "Ask anything. Theo reads your actual company data.",
    body: "Theo is your payroll AI. It knows your configuration, your employees, your policies, and your compliance setup. Ask about your de minimis cap, your overtime multiplier, or how a specific employee's net was computed. Theo can also take action for you — drafting formulas, flagging anomalies, or pulling specific reports — within your account permissions.",
    bullets: [
      "Reads your real payroll data, not generic answers",
      "Answers BIR, SSS, PhilHealth, Pag-IBIG questions",
      "Acts on your behalf within your permission level",
      "Full conversation history per topic",
    ],
    img: "/ss-theo.jpg",
    imgW: 1200, imgH: 712,
    alt: "Theo AI conversation showing de minimis cap analysis with ₱8,000 annual cap warning and formula suggestion",
    flip: true,
  },
  {
    num: "03",
    label: "Policy Handbook",
    title: "Your policy manual, written from your settings.",
    body: "The Policy Handbook reads your payroll configuration and turns it into a plain-language document. Pay Schedule, Rate Calculation, Overtime Rules, Night Differential, Government Contributions, Withholding Tax, De Minimis Benefits — all explained, all linked back to the exact setting behind each rule. You didn't write any of it. When your settings change, it updates on its own.",
    bullets: [
      "Auto-generated from your actual settings",
      "Links every policy to the exact setting behind it",
      "HR-ready language, zero manual writing",
      "Updates automatically when settings change",
    ],
    img: "/ss-handbook.jpg",
    imgW: 1200, imgH: 800,
    alt: "YAHSHUA One Policy Handbook showing Pay Schedule section with semi-monthly cutoffs and payday offset settings",
    flip: false,
  },
  {
    num: "04",
    label: "Custom Reports",
    title: "Standard reports included. Anything else, just ask.",
    body: "YAHSHUA One Payroll ships with standard reports for every common payroll need. For anything beyond that — government contribution summaries, overtime trends, headcount by department, payroll cost breakdowns — describe what you need and the AI generates it from your own company data. Every report respects your permission level.",
    bullets: [
      "Standard reports out of the box",
      "AI-generated custom reports on demand",
      "Timesheets, files, and payroll run previews",
      "Permission-aware output",
    ],
    img: "/ss-reports.jpg",
    imgW: 1200, imgH: 800,
    alt: "YAHSHUA One Reports page showing custom reports including Government Contributions Summary and Overtime Trend",
    flip: true,
  },
  {
    num: "05",
    label: "Organizational Chart",
    title: "Set up your structure. See your org chart.",
    body: "Define your departments, divisions, sections, units, sub-units, and locations inside YAHSHUA One Payroll. The organizational chart builds itself from that data. One of the most requested features from existing YAHSHUA users — now built directly into the platform, no separate tool required.",
    bullets: [
      "Departments, divisions, sections, units",
      "Locations and cost centers",
      "Visual org chart from your structure",
      "Updates automatically as your org changes",
    ],
    img: "/ss-orgchart.jpg",
    imgW: 1200, imgH: 800,
    alt: "YAHSHUA One org chart showing hierarchical structure with Human Resources, Operations, and Customer Success departments",
    flip: false,
  },
  {
    num: "06",
    label: "Components & Formulas",
    title: "Custom formulas. Theo writes them for you.",
    body: "Every pay component in YAHSHUA One Payroll is formula-driven. Basic pay, overtime, night differential, allowances — you can inspect and customize any of them. If formula syntax feels unfamiliar, you can ask Theo to draft it for you in plain language. The Flow Builder lets you control the full sequence of your payroll computation.",
    bullets: [
      "Formula editor for every pay component",
      "Ask Theo to write formulas in plain language",
      "Flow Builder for full payroll run sequence",
      "Decision rules, lookup tables, basis catalog",
    ],
    img: "/ss-formulas.jpg",
    imgW: 1200, imgH: 800,
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

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 8);
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

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
            </nav>
            <div className="nav-cta">
              <a href="https://app.yahshua.one/" style={{ ...btnGhost, ...btnSm }}>Sign in</a>
              <a href="#waitlist" style={{ ...btnPrimary, ...btnSm }}>Start free <Arrow /></a>
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
              <a href="#waitlist" style={{ ...btnPrimary, ...btnSm }}>Start free <Arrow /></a>
            </div>
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <header style={{ padding: "72px 0 64px", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: -180, left: "50%", transform: "translateX(-50%)",
          width: 1100, height: 600, pointerEvents: "none", zIndex: 0, filter: "blur(20px)",
          background: "radial-gradient(45% 55% at 50% 30%, var(--accent-glow), transparent 70%), radial-gradient(35% 45% at 30% 50%, oklch(0.9 0.06 215 / 0.4), transparent 70%)",
        }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px", position: "relative", zIndex: 1 }}>
          <div className="grid-2col-hero">

            {/* Left copy */}
            <div>
              <Reveal delay={60} direction="clip">
                <h1 style={{
                  margin: "0 0 22px",
                  fontSize: "clamp(46px, 6.5vw, 84px)",
                  lineHeight: 1.0, letterSpacing: "-0.04em", fontWeight: 300,
                  textWrap: "balance" as React.CSSProperties["textWrap"],
                }}>
                  Payroll that{" "}
                  <em style={{ fontStyle: "normal", color: "var(--accent-2)", fontWeight: 800 }}>runs itself.</em>
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p style={{ fontSize: 18, lineHeight: 1.65, color: "var(--ink-2)", maxWidth: 500, margin: "0 0 32px" }}>
                  Automatic computation every cutoff. Statutory contributions, withholding tax, overtime, 13th month — handled. On payday, you just review and approve. And if you have questions about your setup, you can ask Theo. It reads your actual company data and gives you a real answer.
                </p>
              </Reveal>
              <Reveal delay={180}>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
                  <a href="#waitlist" style={btnPrimary}>Start free for 30 days <Arrow /></a>
                  <a href="#features" style={btnGhost}>See how it works</a>
                </div>
              </Reveal>
              <Reveal delay={230}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["SSS auto-compute", "PhilHealth", "Pag-IBIG", "BIR 1601-C", "13th month", "Night diff & OT"].map((tag) => (
                    <div key={tag} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, padding: "4px 10px", borderRadius: 999, border: "1px solid var(--line)", color: "var(--ink-2)", background: "var(--surface)" }}>
                      <Check size={11} />{tag}
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Right: video */}
            <Reveal direction="left" delay={80}>
              <div style={{
                borderRadius: 18, overflow: "hidden",
                boxShadow: "var(--shadow-lg), 0 40px 100px oklch(0.18 0.05 215 / 0.32)",
                border: "1px solid var(--line)",
              }}>
                {/* Window bar */}
                <div style={{ height: 36, background: "oklch(0.13 0.012 250)", display: "flex", alignItems: "center", gap: 6, padding: "0 14px", borderBottom: "1px solid oklch(0.2 0.012 250)" }}>
                  {["oklch(0.55 0.18 25)", "oklch(0.7 0.16 70)", "oklch(0.6 0.18 145)"].map((bg, i) => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: bg }} />
                  ))}
                  <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                    <span style={{ fontSize: 11, color: "oklch(0.38 0.01 250)", fontFamily: "var(--font-geist-mono, monospace)", background: "oklch(0.18 0.012 250)", border: "1px solid oklch(0.24 0.012 250)", borderRadius: 5, padding: "2px 12px" }}>
                      app.yahshua.one · Payroll
                    </span>
                  </div>
                </div>
                <video
                  autoPlay muted loop playsInline
                  poster="/ss-employees.jpg"
                  style={{ width: "100%", display: "block" }}
                >
                  <source src="/payroll-preview.mp4" type="video/mp4" />
                </video>
              </div>
            </Reveal>

          </div>
        </div>
      </header>

      {/* ── STAT STRIP ── */}
      <section style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
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
        {SHOWCASE.map((feat, i) => (
          <section key={feat.num} className="showcase-section">
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
              <div className={`showcase-grid${feat.flip ? " flip" : ""}`}>

                {/* Text */}
                <Reveal delay={60} direction={feat.flip ? "right" : "left"}>
                  <div>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 8, marginBottom: 20,
                      fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11,
                      letterSpacing: "0.1em", textTransform: "uppercase",
                      color: "var(--accent-2)",
                    }}>
                      <Dot />{feat.label}
                    </div>
                    <h2 style={{
                      fontSize: "clamp(26px, 3vw, 40px)", fontWeight: 600,
                      letterSpacing: "-0.03em", lineHeight: 1.1,
                      margin: "0 0 18px",
                      textWrap: "balance" as React.CSSProperties["textWrap"],
                    }}>
                      {feat.title}
                    </h2>
                    <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--muted)", margin: "0 0 28px", maxWidth: 480 }}>
                      {feat.body}
                    </p>
                    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 10 }}>
                      {feat.bullets.map((b) => (
                        <li key={b} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14.5, color: "var(--ink-2)" }}>
                          <span style={{ width: 20, height: 20, borderRadius: 6, background: "var(--accent-50)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                            <Check size={11} />
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                    <a href="#waitlist" style={btnPrimary}>Start free <Arrow /></a>
                  </div>
                </Reveal>

                {/* Screenshot */}
                <Reveal delay={0} direction={feat.flip ? "left" : "right"} className="showcase-img">
                  <img
                    src={feat.img}
                    alt={feat.alt}
                    width={feat.imgW}
                    height={feat.imgH}
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </Reveal>

              </div>
            </div>
          </section>
        ))}
      </div>

      {/* ── COMPLIANCE ── */}
      <section id="compliance" style={{ padding: "80px 0", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div className="grid-ai" style={{ background: "var(--ink)", color: "#F7F6F1", borderRadius: "var(--radius-xl)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(50% 60% at 90% 0%, var(--accent-glow), transparent 60%), radial-gradient(40% 50% at 0% 100%, oklch(0.7 0.12 215 / 0.18), transparent 60%)" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-3)", marginBottom: 14 }}>
                  <Dot /> Philippine Compliance
                </div>
                <h2 style={{ fontSize: "clamp(28px, 3.2vw, 42px)", letterSpacing: "-0.03em", fontWeight: 500, lineHeight: 1.08, margin: "0 0 18px" }}>
                  Every statutory deduction,{" "}
                  <em style={{ fontStyle: "normal", color: "var(--accent-3)" }}>auto-computed.</em>
                </h2>
                <p style={{ color: "oklch(0.85 0.01 250)", fontSize: 16, lineHeight: 1.6, margin: "0 0 28px", maxWidth: 440 }}>
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
                    <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "oklch(0.88 0.01 250)" }}>
                      <span style={{ width: 20, height: 20, borderRadius: 5, background: "oklch(0.25 0.02 250)", color: "var(--accent-3)", display: "grid", placeItems: "center", flexShrink: 0, marginTop: 1 }}>
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
              a="Yes. 13th month pay is computed automatically per DOLE guidelines — your total basic pay for the year divided by 12. The Payroll module generates the disbursement and the required Establishment Report to DOLE." />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="waitlist" style={{ borderTop: "1px solid var(--line)" }}>
        <div style={{ background: "var(--ink)", padding: "100px 28px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(60% 80% at 50% 110%, oklch(0.78 0.13 215 / 0.22), transparent 60%)" }} />
          <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
            <Reveal direction="scale">
              <h2 style={{ fontSize: "clamp(36px, 5.5vw, 72px)", letterSpacing: "-0.04em", fontWeight: 700, lineHeight: 1.0, margin: "0 0 18px", color: "#fff" }}>
                Stop doing payroll<br />manually.
              </h2>
              <p style={{ color: "oklch(0.72 0.01 250)", fontSize: 18, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.6 }}>
                Join 1,200+ Filipino business owners on the YAHSHUA One waitlist. Free for 30 days. No credit card.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <a href="/#waitlist" style={{ ...btnBase, background: "#fff", color: "var(--ink)", borderColor: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,0.12)" }}>
                  Join the waitlist <Arrow />
                </a>
                <a href="/" style={{ ...btnBase, background: "transparent", color: "#fff", borderColor: "oklch(0.35 0.02 250)" }}>
                  See all modules
                </a>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 32, flexWrap: "wrap" }}>
                {["SSS compliant", "BIR-ready", "DOLE-aligned", "PhilHealth"].map((badge) => (
                  <div key={badge} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "oklch(0.52 0.01 250)" }}>
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

    </div>
  );
}
