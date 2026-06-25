"use client";

import { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";
import Image from "next/image";

/* ── Types ── */
interface Update {
  date: string;
  badge: string;
  title: string;
  description: string;
}

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

/* ── Reveal wrapper ── */
function Reveal({
  children, delay = 0, className = "", direction = "up",
}: {
  children: React.ReactNode; delay?: number; className?: string;
  direction?: "up" | "left" | "right" | "scale";
}) {
  const { ref, visible } = useInView();
  const base =
    direction === "left"  ? "reveal-left"  :
    direction === "right" ? "reveal-right" :
    direction === "scale" ? "reveal-scale" : "reveal";
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

/* ── Product preview sidebar ── */
function ProductSidebar() {
  const navItems = [
    { label: "Overview", active: true, icon: (
      <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
        <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    )},
    { label: "Inbox", badge: "12", icon: (
      <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
        <path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    )},
  ];
  const modules = [
    { label: "ERP", icon: (
      <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
        <path d="M3 12V6L8 3L13 6V12" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        <path d="M6 12V9H10V12" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    )},
    { label: "People & Payroll", icon: (
      <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
        <circle cx="8" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M3 13C3.5 10.5 5.5 9.5 8 9.5C10.5 9.5 12.5 10.5 13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    )},
    { label: "Accounting", icon: (
      <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
        <path d="M2 13V3M2 13H14M5 10V8M8 10V5M11 10V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    )},
    { label: "Tax & Compliance", icon: (
      <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
        <rect x="3" y="2" width="10" height="12" rx="1" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M6 6H10M6 9H10M6 12H8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    )},
    { label: "Personal", icon: (
      <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
        <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )},
  ];
  return (
    <aside style={{
      borderRight: "1px solid var(--line-2)",
      padding: "18px 14px",
      background: "linear-gradient(180deg, var(--bg) 0%, transparent 100%)",
      minWidth: 0,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: 8,
        borderRadius: 8, background: "var(--surface)", border: "1px solid var(--line-2)",
        fontSize: 13, fontWeight: 500, marginBottom: 16,
      }}>
        <span style={{
          width: 22, height: 22, borderRadius: 6, background: "var(--ink)",
          display: "grid", placeItems: "center", color: "#fff", fontSize: 10, fontWeight: 600, flexShrink: 0,
        }}>N</span>
        <span>Northwind Trading</span>
        <svg width="12" height="12" viewBox="0 0 12 12" style={{ marginLeft: "auto", color: "var(--soft)", flexShrink: 0 }}>
          <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
        </svg>
      </div>

      <div style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--soft)", margin: "18px 8px 6px" }}>
        Workspace
      </div>
      {navItems.map((item) => (
        <div key={item.label} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "7px 10px",
          borderRadius: 8, fontSize: 13,
          background: item.active ? "var(--accent-50)" : "transparent",
          color: item.active ? "var(--accent-2)" : "var(--ink-2)",
          fontWeight: item.active ? 500 : 400,
        }}>
          <span style={{ color: "currentColor", opacity: 0.85, flexShrink: 0, display: "flex" }}>{item.icon}</span>
          {item.label}
          {item.badge && (
            <span style={{ marginLeft: "auto", fontFamily: "var(--font-geist-mono, monospace)", fontSize: 10, color: "var(--soft)" }}>
              {item.badge}
            </span>
          )}
        </div>
      ))}

      <div style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--soft)", margin: "18px 8px 6px" }}>
        Modules
      </div>
      {modules.map((item) => (
        <div key={item.label} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "7px 10px",
          borderRadius: 8, fontSize: 13, color: "var(--ink-2)",
        }}>
          <span style={{ opacity: 0.85, flexShrink: 0, display: "flex" }}>{item.icon}</span>
          {item.label}
        </div>
      ))}
    </aside>
  );
}

