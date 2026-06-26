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
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); }
      },
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
function Reveal({
  children, delay = 0, className = "", direction = "up",
}: {
  children: React.ReactNode; delay?: number; className?: string;
  direction?: "up" | "left" | "right" | "scale" | "clip";
}) {
  const { ref, visible } = useInView();
  const base =
    direction === "left"  ? "reveal-left"  :
    direction === "right" ? "reveal-right" :
    direction === "scale" ? "reveal-scale" :
    direction === "clip"  ? "reveal-clip"  : "reveal";
  return (
    <div
      ref={ref}
      className={`${base}${visible ? " visible" : ""}${className ? " " + className : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ── Nav dot ── */
function Dot() {
  return (
    <span style={{
      display: "inline-block", width: 6, height: 6, borderRadius: "50%",
      background: "var(--accent)", boxShadow: "0 0 0 4px var(--accent-glow)",
      flexShrink: 0,
    }} />
  );
}

/* ── Arrow icon ── */
function Arrow({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none"
      style={{ transition: "transform .2s ease", flexShrink: 0 }}>
      <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Check icon ── */
function Check({ size = 14, color = "var(--accent-2)" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2.5 7L5.5 10L11.5 4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Animated stat counter ── */
function AnimatedStat({ from, to, format, delay, lbl }: {
  from: number; to: number;
  format: (v: number) => string;
  delay: number; lbl: string;
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

/* ── FAQ accordion item ── */
function FaqItem({ q, a, delay }: { q: string; a: string; delay: number }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={delay}>
      <div style={{ borderRadius: "var(--radius)", background: "var(--surface)", border: "1px solid var(--line)" }}>
        <button
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          style={{
            width: "100%", display: "flex", alignItems: "center",
            justifyContent: "space-between", gap: 16,
            padding: "20px 24px", cursor: "pointer", textAlign: "left",
            background: "none", border: "none", color: "var(--ink)",
            fontWeight: 500, fontSize: 15, fontFamily: "inherit",
          }}
        >
          {q}
          <span aria-hidden style={{
            flexShrink: 0, fontSize: 20, color: "var(--accent-2)", fontWeight: 300,
            display: "inline-block",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
          }}>+</span>
        </button>
        <div style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 0.32s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
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

/* ── Payslip mockup ── */
function PayslipMockup() {
  const deductions = [
    { label: "SSS",         amt: "₱ 1,125.00" },
    { label: "PhilHealth",  amt: "₱ 450.00"   },
    { label: "Pag-IBIG",    amt: "₱ 200.00"   },
    { label: "Withholding Tax", amt: "₱ 3,210.00" },
  ];
  const earnings = [
    { label: "Basic Pay",   amt: "₱ 32,000.00" },
    { label: "Overtime",    amt: "₱ 2,400.00"  },
    { label: "Night Diff",  amt: "₱ 1,200.00"  },
    { label: "Allowances",  amt: "₱ 4,000.00"  },
  ];

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--line-2)",
      borderRadius: 16, overflow: "hidden",
      boxShadow: "var(--shadow-lg)",
    }}>
      {/* Header */}
      <div style={{
        background: "var(--ink)", padding: "18px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
            display: "grid", placeItems: "center", color: "#0a1418", fontWeight: 700, fontSize: 12,
          }}>Y1</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>YAHSHUA One · Payslip</div>
            <div style={{ color: "oklch(0.6 0.01 250)", fontSize: 11, fontFamily: "var(--font-geist-mono, monospace)" }}>June 15, 2026 cutoff</div>
          </div>
        </div>
        <div style={{
          fontSize: 10, fontFamily: "var(--font-geist-mono, monospace)", letterSpacing: "0.08em",
          textTransform: "uppercase", background: "var(--accent)", color: "#0a1418",
          padding: "3px 8px", borderRadius: 999, fontWeight: 600,
        }}>AI-generated</div>
      </div>

      {/* Employee info */}
      <div style={{
        padding: "16px 24px", borderBottom: "1px solid var(--line-2)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "var(--bg-tint)",
      }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Lara Pacheco</div>
          <div style={{ fontSize: 12, color: "var(--soft)", fontFamily: "var(--font-geist-mono, monospace)" }}>
            EMP-2024-0041 · Senior Accountant · Full-time
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "var(--soft)", fontFamily: "var(--font-geist-mono, monospace)" }}>Period</div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Jun 1–15, 2026</div>
        </div>
      </div>

      {/* Earnings & Deductions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid var(--line-2)" }}>
        <div style={{ padding: "16px 24px", borderRight: "1px solid var(--line-2)" }}>
          <div style={{ fontSize: 10, fontFamily: "var(--font-geist-mono, monospace)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--soft)", marginBottom: 10 }}>Earnings</div>
          {earnings.map((row) => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "5px 0", borderBottom: "1px dashed var(--line-2)" }}>
              <span style={{ color: "var(--muted)" }}>{row.label}</span>
              <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>{row.amt}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: "16px 24px" }}>
          <div style={{ fontSize: 10, fontFamily: "var(--font-geist-mono, monospace)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--soft)", marginBottom: 10 }}>Deductions</div>
          {deductions.map((row) => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "5px 0", borderBottom: "1px dashed var(--line-2)" }}>
              <span style={{ color: "var(--muted)" }}>{row.label}</span>
              <span style={{ fontVariantNumeric: "tabular-nums", color: "#B45B4E" }}>{row.amt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Net Pay */}
      <div style={{
        padding: "16px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "var(--accent-50)",
      }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--soft)", fontFamily: "var(--font-geist-mono, monospace)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Net Pay</div>
          <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--accent-2)" }}>₱ 34,615.00</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
          <div style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, background: "var(--accent)", color: "#0a1418", fontFamily: "var(--font-geist-mono, monospace)", fontWeight: 600, letterSpacing: "0.04em" }}>
            APPROVED
          </div>
          <div style={{ fontSize: 11, color: "var(--soft)" }}>Disbursement: Jun 15, 2026</div>
        </div>
      </div>

      {/* Footer actions */}
      <div style={{
        padding: "12px 24px", borderTop: "1px solid var(--line-2)",
        display: "flex", gap: 8,
      }}>
        {["Send to employee", "Export PDF", "Bank file"].map((label) => (
          <div key={label} style={{
            fontSize: 11.5, padding: "5px 10px", borderRadius: 6,
            border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink-2)",
            cursor: "default",
          }}>{label}</div>
        ))}
      </div>
    </div>
  );
}

/* ── Compliance badge row ── */
function ComplianceBadge({ label, color }: { label: string; color: string }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "6px 12px", borderRadius: 999,
      border: `1px solid ${color}22`,
      background: `${color}11`,
      fontSize: 12.5, fontWeight: 500, color,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
      {label}
    </div>
  );
}

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

  /* ── Shared btn styles ── */
  const btnBase: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 8,
    height: 44, padding: "0 18px", borderRadius: 999, border: "1px solid transparent",
    fontWeight: 500, fontSize: 14.5, cursor: "pointer", textDecoration: "none",
    transition: "background .2s ease, border-color .2s ease, box-shadow .2s ease",
    fontFamily: "inherit",
  };
  const btnPrimary: React.CSSProperties = {
    ...btnBase,
    background: "var(--ink)", color: "#fff", borderColor: "var(--ink)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 2px rgba(15,17,21,0.18)",
  };
  const btnGhost: React.CSSProperties = {
    ...btnBase,
    background: "transparent", color: "var(--ink)", borderColor: "var(--line)",
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
            {/* Brand */}
            <a href="/" style={{ display: "flex", alignItems: "center", gap: 10 }} aria-label="YAHSHUA One home">
              <Image src="/logo.jpg" alt="YAHSHUA One" width={28} height={28} style={{ borderRadius: 8, objectFit: "cover", flexShrink: 0 }} priority />
              <span style={{ fontWeight: 600, letterSpacing: "-0.02em", fontSize: 16 }}>
                YAHSHUA <span style={{ color: "var(--muted)", fontWeight: 400 }}>One</span>
              </span>
              <span style={{
                fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "var(--accent-50)",
                color: "var(--accent-2)", fontFamily: "var(--font-geist-mono, monospace)",
                letterSpacing: "0.04em", fontWeight: 500, marginLeft: 2,
              }}>Payroll</span>
            </a>

            {/* Links */}
            <nav className="nav-links" aria-label="Primary">
              {[
                { label: "Features", href: "#features" },
                { label: "Compliance", href: "#compliance" },
                { label: "How it works", href: "#how-it-works" },
                { label: "FAQ", href: "#faq" },
                { label: "← All modules", href: "/#modules" },
              ].map((link) => (
                <a key={link.label} href={link.href} style={{
                  padding: "8px 12px", borderRadius: 8, fontSize: 14, color: "var(--ink-2)",
                  transition: "background .15s ease",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-tint)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  {link.label}
                </a>
              ))}
            </nav>

            {/* CTA */}
            <div className="nav-cta">
              <a href="https://app.yahshua.one/" style={{ ...btnGhost, ...btnSm }}>Sign in</a>
              <a href="#waitlist" style={{ ...btnPrimary, ...btnSm }}>
                Start free <Arrow />
              </a>
            </div>

            {/* Burger */}
            <button
              className="nav-burger"
              onClick={() => setMobileNavOpen(v => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileNavOpen}
            >
              {mobileNavOpen
                ? <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                : <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 6H17M3 10H17M3 14H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              }
            </button>
          </div>

          {/* Mobile menu */}
          <div className={`mobile-menu${mobileNavOpen ? " open" : ""}`}>
            {[
              { label: "Features", href: "#features" },
              { label: "Compliance", href: "#compliance" },
              { label: "How it works", href: "#how-it-works" },
              { label: "FAQ", href: "#faq" },
              { label: "← All modules", href: "/#modules" },
            ].map((link) => (
              <a key={link.label} href={link.href} className="mobile-menu__link" onClick={() => setMobileNavOpen(false)}>
                {link.label}
              </a>
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
      <header style={{ padding: "80px 0 56px", position: "relative", overflow: "hidden" }}>
        {/* Aurora */}
        <div style={{
          position: "absolute", top: -200, left: "50%", transform: "translateX(-50%)",
          width: 1100, height: 700, pointerEvents: "none", zIndex: 0, filter: "blur(20px)",
          background: "radial-gradient(45% 55% at 50% 30%, var(--accent-glow), transparent 70%), radial-gradient(35% 45% at 30% 50%, oklch(0.9 0.06 215 / 0.4), transparent 70%)",
        }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px", position: "relative", zIndex: 1 }}>
          <div className="grid-2col-hero">
            {/* Left: copy */}
            <div>
              <Reveal>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px 6px 8px",
                  border: "1px solid var(--line)", background: "var(--surface)", borderRadius: 999,
                  fontSize: 12.5, color: "var(--ink-2)", boxShadow: "var(--shadow-sm)", marginBottom: 22,
                }}>
                  <span style={{
                    background: "var(--accent-50)", color: "var(--accent-2)",
                    padding: "2px 8px", borderRadius: 999,
                    fontFamily: "var(--font-geist-mono, monospace)", fontSize: 10.5,
                    letterSpacing: "0.04em", textTransform: "uppercase",
                  }}>People & Payroll</span>
                  <span>Module 02 of YAHSHUA One</span>
                </div>
              </Reveal>

              <Reveal delay={60} direction="clip">
                <h1 style={{
                  margin: "0 0 20px",
                  fontSize: "clamp(48px, 7.5vw, 92px)",
                  lineHeight: 1.0, letterSpacing: "-0.04em", fontWeight: 300,
                  color: "var(--ink)", textWrap: "balance" as React.CSSProperties["textWrap"],
                }}>
                  Payroll that{" "}
                  <em style={{ fontStyle: "normal", color: "var(--accent-2)", fontWeight: 800 }}>runs itself.</em>
                </h1>
              </Reveal>

              <Reveal delay={120}>
                <p style={{
                  fontSize: 19, lineHeight: 1.6, color: "var(--ink-2)",
                  maxWidth: 560, margin: "0 0 32px",
                }}>
                  Auto-compute payroll, statutory contributions, and withholding tax for every employee in your roster — then disburse with one click. Built for Philippine Labor Code and BIR.
                </p>
              </Reveal>

              <Reveal delay={180}>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
                  <a href="#waitlist" style={btnPrimary}>
                    Start free for 30 days <Arrow />
                  </a>
                  <a href="#how-it-works" style={btnGhost}>See how it works</a>
                </div>
              </Reveal>

              <Reveal delay={230}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {[
                    "SSS auto-compute",
                    "PhilHealth",
                    "Pag-IBIG",
                    "BIR 1601-C",
                    "13th month",
                    "Night diff & OT",
                  ].map((tag) => (
                    <div key={tag} style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      fontSize: 12.5, padding: "4px 10px", borderRadius: 999,
                      border: "1px solid var(--line)", color: "var(--ink-2)",
                      background: "var(--surface)",
                    }}>
                      <Check size={11} />
                      {tag}
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Right: payslip mockup */}
            <Reveal direction="left" delay={100}>
              <div className="payslip-float">
                <PayslipMockup />
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
                <div style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.5 }}>Average time to run full payroll for 50-person team</div>
              </Reveal>
            </div>
            <AnimatedStat
              from={0} to={99.97}
              format={(v) => (v >= 99.9 ? v.toFixed(2) : Math.round(v).toString()) + "%"}
              delay={80}
              lbl="BIR filing accuracy on 1601-C, 2550M, quarterly returns"
            />
            <AnimatedStat
              from={4800} to={0}
              format={(v) => "₱ " + (Math.round(v) >= 1000 ? Math.round(v).toLocaleString("en-US") : Math.round(v).toString())}
              delay={120}
              lbl="Penalty exposure when deadlines are managed by YAHSHUA"
            />
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: "110px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div style={{ maxWidth: 720, marginBottom: 56 }}>
              <h2 style={{ margin: "0 0 14px", fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-0.035em", fontWeight: 600, lineHeight: 1.05 }}>
                Everything payroll needs — and nothing it doesn&apos;t.
              </h2>
              <p style={{ margin: 0, fontSize: 18, color: "var(--muted)", maxWidth: 580 }}>
                From timekeeping to bank disbursement, every step of your payroll cycle is handled — automatically, accurately, and on time.
              </p>
            </div>
          </Reveal>

          <div>
            {[
              {
                title: "Employee roster management",
                body: "Maintain complete employee records — hire date, position, rate, and employment type. Changes reflect instantly in payroll.",
                tags: ["Full-time", "Part-time", "Contractual", "Probationary"],
              },
              {
                title: "Cutoff scheduling",
                body: "Define semi-monthly or monthly payroll cutoffs. Payroll auto-locks at cutoff, preventing unauthorized changes.",
                tags: ["Semi-monthly", "Monthly", "Auto-lock", "Cutoff alerts"],
              },
              {
                title: "Automatic computation",
                body: "Every peso is computed — basic, OT, night diff, holiday pay, 13th month, and all statutory deductions. Zero manual entry.",
                tags: ["OT", "Night diff", "Holiday pay", "13th month"],
              },
              {
                title: "Digital payslips",
                body: "Every employee gets a PDF payslip via email or employee portal — branded, detailed, and delivered automatically.",
                tags: ["PDF export", "Email delivery", "Employee portal", "Branding"],
              },
              {
                title: "Bank disbursement files",
                body: "Generate bank-ready disbursement files for BPI, BDO, UnionBank, and GCash in one click. No more manual transfers.",
                tags: ["BPI", "BDO", "UnionBank", "GCash", "Maya"],
              },
              {
                title: "Payroll history & audit log",
                body: "Every run is logged with a full audit trail. Retrieve any historical payroll run for compliance, disputes, or internal review.",
                tags: ["Audit trail", "Payroll history", "Dispute resolution"],
              },
            ].map((feat, i) => (
              <Reveal key={feat.title} delay={i * 40}>
                <div className="feature-row">
                  <div>
                    <span style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, color: "var(--soft)", letterSpacing: "0.1em" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 style={{ fontSize: "clamp(18px, 2vw, 22px)", fontWeight: 600, letterSpacing: "-0.025em", margin: "8px 0 0", lineHeight: 1.2 }}>
                      {feat.title}
                    </h3>
                  </div>
                  <div>
                    <p style={{ color: "var(--muted)", fontSize: 15.5, lineHeight: 1.65, margin: "0 0 14px" }}>{feat.body}</p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {feat.tags.map((tag) => (
                        <li key={tag} style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "var(--bg-tint)", color: "var(--ink-2)" }}>{tag}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPLIANCE ── */}
      <section id="compliance" style={{ paddingBottom: 110 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div className="grid-ai" style={{
              background: "var(--ink)", color: "#F7F6F1", borderRadius: "var(--radius-xl)",
              position: "relative", overflow: "hidden",
            }}>
              {/* Glow */}
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "radial-gradient(50% 60% at 90% 0%, var(--accent-glow), transparent 60%), radial-gradient(40% 50% at 0% 100%, oklch(0.7 0.12 215 / 0.18), transparent 60%)",
              }} />

              {/* Text side */}
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-3)", marginBottom: 14 }}>
                  <Dot /> Philippine Compliance
                </div>
                <h2 style={{ fontSize: "clamp(28px, 3.2vw, 42px)", letterSpacing: "-0.03em", fontWeight: 500, lineHeight: 1.08, margin: "0 0 18px" }}>
                  Every statutory deduction, <em style={{ fontStyle: "normal", color: "var(--accent-3)" }}>auto-computed.</em>
                </h2>
                <p style={{ color: "oklch(0.85 0.01 250)", fontSize: 16, lineHeight: 1.6, margin: "0 0 28px", maxWidth: 440 }}>
                  YAHSHUA One has Philippine government agencies baked in — not bolted on. Rates update automatically. No manual table lookups. No calculation errors.
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
                  {[
                    { label: "SSS",          color: "#5B8EE8" },
                    { label: "PhilHealth",   color: "#5BAF8E" },
                    { label: "Pag-IBIG",     color: "#E8965B" },
                    { label: "BIR 1601-C",   color: "#C45BAF" },
                    { label: "DOLE",         color: "#8E8EE8" },
                  ].map((badge) => (
                    <div key={badge.label} style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "6px 12px", borderRadius: 999,
                      border: `1px solid ${badge.color}44`,
                      background: `${badge.color}18`,
                      fontSize: 12.5, fontWeight: 500, color: badge.color,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: badge.color, flexShrink: 0 }} />
                      {badge.label}
                    </div>
                  ))}
                </div>

                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    "Contribution tables update automatically when FICA rates change",
                    "Withholding tax computed per TRAIN Law and Revenue Regulations",
                    "13th month auto-computed per DOLE formula, filed on time",
                    "1601-C reports generated monthly, ready for eBIRForms upload",
                  ].map((item) => (
                    <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "oklch(0.88 0.01 250)" }}>
                      <span style={{ width: 20, height: 20, borderRadius: 5, background: "oklch(0.25 0.02 250)", color: "var(--accent-3)", display: "grid", placeItems: "center", flexShrink: 0, marginTop: 1 }}>
                        <svg width="11" height="11" viewBox="0 0 11 11"><path d="M2 5.5L4.5 8L9 3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contribution calculator mockup */}
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{
                  background: "oklch(0.2 0.012 250)", border: "1px solid oklch(0.28 0.012 250)",
                  borderRadius: 16, overflow: "hidden",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                }}>
                  <div style={{ padding: "14px 18px", borderBottom: "1px solid oklch(0.28 0.012 250)", display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "oklch(0.5 0.18 25)" }} />
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "oklch(0.7 0.16 70)" }} />
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "oklch(0.6 0.18 145)" }} />
                    <span style={{ fontSize: 12, color: "oklch(0.55 0.01 250)", marginLeft: 8, fontFamily: "var(--font-geist-mono, monospace)" }}>
                      Contribution breakdown · June 2026
                    </span>
                  </div>

                  <div style={{ padding: "20px 20px 8px" }}>
                    <div style={{ fontSize: 11, color: "oklch(0.5 0.01 250)", fontFamily: "var(--font-geist-mono, monospace)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
                      Employee: Ria Castro · ₱ 28,000 / mo
                    </div>

                    {[
                      { agency: "SSS",         ee: "₱ 900",   er: "₱ 1,900",  bar: 0.62, color: "#5B8EE8" },
                      { agency: "PhilHealth",  ee: "₱ 350",   er: "₱ 350",    bar: 0.25, color: "#5BAF8E" },
                      { agency: "Pag-IBIG",    ee: "₱ 200",   er: "₱ 200",    bar: 0.14, color: "#E8965B" },
                      { agency: "W/Tax (BIR)", ee: "₱ 2,400", er: "—",        bar: 0.42, color: "#C45BAF" },
                    ].map((row) => (
                      <div key={row.agency} style={{ marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                          <span style={{ fontSize: 12.5, color: row.color, fontWeight: 500 }}>{row.agency}</span>
                          <div style={{ display: "flex", gap: 16, fontSize: 11.5, fontFamily: "var(--font-geist-mono, monospace)" }}>
                            <span style={{ color: "oklch(0.75 0.01 250)" }}>EE: <span style={{ color: "#fff" }}>{row.ee}</span></span>
                            <span style={{ color: "oklch(0.75 0.01 250)" }}>ER: <span style={{ color: "#fff" }}>{row.er}</span></span>
                          </div>
                        </div>
                        <div style={{ height: 4, borderRadius: 99, background: "oklch(0.28 0.012 250)" }}>
                          <div style={{ height: "100%", borderRadius: 99, background: row.color, width: `${row.bar * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: "14px 20px 18px", borderTop: "1px solid oklch(0.28 0.012 250)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 11, color: "oklch(0.5 0.01 250)", fontFamily: "var(--font-geist-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total deductions</div>
                      <div style={{ fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: "-0.02em" }}>₱ 3,850</div>
                    </div>
                    <div style={{
                      fontSize: 12, padding: "8px 14px", borderRadius: 999,
                      background: "var(--accent)", color: "#0a1418", fontWeight: 600,
                    }}>Auto-remitted →</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: "110px 0", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div style={{ maxWidth: 720, marginBottom: 56 }}>
              <h2 style={{ margin: 0, fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-0.035em", fontWeight: 600, lineHeight: 1.05 }}>
                Set it up once. It runs every cutoff, automatically.
              </h2>
            </div>
          </Reveal>

          <div className="grid-4">
            {[
              {
                num: "01",
                title: "Import your roster",
                body: "Upload employee records — name, position, daily rate, and hired date. Import from Excel or connect your existing HRIS.",
              },
              {
                num: "02",
                title: "Configure policies",
                body: "Set your cutoff schedule, overtime rules, leave policies, and allowance types. Matches DOLE regulations by default.",
              },
              {
                num: "03",
                title: "Timekeeping auto-syncs",
                body: "Connect your biometric device or attendance app. Hours, tardiness, and absences flow into payroll automatically.",
              },
              {
                num: "04",
                title: "Review, approve, done",
                body: "Payroll runs on cutoff day. You review the summary, approve in one click, and the bank file is ready to upload.",
              },
            ].map((step, i) => (
              <Reveal key={step.num} delay={i * 60}>
                <div style={{
                  border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", padding: 28,
                  background: "var(--surface)", height: "100%",
                }}>
                  <div style={{
                    fontFamily: "var(--font-geist-mono, monospace)", fontSize: 20, fontWeight: 600,
                    color: "var(--accent-2)", marginBottom: 14, letterSpacing: "-0.01em",
                  }}>{step.num}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 500, letterSpacing: "-0.01em", margin: "0 0 8px" }}>{step.title}</h3>
                  <p style={{ color: "var(--muted)", fontSize: 14, margin: 0, lineHeight: 1.55 }}>{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Timeline connector */}
          <Reveal delay={200}>
            <div style={{
              marginTop: 28, padding: "18px 28px", borderRadius: "var(--radius-lg)",
              background: "var(--accent-50)", border: "1px solid oklch(0.88 0.06 215)",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent)", display: "grid", placeItems: "center", color: "#fff", flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2L9.5 6.5L14 7.3L10.5 10.5L11.5 15L8 12.7L4.5 15L5.5 10.5L2 7.3L6.5 6.5L8 2Z" fill="currentColor"/>
                </svg>
              </span>
              <div>
                <div style={{ fontWeight: 500, fontSize: 14, color: "var(--accent-2)" }}>Payroll AI is always watching</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>YAHSHUA flags anomalies automatically — duplicate entries, rate mismatches, missing timesheets — before you approve.</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── ADDITIONAL FEATURES ── */}
      <section style={{ paddingBottom: 110 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div style={{ maxWidth: 720, marginBottom: 56 }}>
              <h2 style={{ margin: 0, fontSize: "clamp(28px, 3.5vw, 44px)", letterSpacing: "-0.035em", fontWeight: 600, lineHeight: 1.05 }}>
                The full people module, not just payroll.
              </h2>
            </div>
          </Reveal>

          <div className="grid-2col">
            {[
              {
                title: "Leave management",
                body: "Vacation, sick, emergency, and special non-working leaves — tracked per Philippine Labor Code. Employees file online; managers approve in one tap. Balances reflect in payroll automatically.",
                tags: ["VL", "SL", "Emergency", "Maternity", "Paternity", "Solo parent"],
              },
              {
                title: "Employee self-service portal",
                body: "Your team accesses their own payslips, leave balances, attendance records, and tax forms anytime — without sending HR a message every payday.",
                tags: ["Payslip access", "Leave filing", "DTR viewing", "2316 download"],
              },
              {
                title: "Timekeeping & attendance",
                body: "Connect to biometric devices, web time-in apps, or import DTR sheets. Tardiness, undertimes, and absences auto-deduct based on your policy.",
                tags: ["Biometric sync", "Web time-in", "DTR import", "Shift scheduling"],
              },
              {
                title: "Compliance deadline calendar",
                body: "Never miss an SSS remittance, PhilHealth filing, or BIR deadline again. YAHSHUA alerts you 14 days, 7 days, and 1 day before every government deadline.",
                tags: ["SSS deadlines", "PhilHealth", "Pag-IBIG", "BIR calendar"],
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 50}>
                <div style={{
                  border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", padding: 28,
                  background: "var(--surface)", height: "100%",
                }}>
                  <h3 style={{ fontSize: 19, fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 10px" }}>{item.title}</h3>
                  <p style={{ color: "var(--muted)", fontSize: 14.5, lineHeight: 1.6, margin: "0 0 16px" }}>{item.body}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {item.tags.map((tag) => (
                      <span key={tag} style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "var(--bg-tint)", color: "var(--ink-2)" }}>{tag}</span>
                    ))}
                  </div>
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
            <FaqItem delay={0}
              q="Does YAHSHUA One automatically compute SSS, PhilHealth, and Pag-IBIG contributions?"
              a="Yes. YAHSHUA One computes SSS (employee and employer share), PhilHealth (both shares), and Pag-IBIG (both shares) automatically based on each employee's monthly basic salary. Contribution tables are kept current — when government agencies update rates, YAHSHUA updates too."
            />
            <FaqItem delay={40}
              q="How does YAHSHUA handle withholding tax computation?"
              a="YAHSHUA uses the BIR's TRAIN Law tax table (RR 11-2018) to compute monthly withholding tax for each employee. It accounts for exemptions, de minimis benefits, and 13th month pay exclusions. The monthly 1601-C report is generated automatically."
            />
            <FaqItem delay={80}
              q="Can it handle different pay schedules (semi-monthly, monthly)?"
              a="Yes. You can set semi-monthly or monthly payroll cutoffs per company or per department. Statutory contributions and tax are apportioned correctly across pay periods."
            />
            <FaqItem delay={120}
              q="What happens if an employee is absent or late?"
              a="Tardiness, undertime, and absences are auto-deducted based on the employee's daily rate and your attendance policy. Absences approved as leave are excluded from deductions."
            />
            <FaqItem delay={160}
              q="Does it generate BIR Form 2316 (Certificate of Compensation)?"
              a="Yes. YAHSHUA generates BIR Form 2316 for each employee at year-end, based on the full-year payroll data. Employees can download it from their self-service portal."
            />
            <FaqItem delay={200}
              q="Can YAHSHUA handle the 13th month pay computation?"
              a="Yes. 13th month pay is computed automatically per DOLE guidelines — total basic pay for the year divided by 12. The Payroll module generates the disbursement and the required Establishment Report to DOLE."
            />
          </div>
        </div>
      </section>

      {/* ── CTA / WAITLIST ── */}
      <section id="waitlist" style={{ borderTop: "1px solid var(--line)" }}>
        <div style={{
          background: "var(--ink)",
          padding: "100px 28px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(60% 80% at 50% 110%, oklch(0.78 0.13 215 / 0.22), transparent 60%)",
          }} />
          <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
            <Reveal direction="scale">
              <h2 style={{ fontSize: "clamp(36px, 5.5vw, 72px)", letterSpacing: "-0.04em", fontWeight: 700, lineHeight: 1.0, margin: "0 0 18px", color: "#fff" }}>
                Stop doing payroll<br />manually.
              </h2>
              <p style={{ color: "oklch(0.72 0.01 250)", fontSize: 18, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.6 }}>
                Join 1,200+ Filipino business owners on the YAHSHUA One waitlist. Free for 30 days. No credit card.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <a href="/#waitlist" style={{
                  ...btnBase,
                  background: "#fff", color: "var(--ink)", borderColor: "#fff",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
                }}>
                  Join the waitlist <Arrow />
                </a>
                <a href="/" style={{
                  ...btnBase,
                  background: "transparent", color: "#fff", borderColor: "oklch(0.35 0.02 250)",
                }}>See all modules</a>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 32, flexWrap: "wrap" }}>
                {["SSS compliant", "BIR-ready", "DOLE-aligned", "PhilHealth"].map((badge) => (
                  <div key={badge} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "oklch(0.52 0.01 250)" }}>
                    <Check size={12} color="var(--accent)" />
                    {badge}
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
            {[
              { label: "Home", href: "/" },
              { label: "Modules", href: "/#modules" },
              { label: "Updates", href: "/updates" },
              { label: "Waitlist", href: "/#waitlist" },
            ].map((link) => (
              <a key={link.label} href={link.href} style={{ color: "var(--muted)", transition: "color .15s ease" }}
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
