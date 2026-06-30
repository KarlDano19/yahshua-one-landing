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
            <a href="#" style={{ display: "flex", alignItems: "center", gap: 10 }} aria-label="YAHSHUA One home">
              <Image src="/logo.jpg" alt="YAHSHUA One" width={28} height={28} style={{ borderRadius: 8, objectFit: "cover", flexShrink: 0 }} priority />
              <span style={{ fontWeight: 600, letterSpacing: "-0.02em", fontSize: 16 }}>
                YAHSHUA <span style={{ color: "var(--muted)", fontWeight: 400 }}>One</span>
              </span>
            </a>

            <nav style={{ display: "flex", alignItems: "center", gap: 4 }} aria-label="Primary">
              {[
                { label: "Platform",    href: "#platform" },
                { label: "Modules",     href: "#modules" },
                { label: "Intelligence",href: "#intelligence" },
                { label: "Pricing",     href: "#waitlist" },
                { label: "What's New",  href: "/updates" },
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

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <a href="https://app.yahshua.one/" style={{ ...btnGhost, ...btnSm }}>Sign in</a>
              <a href="https://app.yahshua.one/" style={{ ...btnPrimary, ...btnSm }}>
                Start free <Arrow />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <header style={{ padding: "84px 0 56px", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: -200, left: "50%", transform: "translateX(-50%)",
          width: 1100, height: 700, pointerEvents: "none", zIndex: 0, filter: "blur(20px)",
          background: "radial-gradient(45% 55% at 50% 30%, var(--accent-glow), transparent 70%), radial-gradient(35% 45% at 30% 50%, oklch(0.9 0.06 215 / 0.4), transparent 70%)",
        }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px", position: "relative", zIndex: 1 }}>

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
              }}>Early access</span>
              <span>Now open for Filipino businesses</span>
            </div>
          </Reveal>

          <Reveal delay={60}>
            <h1 style={{
              margin: "0 0 18px",
              fontSize: "clamp(44px, 6.4vw, 88px)",
              lineHeight: 1.02, letterSpacing: "-0.035em", fontWeight: 500,
              maxWidth: 980, color: "var(--ink)", textWrap: "balance" as React.CSSProperties["textWrap"],
            }}>
              One login.{" "}
              <em style={{ fontStyle: "normal", color: "var(--accent-2)" }}>Every number<br />in your business.</em>
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <p style={{
              fontSize: 19, lineHeight: 1.55, color: "var(--muted)",
              maxWidth: 620, margin: "0 0 32px",
            }}>
              YAHSHUA One is the back office Filipino businesses have been waiting for — payroll, accounting, HR, and BIR compliance running on the same data. So what your payslip shows and what your books show are always the same number.
            </p>
          </Reveal>

          <Reveal delay={180}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="#waitlist" style={btnPrimary}>
                Start free for 30 days <Arrow />
              </a>
              <a href="#platform" style={btnGhost}>Watch the 3-minute tour</a>
            </div>
          </Reveal>

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
              <span>
                <strong style={{ color: "var(--ink-2)", fontWeight: 500 }}>1,200+ Filipino founders</strong>
                {" "}on the waitlist · SSS · PhilHealth · Pag-IBIG · BIR-ready from day one
              </span>
            </div>
          </Reveal>

          <div id="platform" />
        </div>
      </header>

      {/* ── MODULES ── */}
      <section id="modules" style={{ padding: "110px 0", position: "relative" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div style={{ maxWidth: 760, marginBottom: 56 }}>
              <h2 style={{ margin: "0 0 14px", fontSize: "clamp(34px, 4.2vw, 52px)", letterSpacing: "-0.03em", fontWeight: 500, lineHeight: 1.05 }}>
                The back office is five jobs.<br />YAHSHUA One is one.
              </h2>
              <p style={{ margin: 0, fontSize: 18, color: "var(--muted)", maxWidth: 640, lineHeight: 1.6 }}>
                ERP, HR, payroll, accounting, and tax compliance — all running on the same record. When HR updates a salary, payroll adjusts automatically. When payroll runs, the journal entries post to your books. When the cutoff passes, the BIR filing drafts itself. One update. Zero reconciliation.
              </p>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 16 }}>
            {/* ERP */}
            <div style={{ gridColumn: "span 6" }}>
              <Reveal delay={0}>
                <article style={{
                  background: "linear-gradient(180deg, #fff 0%, var(--accent-50) 100%)",
                  border: "1px solid oklch(0.88 0.06 215 / 0.6)", borderRadius: "var(--radius-lg)",
                  padding: 24, minHeight: 280, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", height: "100%",
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ width: 32, height: 32, borderRadius: 8, background: "var(--ink)", display: "grid", placeItems: "center", color: "var(--accent-3)" }}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M3 14V7L9 3L15 7V14" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                        <path d="M6 14V10H12V14" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, color: "var(--soft)", letterSpacing: "0.06em" }}>01 · ERP</span>
                  </div>
                  <h3 style={{ fontSize: 21, fontWeight: 500, letterSpacing: "-0.02em", margin: "8px 0 6px" }}>Your operations and your ledger, finally speaking to each other.</h3>
                  <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.5, margin: "0 0 14px" }}>
                    Sales orders, purchasing, inventory, and vendor management — all flowing into the same accounting data your finance team uses. No month-end exports. No reconciliation tickets at 11pm.
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: "auto 0 0", display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {["Inventory", "Sales orders", "Procurement", "Vendors", "Multi-branch"].map((tag) => (
                      <li key={tag} style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "var(--bg-tint)", color: "var(--ink-2)" }}>{tag}</li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </div>

            {/* HRM */}
            <div style={{ gridColumn: "span 6" }}>
              <Reveal delay={60}>
                <article style={{
                  background: "linear-gradient(180deg, #fff 0%, var(--accent-50) 100%)",
                  border: "1px solid oklch(0.88 0.06 215 / 0.6)", borderRadius: "var(--radius-lg)",
                  padding: 24, minHeight: 280, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", height: "100%",
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ width: 32, height: 32, borderRadius: 8, background: "var(--ink)", display: "grid", placeItems: "center", color: "var(--accent-3)" }}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M3 15C3.6 12 5.8 10.5 9 10.5C12.2 10.5 14.4 12 15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </span>
                    <span style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, color: "var(--soft)", letterSpacing: "0.06em" }}>02 · HRM</span>
                  </div>
                  <h3 style={{ fontSize: 21, fontWeight: 500, letterSpacing: "-0.02em", margin: "8px 0 6px" }}>Every employee record feeds every system automatically.</h3>
                  <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.5, margin: "0 0 14px" }}>
                    Hire in YAHSHUA HR — that record auto-populates payroll, leave balances, and statutory contributions. Promote someone? Salary history updates everywhere. No duplicate entry, no correction cycles.
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: "auto 0 0", display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {["Payroll", "Leaves", "Timekeeping", "13th month", "SSS · PhilHealth · HDMF"].map((tag) => (
                      <li key={tag} style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "var(--bg-tint)", color: "var(--ink-2)" }}>{tag}</li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </div>

            {/* Small modules */}
            {[
              { id: "03", title: "Accounting", desc: "Real-time books that close themselves. Every transaction categorized, reconciled, and posted — automatically.", tags: ["Books", "Recon", "P&L"], icon: (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 15V3M2 15H16M5 12V9M8 12V5M11 12V7M14 12V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )},
              { id: "04", title: "Tax & Compliance", desc: "BIR deadlines managed, penalties avoided. 1601-C, 2550M, quarterly returns — drafted and filed on schedule.", tags: ["VAT", "1701Q", "1601-C"], icon: (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="3" y="2" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M6 6H12M6 9H12M6 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )},
              { id: "05", title: "Personal Finance", desc: "Your personal cash flow, ITR, and financial goals — connected to your business data. One login for the full picture.", tags: ["Budget", "Goals", "ITR"], icon: (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M9 5V9L11.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )},
              { id: "+", title: "Marketplace", desc: "Drop-in integrations for billing, e-commerce, and Philippine payment rails.", tags: ["Maya", "GCash", "BIR"], icon: (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 1L11 6L16 6.5L12.5 10L13.5 15L9 12.5L4.5 15L5.5 10L2 6.5L7 6L9 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              )},
            ].map((mod, i) => (
              <div key={mod.id} style={{ gridColumn: "span 3" }}>
                <Reveal delay={i * 50}>
                  <article style={{
                    background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)",
                    padding: 24, minHeight: 220, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative",
                    transition: "border-color .2s ease, box-shadow .2s ease", height: "100%",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ width: 32, height: 32, borderRadius: 8, background: "var(--bg-tint)", display: "grid", placeItems: "center", color: "var(--ink)" }}>
                        {mod.icon}
                      </span>
                      <span style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, color: "var(--soft)", letterSpacing: "0.06em" }}>{mod.id}</span>
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

      {/* ── AI / THEO ── */}
      <section id="intelligence" style={{ paddingTop: 24, paddingBottom: 110 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div style={{
              background: "var(--ink)", color: "#F7F6F1", borderRadius: "var(--radius-xl)",
              padding: 64, display: "grid", gridTemplateColumns: "1fr 1.05fr", gap: 60,
              alignItems: "center", position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "radial-gradient(50% 60% at 90% 0%, var(--accent-glow), transparent 60%), radial-gradient(40% 50% at 0% 100%, oklch(0.7 0.12 215 / 0.18), transparent 60%)",
              }} />

              {/* Text side */}
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-3)", marginBottom: 14 }}>
                  <Dot /> Theo AI
                </div>
                <h2 style={{ fontSize: "clamp(34px, 3.6vw, 46px)", letterSpacing: "-0.03em", fontWeight: 500, lineHeight: 1.05, margin: "0 0 18px" }}>
                  Theo has read your books.{" "}
                  <em style={{ fontStyle: "normal", color: "var(--accent-3)" }}>Your payroll. Your BIR filings.</em>
                </h2>
                <p style={{ color: "oklch(0.72 0.01 250)", fontSize: 17, lineHeight: 1.55, margin: "0 0 28px", maxWidth: 480 }}>
                  Theo is the AI built into YAHSHUA One. It doesn&apos;t search the internet or give generic answers. It queries your actual company data and gives you the answer you&apos;d get by spending a day in spreadsheets. Then it offers to do something about it.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { title: "Traceable answers.", body: "Every figure Theo gives you links to the journal entry, payslip, or government filing it came from. Auditable, not approximate." },
                    { title: "Acts on your behalf.", body: "Approve a payroll run, file a return, generate a custom report. Theo executes within your account permissions." },
                    { title: "Philippine compliance built in.", body: "Ask about your de minimis cap, SSS employer share, or withholding tax bracket. Theo knows the TRAIN Law — not just US tax law." },
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
                  See what Theo can do for your business <Arrow />
                </a>
              </div>

              {/* Theo chat mockup */}
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
                    <div style={{ fontSize: 11, color: "oklch(0.6 0.01 250)", marginBottom: 4, fontFamily: "var(--font-geist-mono, monospace)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Lara · Finance Manager</div>
                    <div style={{ color: "oklch(0.85 0.01 250)" }}>How much did we spend on government contributions last quarter — and are we paying the right rate for our current headcount?</div>
                  </div>
                </div>

                {/* Theo message */}
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13.5, lineHeight: 1.5 }}>
                  <span style={{ width: 26, height: 26, borderRadius: 6, background: "linear-gradient(135deg, var(--accent), var(--accent-2))", color: "#0a1418", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 600, flexShrink: 0 }}>T</span>
                  <div>
                    <div style={{ fontSize: 11, color: "oklch(0.6 0.01 250)", marginBottom: 4, fontFamily: "var(--font-geist-mono, monospace)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Theo · YAHSHUA One</div>
                    <div style={{ color: "#F4F2EC" }}>Total statutory contributions for Q2: ₱682,400. All computed at correct 2025 rates across 68 employees. No discrepancies found.</div>
                    <div style={{
                      background: "oklch(0.24 0.012 250)", border: "1px solid oklch(0.3 0.012 250)",
                      borderRadius: 10, padding: 12, marginTop: 8,
                      fontFamily: "var(--font-geist-mono, monospace)", fontSize: 12, color: "oklch(0.82 0.01 250)",
                      display: "flex", flexDirection: "column", gap: 6,
                    }}>
                      {[
                        { k: "sss_total",        v: "₱ 284,000" },
                        { k: "philhealth_total",  v: "₱ 220,000" },
                        { k: "pagibig_total",     v: "₱ 178,400" },
                      ].map((row) => (
                        <div key={row.k}><span style={{ color: "var(--accent-3)" }}>{row.k}</span> = <span style={{ color: "#fff" }}>{row.v}</span></div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                      <button style={{ fontSize: 12, padding: "5px 10px", background: "var(--accent-3)", border: "none", borderRadius: 999, color: "#0a1418", display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Generate Q3 projection
                      </button>
                      {["Show breakdown by employee", "Export for audit"].map((label) => (
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
                  <span>Ask anything — &ldquo;run payroll&rdquo;, &ldquo;file 1601-C&rdquo;, &ldquo;what&apos;s our de minimis cap?&rdquo;</span>
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
                Set up in a day.<br />Running on its own from there.
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              {
                num: "1", title: "Connect your data",
                body: "Import your employee records, bank statements, and existing payroll data. We handle the field mapping. Most businesses are importing in under an hour.",
              },
              {
                num: "2", title: "Confirm your settings",
                body: "Chart of accounts, payroll cutoff dates, leave policies, and contribution tables. We preset the Philippine defaults. You confirm what fits your company — usually a 20-minute call with your accountant.",
              },
              {
                num: "3", title: "Approve. That's your whole job now.",
                body: "Every cutoff, YAHSHUA computes payroll, posts journal entries, and queues the government filing reports. You review. You approve. You close the laptop.",
              },
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--surface)" }}>
              {[
                { num: "40+",    lbl: "Hours returned to founders every month — not reviewing payroll, chasing filing deadlines, or reconciling accounts." },
                { num: "₱0",    lbl: "In BIR late filing penalties for businesses managing compliance through YAHSHUA." },
                { num: "1 day", lbl: "From sign-up to your first fully reconciled payroll cutoff." },
                { num: "1",     lbl: "Source of truth for every peso in your business. HR, payroll, accounting, and tax — all reading from the same record." },
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

      {/* ── POSITIONING ── */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "clamp(28px, 3.2vw, 42px)", letterSpacing: "-0.03em", fontWeight: 500, lineHeight: 1.08, textWrap: "balance" as React.CSSProperties["textWrap"] }}>
                  Most back office tools were built for other markets. Then localized for the Philippines.<br />
                  <em style={{ fontStyle: "normal", color: "var(--accent-2)" }}>YAHSHUA One wasn&apos;t.</em>
                </h2>
              </div>
              <div style={{ paddingTop: 6 }}>
                <p style={{ fontSize: 17, lineHeight: 1.65, color: "var(--muted)", margin: "0 0 20px" }}>
                  We built for BIR forms, SSS rates, PhilHealth circulars, and Philippine Labor Code leave policies from the first line of code — not as a configuration layer, not as a plugin, but as the foundation.
                </p>
                <p style={{ fontSize: 17, lineHeight: 1.65, color: "var(--muted)", margin: "0 0 28px" }}>
                  That&apos;s why your statutory contributions compute correctly. Your 1601-C generates natively. Your payslip format complies with DOLE requirements. The Philippines isn&apos;t an edge case here — it&apos;s the only case.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["BIR-native", "SSS · PhilHealth · Pag-IBIG built in", "TRAIN Law compliant", "DOLE-aligned", "Philippine Labor Code"].map((tag) => (
                    <span key={tag} style={{ fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11.5, padding: "4px 10px", borderRadius: 6, background: "var(--bg-tint)", color: "var(--ink-2)", border: "1px solid var(--line)" }}>{tag}</span>
                  ))}
                </div>
              </div>
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
                Your first clean month of books<br />
                <em style={{ fontStyle: "normal", color: "var(--accent-2)" }}>starts here.</em>
              </h2>
              <p style={{ color: "var(--muted)", fontSize: 18, maxWidth: 560, margin: "0 auto 32px", lineHeight: 1.6 }}>
                Try YAHSHUA One free for 30 days. Bring your payroll, HR, and accounting over. If it doesn&apos;t change how you run your back office, you walk away — we&apos;ll even help you export everything out.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
                <a href="#waitlist" style={btnPrimary}>
                  Start my free trial <Arrow />
                </a>
                <a href="#waitlist" style={btnGhost}>Talk to the founders</a>
              </div>
              <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
                {["No credit card", "Philippine compliance built in", "30-day free trial", "Cancel anytime"].map((badge) => (
                  <span key={badge} style={{ fontSize: 12.5, color: "var(--soft)", display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L4.5 8L9.5 4" stroke="var(--accent-2)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {badge}
                  </span>
                ))}
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
                Get in before<br />the price changes.
              </h2>
              <p style={{ fontSize: 18, color: "var(--muted)", lineHeight: 1.6 }}>
                YAHSHUA One is in early access. Founding members get their first 6 months free, priority onboarding, and a direct line to the team while we build. Once general availability opens, this offer closes.
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
                  <p style={{ fontWeight: 600, color: "var(--ink)", fontSize: 18, margin: "0 0 8px" }}>You&apos;re in.</p>
                  <p style={{ color: "var(--muted)", fontSize: 14, margin: "0 0 8px" }}>{formMsg}</p>
                  <p style={{ color: "var(--soft)", fontSize: 13 }}>We&apos;ll send onboarding details to your email within 24 hours.</p>
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
                    {formState === "loading" ? "Sending…" : "Claim my founding access →"}
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
              <p style={{ color: "var(--muted)", fontSize: 18 }}>No updates yet. We&apos;re building.</p>
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
              Things Filipino businesses ask before switching.
            </h2>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              {
                q: "Does YAHSHUA One automate payroll for Filipino employees?",
                a: "Yes. Every employee's payslip computes automatically — basic pay, overtime, night differential, 13th month, SSS, PhilHealth, Pag-IBIG, and withholding tax. De minimis benefit tracking included. Your only job is review and approve.",
              },
              {
                q: "How is this different from Sprout Solutions, GreatDay HR, or PayrollHero?",
                a: "YAHSHUA One is the only platform where HR data, payroll computation, accounting entries, and BIR compliance share the same record. Other platforms cover one or two of these — you're still reconciling between them at month-end. YAHSHUA One removes the reconciliation entirely.",
              },
              {
                q: "Is it really built for the Philippines, or just localized?",
                a: "Built from the ground up — not localized. SSS, PhilHealth, and Pag-IBIG tables are in the core schema, not a plugin. BIR forms are generated natively. Leave policies follow the Philippine Labor Code. The system speaks peso, understands TRAIN Law tax brackets, and knows the difference between a 13th month computation and a Christmas bonus. None of that was configured in — it was built in.",
              },
              {
                q: "Does it handle BIR compliance and tax filings?",
                a: "Yes. 1601-C, 2550M, quarterly returns — drafted from your payroll data, reviewed in YAHSHUA, and filed on schedule. Contribution tables update automatically when BIR or government agencies issue new circulars. You get deadline alerts weeks ahead, not days.",
              },
              {
                q: "What happens to my data if I stop using YAHSHUA One?",
                a: "It's your data. You can export everything — employee records, payroll history, accounting entries — at any time, in standard formats. We don't lock you in.",
              },
              {
                q: "Who is YAHSHUA One designed for?",
                a: "Filipino business owners, HR officers, accountants, and finance managers at companies between 10 and 500 employees who are currently running their back office on a combination of tools that don't talk to each other.",
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
                Built for Filipino businesses. By Filipino builders.
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
    </div>
  );
}