/* ── Product preview main ── */
function ProductMain() {
  const stats = [
    { label: "Cash on hand", val: "₱ 2.41M", delta: "▲ 8.4% vs last mo.", up: true,
      spark: "M0,18 L14,16 L28,14 L42,15 L56,10 L70,8 L84,6 L100,2" },
    { label: "Headcount", val: "68", delta: "▲ 4 this quarter", up: true,
      spark: "M0,20 L14,18 L28,17 L42,17 L56,14 L70,12 L84,11 L100,8" },
    { label: "MRR", val: "₱ 612K", delta: "▲ 2.1%", up: true,
      spark: "M0,16 L14,14 L28,15 L42,12 L56,11 L70,12 L84,9 L100,7" },
    { label: "Burn rate", val: "₱ 184K", delta: "▼ 3.0%", up: false,
      spark: "M0,8 L14,10 L28,11 L42,9 L56,13 L70,15 L84,14 L100,17" },
  ];
  const payroll = [
    { init: "LP", name: "Lara Pacheco",    amt: "₱ 84,200", status: "ready" },
    { init: "JM", name: "Jordan Mendoza",  amt: "₱ 72,500", status: "ready" },
    { init: "RC", name: "Ria Castro",      amt: "₱ 68,000", status: "review" },
    { init: "EM", name: "Eli Manansala",   amt: "₱ 91,400", status: "ready" },
  ];
  const tasks = [
    { done: true,  label: "Categorized 142 transactions",      meta: "BPI · Maya · GCash" },
    { done: true,  label: "Filed VAT for Q1",                  meta: "acknowledged · ref 99-22-148" },
    { done: false, label: "Drafting Q2 cash flow forecast",     meta: "75% complete · ETA 14:50" },
    { done: false, label: "Awaiting receipt — Manila Lights, Inc.", meta: "requested 2h ago" },
  ];

  return (
    <section style={{ padding: "26px 30px", minWidth: 0, overflowX: "hidden" }}>
      <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: 10 }}>
        Good afternoon, Lara
        <span style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, color: "var(--soft)", fontWeight: 400 }}>Tue · 16:42 PHT</span>
      </h3>
      <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 22 }}>Here is what needs your attention today — three items, ten minutes.</p>

      {/* Ask bar */}
      <div style={{
        border: "1px solid var(--line)", background: "var(--surface)", borderRadius: 14,
        padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, fontSize: 14,
        color: "var(--muted)", boxShadow: "var(--shadow-sm)", marginBottom: 0,
      }}>
        <span style={{
          width: 22, height: 22, borderRadius: 6, flexShrink: 0,
          background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
          display: "grid", placeItems: "center", color: "#fff",
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1L7.2 4.2L10.5 5.4L7.2 6.6L6 9.8L4.8 6.6L1.5 5.4L4.8 4.2L6 1Z" fill="currentColor"/>
          </svg>
        </span>
        <span style={{ color: "var(--ink)", flex: 1 }}>
          Reconcile last month&apos;s bank statements and flag unusual expenses
          <span className="cursor-blink" />
        </span>
        <span style={{
          fontFamily: "var(--font-geist-mono, monospace)",
          background: "var(--bg-tint)", border: "1px solid var(--line)",
          borderRadius: 6, padding: "2px 6px", fontSize: 11, color: "var(--ink-2)",
        }}>⌘ K</span>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, margin: "18px 0" }}>
        {stats.map((s) => (
          <div key={s.label} style={{
            border: "1px solid var(--line-2)", borderRadius: 12, padding: 14, background: "var(--surface)",
          }}>
            <div style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--soft)" }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 6 }}>{s.val}</div>
            <div style={{ fontSize: 11.5, color: s.up ? "var(--accent-2)" : "#B45B4E", marginTop: 2, display: "inline-flex", alignItems: "center", gap: 4 }}>{s.delta}</div>
            <svg style={{ marginTop: 10, height: 24, width: "100%" }} viewBox="0 0 100 24" preserveAspectRatio="none">
              <path d={s.spark} stroke={s.up ? "var(--accent-2)" : "#B45B4E"} fill="none" strokeWidth="1.5"/>
            </svg>
          </div>
        ))}
      </div>

      {/* Panels */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
        {/* Payroll panel */}
        <div style={{ border: "1px solid var(--line-2)", borderRadius: 12, padding: 14, background: "var(--surface)" }}>
          <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            Next payroll cutoff
            <span style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 10, color: "var(--soft)", fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase" }}>in 2 days</span>
          </h4>
          {payroll.map((row) => (
            <div key={row.init} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px dashed var(--line-2)", fontSize: 13 }}
              className="last:border-0">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--bg-tint)", color: "var(--ink-2)", fontSize: 11, display: "grid", placeItems: "center", fontWeight: 500 }}>{row.init}</span>
                <span>{row.name}</span>
              </div>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{row.amt}</span>
              <span style={{
                fontSize: 11, padding: "2px 8px", borderRadius: 999,
                fontFamily: "var(--font-geist-mono, monospace)", letterSpacing: "0.04em",
                background: row.status === "review" ? "oklch(0.96 0.04 75)" : "var(--accent-50)",
                color: row.status === "review" ? "#8A5A2A" : "var(--accent-2)",
              }}>{row.status}</span>
            </div>
          ))}
        </div>

        {/* AI tasks panel */}
        <div style={{ border: "1px solid var(--line-2)", borderRadius: 12, padding: 14, background: "var(--surface)" }}>
          <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            What AI is doing
            <span style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 10, color: "var(--soft)", fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase" }}>live</span>
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {tasks.map((task, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13 }}>
                <span style={{
                  width: 16, height: 16, borderRadius: 5, flexShrink: 0, marginTop: 1,
                  display: "grid", placeItems: "center",
                  border: task.done ? "none" : "1.5px solid var(--line)",
                  background: task.done ? "var(--accent)" : "transparent",
                  color: "#fff",
                }}>
                  {task.done && (
                    <svg width="10" height="10" viewBox="0 0 10 10">
                      <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                <div>
                  <div style={{ color: task.done ? "var(--soft)" : "inherit", textDecoration: task.done ? "line-through" : "none" }}>{task.label}</div>
                  <div style={{ color: "var(--soft)", fontSize: 11.5, marginTop: 2, fontFamily: "var(--font-geist-mono, monospace)" }}>{task.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
export default function Home() {
  const [updates, setUpdates] = useState<Update[] | null>(null);
  const [form, setForm] = useState({ name: "", email: "", company: "", size: "" });
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formMsg, setFormMsg] = useState("");
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    fetch("/updates.json").then((r) => r.json()).then(setUpdates).catch(() => setUpdates([]));
    const onScroll = () => setNavScrolled(window.scrollY > 8);
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) { setFormState("success"); setFormMsg(data.message); }
      else { setFormState("error"); setFormMsg(data.message || "Something went wrong."); }
    } catch {
      setFormState("error");
      setFormMsg("Something went wrong. Please try again.");
    }
  }

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
            <a href="#" style={{ display: "flex", alignItems: "center", gap: 10 }} aria-label="YAHSHUA One home">
              <Image src="/logo.jpg" alt="YAHSHUA One" width={28} height={28} style={{ borderRadius: 8, objectFit: "cover", flexShrink: 0 }} priority />
              <span style={{ fontWeight: 600, letterSpacing: "-0.02em", fontSize: 16 }}>
                YAHSHUA <span style={{ color: "var(--muted)", fontWeight: 400 }}>One</span>
              </span>
            </a>

            {/* Links — hidden on mobile */}
            <nav className="nav-links" aria-label="Primary">
              {[
                { label: "Platform", href: "#platform" },
                { label: "Modules",  href: "#modules" },
                { label: "Intelligence", href: "#intelligence" },
                { label: "Pricing",  href: "#waitlist" },
                { label: "What's New", href: "/updates" },
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

            {/* CTA — hidden on mobile */}
            <div className="nav-cta">
              <a href="https://app.yahshua.one/" style={{ ...btnGhost, ...btnSm }}>Sign in</a>
              <a href="https://app.yahshua.one/" style={{ ...btnPrimary, ...btnSm }}>
                Start free <Arrow />
              </a>
            </div>

            {/* Hamburger — mobile only */}
            <button
              className="nav-burger"
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((o) => !o)}
            >
              {mobileNavOpen ? (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                  <path d="M1 1h20M1 8h20M1 15h20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu drawer */}
      <div className={`mobile-menu${mobileNavOpen ? " open" : ""}`} aria-label="Mobile navigation">
        {[
          { label: "Platform",     href: "#platform" },
          { label: "Modules",      href: "#modules" },
          { label: "Intelligence", href: "#intelligence" },
          { label: "Pricing",      href: "#waitlist" },
          { label: "What's New",   href: "/updates" },
        ].map((link) => (
          <a key={link.label} href={link.href} className="mobile-menu__link"
            onClick={() => setMobileNavOpen(false)}>
            {link.label}
          </a>
        ))}
        <hr />
        <div className="mobile-menu__ctas">
          <a href="https://app.yahshua.one/" style={{ ...btnGhost }}>Sign in</a>
          <a href="https://app.yahshua.one/" style={{ ...btnPrimary }}>Start free →</a>
        </div>
      </div>

      {/* ── HERO ── */}
      <header style={{ padding: "84px 0 56px", position: "relative", overflow: "hidden" }}>
        {/* Aurora glow */}
        <div style={{
          position: "absolute", top: -200, left: "50%", transform: "translateX(-50%)",
          width: 1100, height: 700, pointerEvents: "none", zIndex: 0, filter: "blur(20px)",
          background: "radial-gradient(45% 55% at 50% 30%, var(--accent-glow), transparent 70%), radial-gradient(35% 45% at 30% 50%, oklch(0.9 0.06 215 / 0.4), transparent 70%)",
        }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px", position: "relative", zIndex: 1 }}>

          {/* Badge */}
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
              }}>v1.0</span>
              <span>Now open for early access</span>
            </div>
          </Reveal>

          {/* Headline */}
          <Reveal delay={60}>
            <h1 style={{
              margin: "0 0 18px",
              fontSize: "clamp(44px, 6.4vw, 88px)",
              lineHeight: 1.02, letterSpacing: "-0.035em", fontWeight: 500,
              maxWidth: 980, color: "var(--ink)", textWrap: "balance" as React.CSSProperties["textWrap"],
            }}>
              The operating system<br />your business{" "}
              <em style={{ fontStyle: "normal", color: "var(--accent-2)" }}>runs on.</em>
            </h1>
          </Reveal>

          {/* Sub */}
          <Reveal delay={120}>
            <p style={{
              fontSize: 19, lineHeight: 1.55, color: "var(--muted)",
              maxWidth: 620, margin: "0 0 32px",
            }}>
              ERP, HR, accounting, tax, and personal finance — unified in one workspace, automated end-to-end, and answered by an AI that understands your books.
            </p>
          </Reveal>

          {/* CTAs */}
          <Reveal delay={180}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="#waitlist" style={btnPrimary}>
                Start free for 30 days <Arrow />
              </a>
              <a href="#platform" style={btnGhost}>See the product</a>
            </div>
          </Reveal>

          {/* Trust */}
          <Reveal delay={230}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 28, color: "var(--soft)", fontSize: 13 }}>
              <div style={{ display: "inline-flex" }}>
                {[
                  "linear-gradient(135deg, #F2C879, #E89B5A)",
                  "linear-gradient(135deg, #B9D9C4, #6FA989)",
                  "linear-gradient(135deg, #C5C0E8, #8076C7)",
                  "linear-gradient(135deg, var(--accent-3), var(--accent-2))",
                ].map((bg, i) => (
                  <span key={i} aria-hidden style={{
                    width: 26, height: 26, borderRadius: "50%",
                    border: "2px solid var(--bg)", marginLeft: i === 0 ? 0 : -8, background: bg,
                  }} />
                ))}
              </div>
              <span><strong style={{ color: "var(--ink-2)", fontWeight: 500 }}>1,200+ founders</strong> on the waitlist · No credit card required</span>
            </div>
          </Reveal>

        </div>
      </header>

      {/* ── PLATFORM PREVIEW ── */}
      <section id="platform" style={{ padding: "0 0 110px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <h2 style={{
              fontSize: "clamp(28px, 3.2vw, 42px)", letterSpacing: "-0.03em", fontWeight: 500,
              margin: "0 0 28px", maxWidth: 680,
            }}>
              The whole back office. One workspace.
            </h2>
          </Reveal>
          <Reveal delay={60}>
            <div style={{
              background: "var(--ink)", borderRadius: "var(--radius-xl)",
              border: "1px solid oklch(0.22 0.020 155)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.18)",
              overflow: "hidden",
            }}>
              {/* Browser chrome bar */}
              <div style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 16px",
                borderBottom: "1px solid oklch(0.20 0.015 155)",
                background: "oklch(0.135 0.012 155)",
              }}>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }} aria-hidden>
                  {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                    <span key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c, display: "block" }} />
                  ))}
                </div>
                <div style={{
                  flex: "0 0 auto", width: 260,
                  background: "oklch(0.20 0.015 155)",
                  border: "1px solid oklch(0.26 0.012 155)",
                  borderRadius: 6, padding: "4px 10px",
                  display: "flex", alignItems: "center", gap: 6,
                  fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11.5,
                  color: "oklch(0.52 0.010 155)",
                }} aria-hidden>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <rect x="2" y="4" width="6" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M4 4V3a2 2 0 0 1 2 0v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  app.yahshua.one/overview
                </div>
              </div>

              {/* Product shell */}
              <div style={{ overflowX: "auto" }} aria-label="YAHSHUA One product preview">
                <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", minWidth: 680 }}>
                  <ProductSidebar />
                  <ProductMain />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── MODULES ── */}
      <section id="modules" style={{ padding: "110px 0", position: "relative" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div style={{ maxWidth: 760, marginBottom: 56 }}>
              <h2 style={{ margin: "0 0 14px", fontSize: "clamp(34px, 4.2vw, 52px)", letterSpacing: "-0.03em", fontWeight: 500, lineHeight: 1.05 }}>
                Five businesses worth of software, in one workspace.
              </h2>
              <p style={{ margin: 0, fontSize: 18, color: "var(--muted)", maxWidth: 600 }}>
                Stop wiring spreadsheets between five tools that don&apos;t talk to each other. YAHSHUA One ships the whole back office as one product — and one source of truth.
              </p>
            </div>
          </Reveal>

          <div className="modules-grid">
            {/* ERP - feature (spans 6 of 12 cols) */}
            <div className="col-6">
              <Reveal delay={0}>
                <article style={{
                  background: "linear-gradient(180deg, #fff 0%, var(--accent-50) 100%)",
                  border: "1px solid oklch(0.88 0.06 215 / 0.6)", borderRadius: "var(--radius-lg)",
                  padding: 24, minHeight: 280, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", height: "100%",
                }}>
                  <div style={{ marginBottom: 12 }}>
                    <span style={{ width: 32, height: 32, borderRadius: 8, background: "var(--ink)", display: "grid", placeItems: "center", color: "var(--accent-3)" }}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M3 14V7L9 3L15 7V14" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                        <path d="M6 14V10H12V14" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </div>
                  <h3 style={{ fontSize: 21, fontWeight: 500, letterSpacing: "-0.02em", margin: "8px 0 6px" }}>Run operations without spreadsheets.</h3>
                  <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.5, margin: "0 0 14px" }}>
                    Inventory, sales orders, purchasing, and vendors connected to the same ledger your accountant uses. No exports. No reconciliation tickets at 11pm.
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: "auto 0 0", display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {["Inventory", "Sales orders", "Procurement", "Vendors", "Multi-branch"].map((tag) => (
                      <li key={tag} style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "var(--bg-tint)", color: "var(--ink-2)" }}>{tag}</li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </div>

            {/* HRM - feature (spans 6 of 12 cols) */}
            <div className="col-6">
              <Reveal delay={60}>
                <article style={{
                  background: "linear-gradient(180deg, #fff 0%, var(--accent-50) 100%)",
                  border: "1px solid oklch(0.88 0.06 215 / 0.6)", borderRadius: "var(--radius-lg)",
                  padding: 24, minHeight: 280, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", height: "100%",
                }}>
                  <div style={{ marginBottom: 12 }}>
                    <span style={{ width: 32, height: 32, borderRadius: 8, background: "var(--ink)", display: "grid", placeItems: "center", color: "var(--accent-3)" }}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M3 15C3.6 12 5.8 10.5 9 10.5C12.2 10.5 14.4 12 15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </span>
                  </div>
                  <h3 style={{ fontSize: 21, fontWeight: 500, letterSpacing: "-0.02em", margin: "8px 0 6px" }}>The people side, finally automated.</h3>
                  <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.5, margin: "0 0 14px" }}>
                    Timekeeping, leaves, payroll, and statutory contributions — auto-computed, paid, and filed on schedule. Your team gets a portal that doesn&apos;t feel like 2008.
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: "auto 0 0", display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {["Payroll", "Leaves", "Time tracking", "13th-month", "SSS · PhilHealth · HDMF"].map((tag) => (
                      <li key={tag} style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "var(--bg-tint)", color: "var(--ink-2)" }}>{tag}</li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </div>

            {/* Small modules (each spans 3 of 12 cols) */}
            {[
              { id: "03", title: "Accounting", desc: "A real ledger. Real-time P&L. AI-categorized transactions.", tags: ["Books","Recon","P&L"], icon: (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 15V3M2 15H16M5 12V9M8 12V5M11 12V7M14 12V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )},
              { id: "04", title: "Tax", desc: "BIR-ready forms. Quarterly filings drafted, reviewed, submitted.", tags: ["VAT","1701Q","1601-C"], icon: (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="3" y="2" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M6 6H12M6 9H12M6 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )},
              { id: "05", title: "Personal", desc: "Your own cashflow, goals, and personal taxes — same login.", tags: ["Budget","Goals","ITR"], icon: (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M9 5V9L11.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )},
              { id: "+", title: "Marketplace", desc: "Drop-in apps for billing, e-commerce, and country-specific rails.", tags: ["Stripe","Maya","BIR"], icon: (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 1L11 6L16 6.5L12.5 10L13.5 15L9 12.5L4.5 15L5.5 10L2 6.5L7 6L9 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              )},
            ].map((mod, i) => (
              <div key={mod.id} className="col-3">
                <Reveal delay={i * 50}>
                  <article style={{
                    background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)",
                    padding: 24, minHeight: 220, height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative",
                    transition: "border-color .2s ease, box-shadow .2s ease",
                  }}>
                    <div style={{ marginBottom: 12 }}>
                      <span style={{ width: 32, height: 32, borderRadius: 8, background: "var(--bg-tint)", display: "grid", placeItems: "center", color: "var(--ink)" }}>
                        {mod.icon}
                      </span>
                    </div>
                    <h3 style={{ fontSize: 21, fontWeight: 500, letterSpacing: "-0.02em", margin: "8px 0 6px" }}>{mod.title}</h3>
                    <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.5, margin: "0 0 14px" }}>{mod.desc}</p>
                    <ul style={{ listStyle: "none", padding: 0, margin: "auto 0 0", display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {mod.tags.map((tag) => (
                        <li key={tag} style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "var(--bg-tint)", color: "var(--ink-2)" }}>{tag}</li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI SHOWCASE ── */}
      <section id="intelligence" style={{ paddingTop: 24, paddingBottom: 110 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div className="grid-ai" style={{
              background: "var(--ink)", color: "#F7F6F1", borderRadius: "var(--radius-xl)",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "radial-gradient(50% 60% at 90% 0%, var(--accent-glow), transparent 60%), radial-gradient(40% 50% at 0% 100%, oklch(0.7 0.12 215 / 0.18), transparent 60%)",
              }} />

              {/* Text side */}
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-3)", marginBottom: 14 }}>
                  <Dot /> Intelligence
                </div>
                <h2 style={{ fontSize: "clamp(34px, 3.6vw, 46px)", letterSpacing: "-0.03em", fontWeight: 500, lineHeight: 1.05, margin: "0 0 18px" }}>
                  An AI that&apos;s <em style={{ fontStyle: "normal", color: "var(--accent-3)" }}>read your books</em> — not just the internet.
                </h2>
                <p style={{ color: "oklch(0.85 0.01 250)", fontSize: 17, lineHeight: 1.55, margin: "0 0 28px", maxWidth: 480 }}>
                  Every transaction, employee record, invoice, and tax form lives in one schema. The assistant queries it directly — so the answer it gives is the answer you&apos;d get by spending a day in spreadsheets.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { title: "Grounded in your ledger.", body: "No hallucinations — every figure is traceable to a journal entry." },
                    { title: "Acts, not just answers.", body: "Approve a payroll run, file a return, or send an invoice — in chat." },
                    { title: "Your data stays yours.", body: "Encrypted in transit and at rest. Never used to train models." },
                  ].map((item) => (
                    <li key={item.title} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 14.5, color: "oklch(0.88 0.01 250)" }}>
                      <span style={{ width: 22, height: 22, borderRadius: 6, background: "oklch(0.25 0.02 250)", color: "var(--accent-3)", display: "grid", placeItems: "center", flexShrink: 0, marginTop: 1 }}>
                        <svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 6L5 8L9 4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                      <div><strong style={{ color: "#fff", fontWeight: 500 }}>{item.title}</strong> {item.body}</div>
                    </li>
                  ))}
                </ul>
                <a href="#waitlist" style={{
                  display: "inline-flex", alignItems: "center", gap: 8, height: 44, padding: "0 18px",
                  borderRadius: 999, border: "1px solid oklch(0.35 0.012 250)", color: "#fff",
                  fontWeight: 500, fontSize: 14.5, background: "transparent",
                }}>
                  Read the security overview <Arrow />
                </a>
              </div>

              {/* Chat mockup */}
              <div style={{
                background: "oklch(0.2 0.012 250)", border: "1px solid oklch(0.28 0.012 250)",
                borderRadius: 16, padding: 20, position: "relative", zIndex: 1,
                display: "flex", flexDirection: "column", gap: 14,
                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              }} aria-hidden>
                {/* User message */}
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13.5, lineHeight: 1.5 }}>
                  <span style={{ width: 26, height: 26, borderRadius: 6, background: "oklch(0.3 0.01 250)", color: "#fff", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 600, flexShrink: 0 }}>L</span>
                  <div>
                    <div style={{ fontSize: 11, color: "oklch(0.6 0.01 250)", marginBottom: 4, fontFamily: "var(--font-geist-mono, monospace)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Lara · CEO</div>
                    <div style={{ color: "oklch(0.85 0.01 250)" }}>How much can I pay myself as a dividend this quarter without breaking covenants?</div>
                  </div>
                </div>

                {/* AI message */}
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13.5, lineHeight: 1.5 }}>
                  <span style={{ width: 26, height: 26, borderRadius: 6, background: "linear-gradient(135deg, var(--accent), var(--accent-2))", color: "#0a1418", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 600, flexShrink: 0 }}>A</span>
                  <div>
                    <div style={{ fontSize: 11, color: "oklch(0.6 0.01 250)", marginBottom: 4, fontFamily: "var(--font-geist-mono, monospace)", letterSpacing: "0.05em", textTransform: "uppercase" }}>YAHSHUA · Assistant</div>
                    <div style={{ color: "#F4F2EC" }}>Based on Q2 numbers and the BPI loan covenant (DSCR ≥ 1.4×), you have headroom to distribute up to:</div>
                    <div style={{
                      background: "oklch(0.24 0.012 250)", border: "1px solid oklch(0.3 0.012 250)",
                      borderRadius: 10, padding: 12, marginTop: 8,
                      fontFamily: "var(--font-geist-mono, monospace)", fontSize: 12, color: "oklch(0.82 0.01 250)",
                      display: "flex", flexDirection: "column", gap: 6,
                    }}>
                      {[
                        { k: "retained_earnings", v: "₱ 4,820,000" },
                        { k: "covenant_buffer",   v: "₱ 1,150,000" },
                        { k: "safe_dividend",     v: "₱ 950,000" },
                      ].map((row) => (
                        <div key={row.k}><span style={{ color: "var(--accent-3)" }}>{row.k}</span> = <span style={{ color: "#fff" }}>{row.v}</span></div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                      <button style={{ fontSize: 12, padding: "5px 10px", background: "var(--accent-3)", border: "none", borderRadius: 999, color: "#0a1418", display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Draft board resolution
                      </button>
                      {["Show working", "Schedule for Jul 5"].map((label) => (
                        <button key={label} style={{ fontSize: 12, padding: "5px 10px", background: "oklch(0.28 0.012 250)", border: "1px solid oklch(0.34 0.012 250)", borderRadius: 999, color: "oklch(0.88 0.01 250)" }}>{label}</button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Composer */}
                <div style={{
                  marginTop: 6, background: "oklch(0.16 0.012 250)", border: "1px solid oklch(0.28 0.012 250)",
                  borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10,
                  color: "oklch(0.55 0.01 250)", fontSize: 13,
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2L9.6 6L14 6.6L10.8 9.6L11.6 14L8 11.8L4.4 14L5.2 9.6L2 6.6L6.4 6L8 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                  </svg>
                  <span>Ask anything — &ldquo;forecast next quarter&rdquo;, &ldquo;file 1601C&rdquo;, &ldquo;pay Lara…&rdquo;</span>
                  <span style={{ marginLeft: "auto", width: 26, height: 26, borderRadius: 6, background: "var(--accent)", display: "grid", placeItems: "center", color: "#0a1418", flexShrink: 0 }}>
                    <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6H10M10 6L7 3M10 6L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "110px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div style={{ maxWidth: 760, marginBottom: 56 }}>
              <h2 style={{ margin: 0, fontSize: "clamp(34px, 4.2vw, 52px)", letterSpacing: "-0.03em", fontWeight: 500, lineHeight: 1.05 }}>
                Three steps. One afternoon. Then you&apos;re done forever.
              </h2>
            </div>
          </Reveal>
          <div className="grid-steps">
            {[
              { num: "1", title: "Import", body: "Export your data from your bank, payroll system, and BIR records, then import it into YAHSHUA One." },
              { num: "2", title: "Configure", body: "Your chart of accounts, cutoff dates, leave policies, and tax filings — preset for your business type. Edit once, never again." },
              { num: "3", title: "Let it run", body: "Payroll runs itself. Filings draft themselves. Your job becomes review, approve, and move on with the day." },
            ].map((step, i) => (
              <Reveal key={step.num} delay={i * 60}>
                <div style={{ border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", padding: 28, background: "var(--surface)" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--ink)", color: "#fff", display: "grid", placeItems: "center", fontFamily: "var(--font-geist-mono, monospace)", fontSize: 13, marginBottom: 18 }}>{step.num}</div>
                  <h3 style={{ fontSize: 19, fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 8px" }}>{step.title}</h3>
                  <p style={{ color: "var(--muted)", fontSize: 14.5, margin: 0 }}>{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FIGURES ── */}
      <section style={{ paddingTop: 24, paddingBottom: 110 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div className="grid-figures">
              {[
                { num: "40+",     lbl: "Hours of admin returned to founders, every month." },
                { num: "99.97%",  lbl: "Filing accuracy across BIR, SSS, PhilHealth, Pag-IBIG." },
                { num: "1 day",   lbl: "Average onboarding from sign-up to first reconciled month." },
                { num: "0",       lbl: "Spreadsheets emailed at 2am between you and your accountant." },
              ].map((fig, i) => (
                <div key={fig.num} className="fig-item" style={{ padding: "36px 28px" }}>
                  <div style={{ fontSize: "clamp(32px, 3.6vw, 48px)", letterSpacing: "-0.03em", fontWeight: 500, lineHeight: 1, marginBottom: 8 }}>
                    <em style={{ fontStyle: "normal", color: "var(--accent-2)" }}>{fig.num}</em>
                  </div>
                  <div style={{ color: "var(--muted)", fontSize: 14 }}>{fig.lbl}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="cta" style={{ padding: "110px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <Reveal direction="scale">
            <div style={{
              border: "1px solid var(--line)",
              background: "radial-gradient(70% 100% at 0% 100%, var(--accent-glow), transparent 60%), radial-gradient(60% 100% at 100% 0%, oklch(0.95 0.03 215 / 0.5), transparent 60%), var(--surface)",
              borderRadius: "var(--radius-xl)", padding: 72, textAlign: "center", position: "relative", overflow: "hidden",
            }}>
              <h2 style={{ fontSize: "clamp(36px, 4.4vw, 60px)", letterSpacing: "-0.035em", fontWeight: 500, lineHeight: 1.05, margin: "0 0 16px" }}>
                Run your business on <em style={{ fontStyle: "normal", color: "var(--accent-2)" }}>one platform.</em>
              </h2>
              <p style={{ color: "var(--muted)", fontSize: 18, maxWidth: 540, margin: "0 auto 28px" }}>
                Start free for 30 days. Bring your whole back office over — or just one module. We&apos;ll meet you where you are.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <a href="#waitlist" style={btnPrimary}>
                  Start free for 30 days <Arrow />
                </a>
                <a href="#waitlist" style={btnGhost}>Talk to founders</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── WAITLIST ── */}
      <section id="waitlist" style={{ padding: "96px 0", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: "clamp(2.5rem, 6vw, 3.5rem)", letterSpacing: "-0.03em", fontWeight: 500, margin: "0 0 14px" }}>
              Get in early.
            </h2>
            <p style={{ fontSize: 18, color: "var(--muted)", lineHeight: 1.6 }}>
              Join the waitlist. Be among the first Filipino businesses on YAHSHUA One.
            </p>
            </div>
          </Reveal>

          <Reveal delay={100} direction="scale">
            <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-xl)", padding: 32, boxShadow: "var(--shadow)" }}>
              {formState === "success" ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--accent-50)", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
                    <Check style={{ color: "var(--accent-2)" }} size={24} strokeWidth={2.5} />
                  </div>
                  <p style={{ fontWeight: 600, color: "var(--ink)", fontSize: 18, margin: "0 0 8px" }}>You&apos;re on the list!</p>
                  <p style={{ color: "var(--muted)", fontSize: 14 }}>{formMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    { label: "Full Name", key: "name", type: "text", placeholder: "Juan dela Cruz", required: true },
                    { label: "Email",     key: "email", type: "email", placeholder: "juan@company.com.ph", required: true },
                    { label: "Company",   key: "company", type: "text", placeholder: "Dela Cruz Trading", required: false },
                  ].map((field) => (
                    <div key={field.key}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "var(--ink-2)" }}>
                        {field.label}{" "}
                        {field.required
                          ? <span style={{ color: "#B45B4E" }}>*</span>
                          : <span style={{ color: "var(--soft)", fontWeight: 400 }}>(optional)</span>}
                      </label>
                      <input
                        required={field.required}
                        type={field.type}
                        value={form[field.key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                        style={{
                          width: "100%", padding: "10px 14px", borderRadius: "var(--radius)",
                          fontSize: 14, color: "var(--ink)", background: "var(--bg)", border: "1px solid var(--line)",
                          outline: "none", fontFamily: "inherit", transition: "border-color .15s ease, box-shadow .15s ease",
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)"; }}
                        onBlur={(e) => { e.target.style.borderColor = "var(--line)"; e.target.style.boxShadow = "none"; }}
                      />
                    </div>
                  ))}

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "var(--ink-2)" }}>
                      Company Size <span style={{ color: "var(--soft)", fontWeight: 400 }}>(optional)</span>
                    </label>
                    <select
                      value={form.size}
                      onChange={(e) => setForm({ ...form, size: e.target.value })}
                      style={{
                        width: "100%", padding: "10px 14px", borderRadius: "var(--radius)",
                        fontSize: 14, background: "var(--bg)", border: "1px solid var(--line)",
                        color: form.size ? "var(--ink)" : "var(--soft)", outline: "none", fontFamily: "inherit",
                      }}
                    >
                      <option value="">Select size...</option>
                      <option value="1-10">1–10 employees</option>
                      <option value="11-50">11–50 employees</option>
                      <option value="51-200">51–200 employees</option>
                      <option value="200+">200+ employees</option>
                    </select>
                  </div>

                  {formState === "error" && (
                    <p style={{ fontSize: 14, borderRadius: "var(--radius)", padding: "10px 14px", color: "#B45B4E", background: "oklch(0.97 0.02 30)", border: "1px solid oklch(0.88 0.06 30)", margin: 0 }}>
                      {formMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={formState === "loading"}
                    style={{
                      ...btnPrimary, width: "100%", justifyContent: "center", height: 48, fontSize: 15,
                      borderRadius: "var(--radius)", opacity: formState === "loading" ? 0.6 : 1,
                    }}
                  >
                    {formState === "loading" ? "Sending…" : "Claim My Spot →"}
                  </button>
                </form>
              )}
            </div>
            <p style={{ textAlign: "center", fontSize: 12, color: "var(--soft)", marginTop: 16 }}>
              No spam. No credit card. Just early access.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── BUILD LOG ── */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 768, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", letterSpacing: "-0.025em", fontWeight: 500, margin: "0 0 12px" }}>
              We build in public.
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40, flexWrap: "wrap" }}>
              <p style={{ color: "var(--muted)", fontSize: 17, margin: 0 }}>Every update, in plain language.</p>
              <a href="/updates" style={{
                fontSize: 13, fontWeight: 500, padding: "6px 14px", borderRadius: 999,
                border: "1px solid var(--line)", color: "var(--ink-2)", background: "var(--surface)",
              }}>View all updates →</a>
            </div>
          </Reveal>

          {updates === null && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[1, 2].map((i) => (
                <div key={i} style={{ borderRadius: "var(--radius)", padding: 24, background: "var(--surface)", border: "1px solid var(--line)" }}>
                  <div className="skeleton" style={{ height: 16, width: 96, marginBottom: 12, borderRadius: 4 }} />
                  <div className="skeleton" style={{ height: 20, width: "60%", marginBottom: 12, borderRadius: 4 }} />
                  <div className="skeleton" style={{ height: 14, width: "100%", marginBottom: 6, borderRadius: 4 }} />
                  <div className="skeleton" style={{ height: 14, width: "80%", borderRadius: 4 }} />
                </div>
              ))}
            </div>
          )}

          {updates !== null && updates.length === 0 && (
            <div style={{ textAlign: "center", padding: "64px 0" }}>
              <p style={{ color: "var(--muted)", fontSize: 18 }}>No updates yet. We&apos;re building!</p>
            </div>
          )}

          {updates !== null && updates.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {updates.slice(0, 3).map((update, i) => (
                <Reveal key={i} delay={i * 50}>
                  <div style={{ borderRadius: "var(--radius)", padding: 24, background: "var(--surface)", border: "1px solid var(--line)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
                      <span className="badge-feature" style={{ fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 999 }}>{update.badge}</span>
                      <span style={{ fontSize: 12, color: "var(--soft)" }}>{update.date}</span>
                    </div>
                    <h3 style={{ fontWeight: 600, color: "var(--ink)", marginBottom: 8, fontSize: 17, lineHeight: 1.35 }}>{update.title}</h3>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--muted)", margin: 0 }}>{update.description}</p>
                  </div>
                </Reveal>
              ))}
              {updates.length > 3 && (
                <Reveal delay={180}>
                  <div style={{ textAlign: "center", paddingTop: 8 }}>
                    <a href="/updates" style={{ ...btnGhost, ...btnSm, display: "inline-flex" }}>View full dev log →</a>
                  </div>
                </Reveal>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 768, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", letterSpacing: "-0.025em", fontWeight: 500, margin: "0 0 40px" }}>
              Common questions
            </h2>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              {
                q: "Does YAHSHUA One automate payroll computation in the Philippines?",
                a: "Yes. YAHSHUA One automatically computes payroll for all employees — including SSS, PhilHealth, Pag-IBIG, and withholding tax deductions. It generates payslips and prepares bank disbursement files with zero manual computation required.",
              },
              {
                q: "Does it handle BIR compliance and tax filings?",
                a: "Yes. YAHSHUA One tracks all BIR deadlines including 1601-C, 2550M, and quarterly returns. It generates BIR-ready reports and alerts you weeks before every filing deadline — so you never incur penalties again.",
              },
              {
                q: "Can YAHSHUA One handle HR onboarding and offboarding?",
                a: "Yes. YAHSHUA One manages the full employee lifecycle — digital onboarding, contract management, leave requests, overtime approvals, and offboarding. Employees get a self-service portal to view their payslips, leave balances, and records anytime.",
              },
              {
                q: "Is YAHSHUA One built specifically for Filipino businesses?",
                a: "100%. YAHSHUA One is built from the ground up for the Philippine business environment — BIR, SSS, PhilHealth, and Pag-IBIG compliance baked in, Philippine Labor Code leave policies, and peso-denominated reporting.",
              },
              {
                q: "How is it different from other payroll or HR systems in the Philippines?",
                a: "Most systems only cover one area — payroll OR HR OR accounting. YAHSHUA One combines all of them in one AI-powered platform. It's also built specifically for Filipino SMBs, not adapted from a foreign product.",
              },
              {
                q: "Who is YAHSHUA One designed for?",
                a: "YAHSHUA One is built for Filipino business owners, HR officers, accountants, and finance managers who want to stop doing administrative work manually.",
              },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 40}>
                <details style={{ borderRadius: "var(--radius)", overflow: "hidden", background: "var(--surface)", border: "1px solid var(--line)" }}>
                  <summary style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "20px 24px", cursor: "pointer", listStyle: "none", userSelect: "none", color: "var(--ink)", fontWeight: 500, fontSize: 15 }}>
                    {item.q}
                    <span style={{ flexShrink: 0, fontSize: 20, color: "var(--accent-2)", fontWeight: 300 }}>+</span>
                  </summary>
                  <div style={{ padding: "0 24px 20px", borderTop: "1px solid var(--line)" }}>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--muted)", margin: "16px 0 0" }}>{item.a}</p>
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: "64px 0 40px", borderTop: "1px solid var(--line)", color: "var(--muted)", fontSize: 14 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <div className="footer-cols">
            <div>
              <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }} aria-label="YAHSHUA One">
                <Image src="/logo.jpg" alt="YAHSHUA One" width={28} height={28} style={{ borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                <span style={{ fontWeight: 600, letterSpacing: "-0.02em", fontSize: 16, color: "var(--ink)" }}>
                  YAHSHUA <span style={{ color: "var(--muted)", fontWeight: 400 }}>One</span>
                </span>
              </a>
              <p style={{ maxWidth: 280, marginTop: 16, lineHeight: 1.6 }}>
                The AI-native back office for businesses that would rather build than do paperwork.
              </p>
              <p style={{ marginTop: 12, fontSize: 13 }}>Built in the Philippines 🇵🇭</p>
            </div>
            {[
              { title: "Product",   links: [{ label: "Modules", href: "#modules" }, { label: "Intelligence", href: "#intelligence" }, { label: "Integrations", href: "#" }, { label: "Pricing", href: "#waitlist" }] },
              { title: "Company",   links: [{ label: "About", href: "#" }, { label: "Customers", href: "#" }, { label: "Careers", href: "#" }, { label: "Press kit", href: "#" }] },
              { title: "Resources", links: [{ label: "Docs", href: "#" }, { label: "Changelog", href: "/updates" }, { label: "Security", href: "#" }, { label: "Status", href: "#" }] },
              { title: "Legal",     links: [{ label: "Terms", href: "#" }, { label: "Privacy", href: "#" }, { label: "DPA", href: "#" }, { label: "Cookies", href: "#" }] },
            ].map((col) => (
              <div key={col.title}>
                <h5 style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-2)", margin: "0 0 14px", fontWeight: 500 }}>{col.title}</h5>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} style={{ color: "var(--muted)", transition: "color .15s ease" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <span>© 2026 YAHSHUA One, Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
