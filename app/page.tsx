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

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
export default function Home() {
  const [updates, setUpdates] = useState<Update[] | null>(null);
  const [form, setForm] = useState({ name: "", email: "", company: "", size: "" });
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formMsg, setFormMsg] = useState("");
  const [navScrolled, setNavScrolled] = useState(false);
  const [ctaOpen, setCtaOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const heroVideoRef = useRef<HTMLDivElement>(null);
  const heroVideoElRef = useRef<HTMLVideoElement>(null);
  const y1pVideoRef = useRef<HTMLDivElement>(null);
  const y1pVideoElRef = useRef<HTMLVideoElement>(null);

  function enterFullscreen(container: HTMLDivElement | null, video: HTMLVideoElement | null) {
    if (!container || !video) return;
    video.muted = false;
    video.controls = true;
    container.requestFullscreen?.();
    const onExit = () => {
      if (!document.fullscreenElement) {
        video.muted = true;
        video.controls = false;
        document.removeEventListener("fullscreenchange", onExit);
      }
    };
    document.addEventListener("fullscreenchange", onExit);
  }

  useEffect(() => {
    fetch("/updates.json").then((r) => r.json()).then(setUpdates).catch(() => setUpdates([]));
    const onScroll = () => setNavScrolled(window.scrollY > 8);
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setCtaOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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

  const checkIcon = (
    <svg width="10" height="10" viewBox="0 0 10 10">
      <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

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
            <a href="#" style={{ display: "flex", alignItems: "center", gap: 10 }} aria-label="YAHSHUA One home">
              <Image src="/logo.jpg" alt="YAHSHUA One" width={28} height={28} style={{ borderRadius: 8, objectFit: "cover", flexShrink: 0 }} priority />
              <span style={{ fontWeight: 600, letterSpacing: "-0.02em", fontSize: 16 }}>
                YAHSHUA <span style={{ color: "var(--muted)", fontWeight: 400 }}>One</span>
              </span>
            </a>

            <nav style={{ display: "flex", alignItems: "center", gap: 4 }} aria-label="Primary">
              {[
                { label: "Platform",     href: "#platform" },
                { label: "Modules",      href: "#modules" },
                { label: "Intelligence", href: "#intelligence" },
                { label: "Pricing",      href: "#waitlist" },
                { label: "What's New",   href: "/updates" },
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

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <a href="https://app.yahshua.one/" style={{ ...btnGhost, ...btnSm }}>Sign in</a>
              <button onClick={() => setCtaOpen(true)} style={{ ...btnPrimary, ...btnSm }}>
                Get Started <Arrow />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <header style={{ padding: "84px 0 0", position: "relative", overflow: "hidden" }}>
        {/* Aurora glow */}
        <div style={{
          position: "absolute", top: -200, left: "50%", transform: "translateX(-50%)",
          width: 1100, height: 700, pointerEvents: "none", zIndex: 0, filter: "blur(20px)",
          background: "radial-gradient(45% 55% at 50% 30%, var(--accent-glow), transparent 70%), radial-gradient(35% 45% at 30% 50%, oklch(0.9 0.06 215 / 0.4), transparent 70%)",
        }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px", position: "relative", zIndex: 1, textAlign: "center" }}>

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

          <Reveal delay={60}>
            <h1 style={{
              margin: "0 auto 18px",
              fontSize: "clamp(44px, 6.4vw, 88px)",
              lineHeight: 1.02, letterSpacing: "-0.035em", fontWeight: 500,
              maxWidth: 900, color: "var(--ink)", textWrap: "balance" as React.CSSProperties["textWrap"],
            }}>
              The operating system<br />your business{" "}
              <em style={{
                fontStyle: "normal",
                background: "linear-gradient(110deg, var(--accent-2) 5%, var(--accent) 50%, var(--accent-3) 95%)",
                WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
              }}>runs on.</em>
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <p style={{
              fontSize: 19, lineHeight: 1.55, color: "var(--muted)",
              maxWidth: 580, margin: "0 auto 32px",
            }}>
              ERP, HR, accounting, tax, and personal finance: unified in one workspace, automated end-to-end, and answered by an AI that understands your books.
            </p>
          </Reveal>

          <Reveal delay={180}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <button onClick={() => setCtaOpen(true)} style={btnPrimary}>
                Get Started <Arrow />
              </button>
            </div>
          </Reveal>

          <Reveal delay={230}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 28, color: "var(--soft)", fontSize: 13, justifyContent: "center" }}>
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

        {/* ── HERO VIDEO ── */}
        <div style={{ maxWidth: 1200, margin: "56px auto 0", padding: "0 28px", position: "relative", zIndex: 1 }} id="platform">
          <Reveal delay={280}>
            <div
              ref={heroVideoRef}
              style={{
                borderRadius: 16, overflow: "hidden",
                border: "1px solid var(--line)",
                boxShadow: "0 32px 100px rgba(0,0,0,0.12)",
                position: "relative",
              }}
            >
              {/* Browser chrome */}
              <div style={{ height: 36, background: "var(--surface)", display: "flex", alignItems: "center", gap: 6, padding: "0 14px", borderBottom: "1px solid var(--line-2)" }}>
                {(["#FF5F57","#FEBC2E","#28C840"] as const).map((c, i) => (
                  <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                ))}
                <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                  <span style={{ fontSize: 11, color: "var(--soft)", fontFamily: "var(--font-geist-mono, monospace)", background: "var(--bg-tint)", border: "1px solid var(--line-2)", borderRadius: 5, padding: "2px 12px" }}>
                    app.yahshua.one
                  </span>
                </div>
              </div>
              {/* Video */}
              <video
                ref={heroVideoElRef}
                autoPlay muted loop playsInline
                style={{ width: "100%", display: "block" }}
              >
                <source src="/y1-intro.mp4" type="video/mp4" />
              </video>
              {/* Fullscreen button */}
              <button
                onClick={() => enterFullscreen(heroVideoRef.current, heroVideoElRef.current)}
                aria-label="View fullscreen"
                style={{
                  position: "absolute", bottom: 12, right: 12,
                  width: 32, height: 32, borderRadius: 8,
                  background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  color: "#fff", cursor: "pointer",
                  display: "grid", placeItems: "center", padding: 0,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 5V1H5M9 1H13V5M13 9V13H9M5 13H1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </Reveal>
        </div>
      </header>

      {/* ── MODULES HEADER ── */}
      <div id="modules" style={{ maxWidth: 1200, margin: "0 auto", padding: "110px 28px 64px" }}>
        <Reveal>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>
              <Dot /> The platform
            </div>
            <h2 style={{ fontSize: "clamp(34px, 4.2vw, 52px)", letterSpacing: "-0.03em", fontWeight: 500, lineHeight: 1.05, margin: "0 0 16px" }}>
              Five businesses worth of software,<br />in one workspace.
            </h2>
            <p style={{ fontSize: 18, color: "var(--muted)", maxWidth: 600, margin: "0 auto" }}>
              Stop wiring spreadsheets between five tools that don&apos;t talk to each other. YAHSHUA One ships the whole back office as one product, one source of truth.
            </p>
          </div>
        </Reveal>
      </div>

      {/* ── FEATURE: PEOPLE & PAYROLL ── */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <Reveal>
              <div>
                <div style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>
                  02 · People & Payroll
                </div>
                <h2 style={{ fontSize: "clamp(28px, 3.2vw, 42px)", letterSpacing: "-0.03em", fontWeight: 500, lineHeight: 1.08, margin: "0 0 16px" }}>
                  The people side, finally automated.
                </h2>
                <p style={{ fontSize: 17, color: "var(--muted)", lineHeight: 1.6, margin: "0 0 28px" }}>
                  Timekeeping, leaves, payroll, and statutory contributions: auto-computed, paid, and filed on schedule. Your team gets a portal that doesn&apos;t feel like 2008.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["Payroll", "Leaves", "Time tracking", "13th-month", "SSS · PhilHealth · HDMF"].map((tag) => (
                    <li key={tag} style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, padding: "4px 10px", borderRadius: 6, background: "var(--bg-tint)", color: "var(--ink-2)", border: "1px solid var(--line-2)" }}>{tag}</li>
                  ))}
                </ul>
                <button onClick={() => setCtaOpen(true)} style={{ ...btnPrimary }}>Get Started <Arrow /></button>
              </div>
            </Reveal>

            <Reveal direction="left">
              <div style={{ border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden", background: "var(--surface)", boxShadow: "var(--shadow)" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--line-2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>June 2026 Payroll</span>
                  <span style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, background: "var(--accent-50)", color: "var(--accent-2)", padding: "2px 8px", borderRadius: 999 }}>Cutoff in 2 days</span>
                </div>
                {[
                  { init: "LP", name: "Lara Pacheco",   role: "CEO",     amt: "₱ 84,200", status: "ready" },
                  { init: "JM", name: "Jordan Mendoza", role: "Dev",     amt: "₱ 72,500", status: "ready" },
                  { init: "RC", name: "Ria Castro",     role: "Finance", amt: "₱ 68,000", status: "review" },
                  { init: "EM", name: "Eli Manansala",  role: "Sales",   amt: "₱ 91,400", status: "ready" },
                  { init: "BT", name: "Ben Torres",     role: "HR",      amt: "₱ 65,800", status: "ready" },
                ].map((row) => (
                  <div key={row.init} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", borderBottom: "1px solid var(--line-2)", fontSize: 13 }}>
                    <span style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--bg-tint)", color: "var(--ink-2)", fontSize: 11, display: "grid", placeItems: "center", fontWeight: 500, flexShrink: 0 }}>{row.init}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500 }}>{row.name}</div>
                      <div style={{ fontSize: 11, color: "var(--soft)" }}>{row.role}</div>
                    </div>
                    <span style={{ fontVariantNumeric: "tabular-nums", color: "var(--ink-2)" }}>{row.amt}</span>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, fontFamily: "var(--font-geist-mono, monospace)", background: row.status === "review" ? "oklch(0.96 0.04 75)" : "var(--accent-50)", color: row.status === "review" ? "#8A5A2A" : "var(--accent-2)" }}>{row.status}</span>
                  </div>
                ))}
                <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "var(--muted)" }}>5 employees · ₱ 381,900 total</span>
                  <span style={{ fontSize: 12, padding: "7px 14px", background: "var(--ink)", color: "#fff", borderRadius: 8, fontFamily: "inherit" }}>
                    Process payroll →
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FEATURE: TAX & COMPLIANCE ── */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--line)", background: "var(--surface)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <Reveal direction="right">
              <div style={{ border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden", background: "var(--bg)", boxShadow: "var(--shadow)" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--line-2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>BIR Filing Calendar</span>
                  <span style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, color: "var(--soft)" }}>Q2 · 2026</span>
                </div>
                {[
                  { form: "1601-C", label: "Withholding Tax on Compensation", due: "Jul 10", status: "filed",    ref: "ref 99-22-148" },
                  { form: "2550M",  label: "Monthly VAT Declaration",          due: "Jul 20", status: "draft",    ref: "Draft ready" },
                  { form: "1701Q",  label: "Quarterly Income Tax Return",      due: "Aug 15", status: "upcoming", ref: "AI drafting Q2 data" },
                  { form: "1604-C", label: "Annual Withholding Summary",        due: "Jan 31", status: "upcoming", ref: "Next cycle" },
                ].map((row) => (
                  <div key={row.form} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 20px", borderBottom: "1px solid var(--line-2)", fontSize: 13 }}>
                    <span style={{
                      fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, fontWeight: 600,
                      color: "var(--accent-2)", background: "var(--accent-50)", padding: "3px 8px", borderRadius: 6, flexShrink: 0, minWidth: 56, textAlign: "center",
                    }}>{row.form}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.label}</div>
                      <div style={{ fontSize: 11, color: "var(--soft)", marginTop: 2 }}>{row.ref}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-geist-mono, monospace)" }}>{row.due}</div>
                      <span style={{
                        fontSize: 10, padding: "2px 8px", borderRadius: 999, marginTop: 3, display: "inline-block",
                        fontFamily: "var(--font-geist-mono, monospace)",
                        background: row.status === "filed" ? "var(--accent-50)" : row.status === "draft" ? "oklch(0.95 0.04 75)" : "var(--bg-tint)",
                        color: row.status === "filed" ? "var(--accent-2)" : row.status === "draft" ? "#8A5A2A" : "var(--soft)",
                      }}>{row.status}</span>
                    </div>
                  </div>
                ))}
                <div style={{ padding: "12px 20px", fontSize: 12, color: "var(--muted)", background: "var(--surface)", display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="var(--accent-2)" strokeWidth="1.3"/><path d="M7 4V7L9 9" stroke="var(--accent-2)" strokeWidth="1.3" strokeLinecap="round"/></svg>
                  Next deadline in <strong style={{ color: "var(--ink-2)" }}>10 days</strong>. Draft already prepared.
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <div style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>
                  04 · Tax & Compliance
                </div>
                <h2 style={{ fontSize: "clamp(28px, 3.2vw, 42px)", letterSpacing: "-0.03em", fontWeight: 500, lineHeight: 1.08, margin: "0 0 16px" }}>
                  BIR-ready forms. Quarterly filings drafted, reviewed, submitted.
                </h2>
                <p style={{ fontSize: 17, color: "var(--muted)", lineHeight: 1.6, margin: "0 0 28px" }}>
                  Every BIR deadline tracked, every return drafted from your actual books. You review and sign. YAHSHUA One handles the rest.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["VAT", "1701Q", "1601-C", "SSS", "PhilHealth", "Pag-IBIG"].map((tag) => (
                    <li key={tag} style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, padding: "4px 10px", borderRadius: 6, background: "var(--bg-tint)", color: "var(--ink-2)", border: "1px solid var(--line-2)" }}>{tag}</li>
                  ))}
                </ul>
                <button onClick={() => setCtaOpen(true)} style={{ ...btnPrimary }}>Get Started <Arrow /></button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FEATURE: AI ── */}
      <section id="intelligence" style={{ padding: "80px 0", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <div style={{
            background: "var(--ink)", color: "#F7F6F1", borderRadius: "var(--radius-xl)",
            padding: 64, display: "grid", gridTemplateColumns: "1fr 1.05fr", gap: 60,
            alignItems: "center", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "radial-gradient(50% 60% at 90% 0%, var(--accent-glow), transparent 60%), radial-gradient(40% 50% at 0% 100%, oklch(0.7 0.12 215 / 0.18), transparent 60%)",
            }} />

            <Reveal>
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-3)", marginBottom: 14 }}>
                  Intelligence
                </div>
                <h2 style={{ fontSize: "clamp(28px, 3.2vw, 42px)", letterSpacing: "-0.03em", fontWeight: 500, lineHeight: 1.05, margin: "0 0 18px" }}>
                  An AI that&apos;s <em style={{ fontStyle: "normal", color: "var(--accent-3)" }}>read your books.</em> Not just the internet.
                </h2>
                <p style={{ color: "oklch(0.85 0.01 250)", fontSize: 17, lineHeight: 1.55, margin: "0 0 28px", maxWidth: 480 }}>
                  Every transaction, employee record, invoice, and tax form lives in one schema. The assistant queries it directly, so the answer it gives is the answer you&apos;d get by spending a day in spreadsheets.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { title: "Grounded in your ledger.", body: "No hallucinations. Every figure is traceable to a journal entry." },
                    { title: "Acts, not just answers.", body: "Approve a payroll run, file a return, or send an invoice. In chat." },
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
                <button onClick={() => setCtaOpen(true)} style={{
                  display: "inline-flex", alignItems: "center", gap: 8, height: 44, padding: "0 18px",
                  borderRadius: 999, border: "1px solid oklch(0.35 0.012 250)", color: "#fff",
                  fontWeight: 500, fontSize: 14.5, background: "transparent",
                  cursor: "pointer", fontFamily: "inherit",
                }}>
                  Get Started <Arrow />
                </button>
              </div>
            </Reveal>

            <Reveal direction="left">
              <div style={{
                background: "oklch(0.2 0.012 250)", border: "1px solid oklch(0.28 0.012 250)",
                borderRadius: 16, padding: 20, position: "relative", zIndex: 1,
                display: "flex", flexDirection: "column", gap: 14,
                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              }} aria-hidden>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13.5, lineHeight: 1.5 }}>
                  <span style={{ width: 26, height: 26, borderRadius: 6, background: "oklch(0.3 0.01 250)", color: "#fff", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 600, flexShrink: 0 }}>L</span>
                  <div>
                    <div style={{ fontSize: 11, color: "oklch(0.6 0.01 250)", marginBottom: 4, fontFamily: "var(--font-geist-mono, monospace)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Lara · CEO</div>
                    <div style={{ color: "oklch(0.85 0.01 250)" }}>How much can I pay myself as a dividend this quarter without breaking covenants?</div>
                  </div>
                </div>

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

                <div style={{
                  marginTop: 6, background: "oklch(0.16 0.012 250)", border: "1px solid oklch(0.28 0.012 250)",
                  borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10,
                  color: "oklch(0.55 0.01 250)", fontSize: 13,
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2L9.6 6L14 6.6L10.8 9.6L11.6 14L8 11.8L4.4 14L5.2 9.6L2 6.6L6.4 6L8 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                  </svg>
                  <span>Ask anything: &ldquo;forecast next quarter&rdquo;, &ldquo;file 1601C&rdquo;, &ldquo;pay Lara…&rdquo;</span>
                  <span style={{ marginLeft: "auto", width: 26, height: 26, borderRadius: 6, background: "var(--accent)", display: "grid", placeItems: "center", color: "#0a1418", flexShrink: 0 }}>
                    <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6H10M10 6L7 3M10 6L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FEATURE: ERP ── */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--line)", background: "var(--surface)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <Reveal direction="right">
              <div style={{ border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden", background: "var(--bg)", boxShadow: "var(--shadow)" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--line-2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Inventory & Orders</span>
                  <span style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, color: "var(--soft)" }}>Northwind Trading</span>
                </div>
                {[
                  { sku: "NWT-001", item: "Robusta Green Beans (50kg)", stock: 240,  status: "ok" },
                  { sku: "NWT-002", item: "Arabica Blend (25kg)",       stock: 18,   status: "low" },
                  { sku: "NWT-003", item: "Export Bags (box/100)",      stock: 580,  status: "ok" },
                  { sku: "NWT-004", item: "Roasting Labels (roll)",     stock: 4,    status: "low" },
                ].map((row) => (
                  <div key={row.sku} style={{ display: "flex", alignItems: "center", gap: 14, padding: "11px 20px", borderBottom: "1px solid var(--line-2)", fontSize: 13 }}>
                    <span style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 10, color: "var(--soft)", flexShrink: 0 }}>{row.sku}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.item}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontVariantNumeric: "tabular-nums", color: "var(--ink-2)" }}>{row.stock} units</div>
                      <span style={{
                        fontSize: 10, padding: "2px 8px", borderRadius: 999, marginTop: 3, display: "inline-block",
                        fontFamily: "var(--font-geist-mono, monospace)",
                        background: row.status === "ok" ? "var(--accent-50)" : "oklch(0.96 0.06 30)",
                        color: row.status === "ok" ? "var(--accent-2)" : "#B45B4E",
                      }}>{row.status === "low" ? "reorder" : "ok"}</span>
                    </div>
                  </div>
                ))}
                <div style={{ padding: "12px 20px", fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>4 SKUs · 2 below reorder point</span>
                  <span style={{ fontSize: 12, padding: "5px 12px", background: "var(--ink)", color: "#fff", borderRadius: 6, fontFamily: "inherit" }}>Auto-reorder →</span>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <div style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>
                  01 · ERP
                </div>
                <h2 style={{ fontSize: "clamp(28px, 3.2vw, 42px)", letterSpacing: "-0.03em", fontWeight: 500, lineHeight: 1.08, margin: "0 0 16px" }}>
                  Run operations without spreadsheets.
                </h2>
                <p style={{ fontSize: 17, color: "var(--muted)", lineHeight: 1.6, margin: "0 0 28px" }}>
                  Inventory, sales orders, purchasing, and vendors connected to the same ledger your accountant uses. No exports. No reconciliation tickets at 11pm.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["Inventory", "Sales orders", "Procurement", "Vendors", "Multi-branch"].map((tag) => (
                    <li key={tag} style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, padding: "4px 10px", borderRadius: 6, background: "var(--bg-tint)", color: "var(--ink-2)", border: "1px solid var(--line-2)" }}>{tag}</li>
                  ))}
                </ul>
                <button onClick={() => setCtaOpen(true)} style={{ ...btnPrimary }}>Get Started <Arrow /></button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--surface)" }}>
              {[
                { num: "40+",    lbl: "Hours of admin returned to founders every month." },
                { num: "99.97%", lbl: "Filing accuracy across BIR, SSS, PhilHealth, Pag-IBIG." },
                { num: "1 day",  lbl: "Average onboarding from sign-up to first reconciled month." },
                { num: "0",      lbl: "Spreadsheets emailed at 2am between you and your accountant." },
              ].map((fig, i) => (
                <div key={fig.num} style={{ padding: "36px 28px", borderRight: i < 3 ? "1px solid var(--line)" : "none" }}>
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

      {/* ── BIR REGISTRATION ── */}
      <section style={{ padding: "56px 0", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <p style={{
              textAlign: "center", fontFamily: "var(--font-geist-mono, monospace)",
              fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
              color: "var(--soft)", marginBottom: 32,
            }}>
              Officially registered · Bureau of Internal Revenue
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {[
                { src: "/BIR%20Registration%20Seal%20Badge_1.png",  alt: "BIR Registration Seal Badge 1" },
                { src: "/BIR%20Registration%20Seal%20Badge_%202.png", alt: "BIR Registration Seal Badge 2" },
                { src: "/BIR%20Registration%20Seal%20Badge_3.png",  alt: "BIR Registration Seal Badge 3" },
              ].map((item, i) => (
                <div key={i} style={{
                  border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden",
                  background: "var(--surface)", boxShadow: "var(--shadow-sm)",
                }}>
                  <img
                    src={item.src} alt={item.alt}
                    loading="lazy" decoding="async"
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── YAHSHUA ONE PAYROLL SPOTLIGHT ── */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.45fr", gap: 64, alignItems: "center" }}>
            <Reveal>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 12px 4px 8px", border: "1px solid var(--line)", background: "var(--surface)", borderRadius: 999, fontSize: 12, marginBottom: 20, boxShadow: "var(--shadow-sm)" }}>
                  <span style={{ width: 20, height: 20, borderRadius: 6, background: "var(--ink)", color: "var(--accent-3)", display: "grid", placeItems: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>P</span>
                  <span style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, letterSpacing: "0.04em", color: "var(--ink-2)", textTransform: "uppercase" }}>YAHSHUA One Payroll</span>
                </div>
                <h2 style={{ fontSize: "clamp(28px, 3.2vw, 42px)", letterSpacing: "-0.03em", fontWeight: 500, lineHeight: 1.08, margin: "0 0 16px" }}>
                  Need just payroll?<br />It stands on its own.
                </h2>
                <p style={{ fontSize: 17, color: "var(--muted)", lineHeight: 1.6, margin: "0 0 28px" }}>
                  YAHSHUA One Payroll is a focused product you can run without the full platform. Everything your payroll team needs, nothing it doesn&apos;t. Theo AI reads your actual company data and answers compliance questions in plain language.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    "Theo AI: payroll questions answered from your real data",
                    "Policy Handbook auto-generated from your settings",
                    "Custom reports on demand",
                    "Org chart built from your structure",
                  ].map((item) => (
                    <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14.5, color: "var(--ink-2)" }}>
                      <span style={{ width: 18, height: 18, borderRadius: 5, background: "var(--accent-50)", color: "var(--accent-2)", display: "grid", placeItems: "center", flexShrink: 0, marginTop: 1 }}>
                        <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="/payroll" style={{
                  display: "inline-flex", alignItems: "center", gap: 8, height: 44, padding: "0 18px",
                  borderRadius: 999, background: "var(--ink)", color: "#fff",
                  fontWeight: 500, fontSize: 14.5, textDecoration: "none",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 2px rgba(15,17,21,0.18)",
                }}>
                  Explore YAHSHUA One Payroll <Arrow />
                </a>
              </div>
            </Reveal>

            <Reveal direction="left">
              <div
                ref={y1pVideoRef}
                style={{ borderRadius: 16, overflow: "hidden", border: "1px solid oklch(0.22 0.012 250)", boxShadow: "0 24px 80px rgba(0,0,0,0.18)", position: "relative" }}
              >
                {/* Dark chrome — matches Y1P */}
                <div style={{ height: 36, background: "oklch(0.1 0.01 250)", display: "flex", alignItems: "center", gap: 6, padding: "0 14px", borderBottom: "1px solid oklch(0.18 0.01 250)" }}>
                  {(["oklch(0.55 0.18 25)","oklch(0.7 0.16 70)","oklch(0.6 0.18 145)"] as const).map((bg, i) => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: bg }} />
                  ))}
                  <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                    <span style={{ fontSize: 11, color: "oklch(0.38 0.01 250)", fontFamily: "var(--font-geist-mono, monospace)", background: "oklch(0.15 0.01 250)", border: "1px solid oklch(0.22 0.01 250)", borderRadius: 5, padding: "2px 12px" }}>
                      app.yahshua.one · Payroll
                    </span>
                  </div>
                </div>
                <video
                  ref={y1pVideoElRef}
                  autoPlay muted loop playsInline
                  poster="/ss-payslip.jpg"
                  style={{ width: "100%", display: "block" }}
                >
                  <source src="/clip-payslip.mp4" type="video/mp4" />
                </video>
                {/* Fullscreen button */}
                <button
                  onClick={() => enterFullscreen(y1pVideoRef.current, y1pVideoElRef.current)}
                  aria-label="View fullscreen"
                  style={{
                    position: "absolute", bottom: 12, right: 12,
                    width: 32, height: 32, borderRadius: 8,
                    background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.16)",
                    color: "#fff", cursor: "pointer",
                    display: "grid", placeItems: "center", padding: 0,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 5V1H5M9 1H13V5M13 9V13H9M5 13H1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <Reveal direction="scale">
            <div style={{
              border: "1px solid var(--line)",
              background: "radial-gradient(70% 100% at 0% 100%, var(--accent-glow), transparent 60%), radial-gradient(60% 100% at 100% 0%, oklch(0.95 0.03 215 / 0.5), transparent 60%), var(--surface)",
              borderRadius: "var(--radius-xl)", padding: 72, textAlign: "center", position: "relative", overflow: "hidden",
            }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center", fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 20 }}>
                <Dot /> Ready when you are
              </div>
              <h2 style={{ fontSize: "clamp(36px, 4.4vw, 60px)", letterSpacing: "-0.035em", fontWeight: 500, lineHeight: 1.05, margin: "0 0 16px" }}>
                Run your business on <em style={{ fontStyle: "normal", color: "var(--accent-2)" }}>one platform.</em>
              </h2>
              <p style={{ color: "var(--muted)", fontSize: 18, maxWidth: 540, margin: "0 auto 28px" }}>
                Start free for 30 days. Bring your whole back office over, or just one module. We&apos;ll meet you where you are.
              </p>
              <button onClick={() => setCtaOpen(true)} style={btnPrimary}>
                Get Started <Arrow />
              </button>
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
                    { label: "Full Name", key: "name",    type: "text",  placeholder: "Juan dela Cruz",      required: true },
                    { label: "Email",     key: "email",   type: "email", placeholder: "juan@company.com.ph", required: true },
                    { label: "Company",   key: "company", type: "text",  placeholder: "Dela Cruz Trading",   required: false },
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
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 12 }}>
              <Dot /> Build Log
            </div>
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
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 12 }}>
              <Dot /> FAQ
            </div>
            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", letterSpacing: "-0.025em", fontWeight: 500, margin: "0 0 40px" }}>
              Common questions
            </h2>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              {
                q: "Does YAHSHUA One automate payroll computation in the Philippines?",
                a: "Yes. YAHSHUA One automatically computes payroll for all employees, including SSS, PhilHealth, Pag-IBIG, and withholding tax deductions. It generates payslips and prepares bank disbursement files with zero manual computation required.",
              },
              {
                q: "Does it handle BIR compliance and tax filings?",
                a: "Yes. YAHSHUA One tracks all BIR deadlines including 1601-C, 2550M, and quarterly returns. It generates BIR-ready reports and alerts you weeks before every filing deadline so you never incur penalties again.",
              },
              {
                q: "Can YAHSHUA One handle HR onboarding and offboarding?",
                a: "Yes. YAHSHUA One manages the full employee lifecycle: digital onboarding, contract management, leave requests, overtime approvals, and offboarding. Employees get a self-service portal to view their payslips, leave balances, and records anytime.",
              },
              {
                q: "Is YAHSHUA One built specifically for Filipino businesses?",
                a: "100%. YAHSHUA One is built from the ground up for the Philippine business environment: BIR, SSS, PhilHealth, and Pag-IBIG compliance baked in, Philippine Labor Code leave policies, and peso-denominated reporting.",
              },
              {
                q: "How is it different from other payroll or HR systems in the Philippines?",
                a: "Most systems only cover one area: payroll, HR, or accounting. YAHSHUA One combines all of them in one AI-powered platform. It's also built specifically for Filipino SMBs, not adapted from a foreign product.",
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
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr repeat(4, 1fr)", gap: 36, marginBottom: 48 }}>
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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 28, borderTop: "1px solid var(--line)" }}>
            <span>© 2026 YAHSHUA One, Inc.</span>
          </div>
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
                  document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
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
