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
  const base = direction === "left" ? "reveal-left" : direction === "right" ? "reveal-right" :
    direction === "scale" ? "reveal-scale" : direction === "clip" ? "reveal-clip" : "reveal";
  return (
    <div ref={ref} className={`${base}${visible ? " visible" : ""}${className ? " " + className : ""}`}
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

/* ── Animated stat counter ── */
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
   PAYSLIP MOCKUP (used in Payroll Run tab)
══════════════════════════════════════════════════════════ */
function PayslipMockup() {
  const deductions = [
    { label: "SSS",             amt: "₱ 1,125.00" },
    { label: "PhilHealth",      amt: "₱ 450.00"   },
    { label: "Pag-IBIG",        amt: "₱ 200.00"   },
    { label: "Withholding Tax", amt: "₱ 3,210.00" },
  ];
  const earnings = [
    { label: "Basic Pay",  amt: "₱ 32,000.00" },
    { label: "Overtime",   amt: "₱ 2,400.00"  },
    { label: "Night Diff", amt: "₱ 1,200.00"  },
    { label: "Allowances", amt: "₱ 4,000.00"  },
  ];
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--line-2)", borderRadius: 16, overflow: "hidden", boxShadow: "var(--shadow-lg)" }}>
      <div style={{ background: "var(--ink)", padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, var(--accent), var(--accent-2))", display: "grid", placeItems: "center", color: "#0a1418", fontWeight: 700, fontSize: 12 }}>Y1</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>YAHSHUA One · Payslip</div>
            <div style={{ color: "oklch(0.6 0.01 250)", fontSize: 11, fontFamily: "var(--font-geist-mono, monospace)" }}>June 15, 2026 cutoff</div>
          </div>
        </div>
        <div style={{ fontSize: 10, fontFamily: "var(--font-geist-mono, monospace)", letterSpacing: "0.08em", textTransform: "uppercase", background: "var(--accent)", color: "#0a1418", padding: "3px 8px", borderRadius: 999, fontWeight: 600 }}>AI-generated</div>
      </div>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--line-2)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-tint)" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Lara Pacheco</div>
          <div style={{ fontSize: 12, color: "var(--soft)", fontFamily: "var(--font-geist-mono, monospace)" }}>EMP-2024-0041 · Senior Accountant · Full-time</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "var(--soft)", fontFamily: "var(--font-geist-mono, monospace)" }}>Period</div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Jun 1–15, 2026</div>
        </div>
      </div>
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
      <div style={{ padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--accent-50)" }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--soft)", fontFamily: "var(--font-geist-mono, monospace)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Net Pay</div>
          <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--accent-2)" }}>₱ 34,615.00</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
          <div style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, background: "var(--accent)", color: "#0a1418", fontFamily: "var(--font-geist-mono, monospace)", fontWeight: 600, letterSpacing: "0.04em" }}>APPROVED</div>
          <div style={{ fontSize: 11, color: "var(--soft)" }}>Disbursement: Jun 15, 2026</div>
        </div>
      </div>
      <div style={{ padding: "12px 24px", borderTop: "1px solid var(--line-2)", display: "flex", gap: 8 }}>
        {["Send to employee", "Export PDF", "Bank file"].map((label) => (
          <div key={label} style={{ fontSize: 11.5, padding: "5px 10px", borderRadius: 6, border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink-2)", cursor: "default" }}>{label}</div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   APP DASHBOARD — hero right panel
══════════════════════════════════════════════════════════ */
function AppDashboard() {
  return (
    <div style={{
      background: "var(--ink)", borderRadius: 18, overflow: "hidden",
      boxShadow: "var(--shadow-lg), 0 40px 100px oklch(0.18 0.05 215 / 0.4)",
      border: "1px solid oklch(0.22 0.012 250)",
    }}>
      {/* Window chrome */}
      <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, background: "oklch(0.13 0.012 250)", borderBottom: "1px solid oklch(0.2 0.012 250)" }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["oklch(0.55 0.18 25)", "oklch(0.7 0.16 70)", "oklch(0.6 0.18 145)"].map((bg, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: bg }} />
          ))}
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "oklch(0.18 0.012 250)", border: "1px solid oklch(0.24 0.012 250)", borderRadius: 6, padding: "3px 12px" }}>
            <span style={{ fontSize: 11, color: "oklch(0.42 0.01 250)", fontFamily: "var(--font-geist-mono, monospace)" }}>app.yahshua.one</span>
          </div>
        </div>
      </div>

      {/* App shell */}
      <div style={{ display: "flex", height: 408 }}>
        {/* Sidebar */}
        <div style={{ width: 172, borderRight: "1px solid oklch(0.19 0.012 250)", padding: "14px 10px", display: "flex", flexDirection: "column", gap: 2, background: "oklch(0.145 0.012 250)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px", marginBottom: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg, var(--accent), var(--accent-2))", display: "grid", placeItems: "center", color: "#0a1418", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>Y1</div>
            <span style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>Payroll</span>
          </div>
          {[
            { label: "Employees", active: false },
            { label: "Payroll", active: true },
            { label: "Reports", active: false },
            { label: "Settings", active: false },
          ].map((item) => (
            <div key={item.label} style={{
              padding: "8px 10px", borderRadius: 8, cursor: "default",
              background: item.active ? "oklch(0.74 0.12 215 / 0.14)" : "transparent",
              border: `1px solid ${item.active ? "oklch(0.74 0.12 215 / 0.28)" : "transparent"}`,
            }}>
              <span style={{ fontSize: 12.5, color: item.active ? "var(--accent-3)" : "oklch(0.48 0.01 250)", fontWeight: item.active ? 500 : 400 }}>{item.label}</span>
            </div>
          ))}
          {/* Theo button */}
          <div style={{ marginTop: "auto" }}>
            <div style={{ padding: "10px 10px", borderRadius: 10, background: "linear-gradient(135deg, oklch(0.55 0.15 280 / 0.18), oklch(0.55 0.12 215 / 0.18))", border: "1px solid oklch(0.55 0.15 280 / 0.3)", cursor: "default" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 18, height: 18, borderRadius: 5, background: "linear-gradient(135deg, oklch(0.7 0.18 280), oklch(0.74 0.12 215))", flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "oklch(0.72 0.06 215)", fontWeight: 500 }}>Ask Theo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Top bar */}
          <div style={{ padding: "10px 16px", borderBottom: "1px solid oklch(0.19 0.012 250)", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, background: "oklch(0.18 0.012 250)", border: "1px solid oklch(0.25 0.012 250)", borderRadius: 8, padding: "7px 12px", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: "linear-gradient(135deg, oklch(0.65 0.18 280), oklch(0.74 0.12 215), oklch(0.7 0.15 160))", flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "oklch(0.36 0.01 250)" }}>Ask Theo or search...  ⌘/</span>
            </div>
            <span style={{ fontSize: 11, color: "oklch(0.38 0.01 250)", fontFamily: "var(--font-geist-mono, monospace)", whiteSpace: "nowrap" }}>Jun 30, 2026</span>
          </div>

          {/* Content */}
          <div style={{ flex: 1, padding: "16px", overflow: "hidden" }}>
            <div style={{ marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Payroll Run</div>
                <div style={{ color: "oklch(0.42 0.01 250)", fontSize: 11, fontFamily: "var(--font-geist-mono, monospace)" }}>Jun 1–15, 2026 · Semi-monthly</div>
              </div>
              <div style={{ fontSize: 11, padding: "5px 12px", borderRadius: 999, background: "var(--accent)", color: "#0a1418", fontWeight: 600, cursor: "default" }}>Approve all</div>
            </div>

            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 72px", padding: "6px 10px", background: "oklch(0.18 0.012 250)", borderRadius: 7, marginBottom: 3 }}>
              {["Employee", "Earnings", "Net Pay", ""].map((h) => (
                <span key={h} style={{ fontSize: 10, color: "oklch(0.42 0.01 250)", fontFamily: "var(--font-geist-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</span>
              ))}
            </div>

            {/* Rows */}
            {[
              { name: "Ana Reyes",    earn: "₱ 39,600", net: "₱ 34,615", ok: true  },
              { name: "Carlo Medina", earn: "₱ 42,000", net: "₱ 36,830", ok: true  },
              { name: "Lara Pacheco", earn: "₱ 39,600", net: "₱ 34,200", ok: false },
            ].map((r) => (
              <div key={r.name} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 72px", padding: "9px 10px", borderBottom: "1px solid oklch(0.18 0.012 250)", alignItems: "center" }}>
                <span style={{ fontSize: 12.5, color: "#fff", fontWeight: 500 }}>{r.name}</span>
                <span style={{ fontSize: 12, color: "oklch(0.72 0.01 250)", fontFamily: "var(--font-geist-mono, monospace)" }}>{r.earn}</span>
                <span style={{ fontSize: 12, color: "var(--accent-3)", fontFamily: "var(--font-geist-mono, monospace)", fontWeight: 500 }}>{r.net}</span>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 999, background: r.ok ? "oklch(0.22 0.06 145)" : "oklch(0.22 0.06 70)", color: r.ok ? "oklch(0.72 0.12 145)" : "oklch(0.72 0.12 70)", fontFamily: "var(--font-geist-mono, monospace)" }}>
                    {r.ok ? "✓ done" : "review"}
                  </span>
                </div>
              </div>
            ))}

            {/* Total */}
            <div style={{ marginTop: 10, padding: "10px 10px", background: "oklch(0.16 0.012 250)", borderRadius: 9, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "oklch(0.42 0.01 250)" }}>Total net payroll · 3 employees</span>
              <span style={{ fontSize: 17, fontWeight: 600, color: "var(--accent-3)", fontFamily: "var(--font-geist-mono, monospace)", letterSpacing: "-0.02em" }}>₱ 105,645</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   THEO CONVERSATION (bento card + full tab)
══════════════════════════════════════════════════════════ */
function TheoConversation({ compact = false }: { compact?: boolean }) {
  const fs = compact ? 12.5 : 13.5;
  return (
    <div style={{ padding: compact ? "20px 22px 16px" : "20px 22px 18px", display: "flex", flexDirection: "column", gap: 14, height: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: compact ? 22 : 28, height: compact ? 22 : 28, borderRadius: 7, flexShrink: 0, background: "linear-gradient(135deg, oklch(0.65 0.18 280), oklch(0.74 0.12 215), oklch(0.7 0.15 160))" }} />
        <span style={{ fontSize: compact ? 11.5 : 13, color: "var(--accent-3)", fontWeight: 500 }}>Theo AI</span>
      </div>

      {/* User message */}
      <div style={{ alignSelf: "flex-end", background: "oklch(0.22 0.012 250)", padding: compact ? "8px 12px" : "10px 14px", borderRadius: "12px 12px 3px 12px", maxWidth: "80%" }}>
        <p style={{ fontSize: fs, color: "oklch(0.82 0.01 250)", margin: 0, lineHeight: 1.45 }}>
          What&apos;s our meal allowance setup? Does it count against our de minimis cap?
        </p>
      </div>

      {/* Theo answer */}
      <div style={{ background: "oklch(0.17 0.012 250)", border: "1px solid oklch(0.24 0.012 250)", padding: compact ? "9px 12px" : "11px 14px", borderRadius: "3px 12px 12px 12px", maxWidth: "92%" }}>
        <p style={{ fontSize: fs, color: "oklch(0.82 0.01 250)", margin: "0 0 6px", lineHeight: 1.5 }}>
          Meal allowance is set at <strong style={{ color: "var(--accent-3)", fontWeight: 600 }}>₱2,000/month</strong> (₱91.37/day avg). BIR de minimis cap is ₱90/day.
        </p>
        <p style={{ fontSize: compact ? 11.5 : 13, color: "oklch(0.58 0.01 250)", margin: 0, lineHeight: 1.5 }}>
          You&apos;re ₱1.37/day over the exemption. That excess becomes taxable per employee. Want me to update the setting?
        </p>
        {!compact && (
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 12 }}>
            {["Update to ₱90/day", "Show affected employees", "Explain de minimis rules"].map((action) => (
              <div key={action} style={{ fontSize: 11.5, padding: "5px 10px", borderRadius: 999, border: "1px solid oklch(0.74 0.12 215 / 0.4)", color: "var(--accent-3)", cursor: "default" }}>{action}</div>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 8, background: "oklch(0.17 0.012 250)", border: "1px solid oklch(0.25 0.012 250)", borderRadius: 10, padding: compact ? "7px 11px" : "9px 13px" }}>
        <span style={{ flex: 1, fontSize: compact ? 12 : 13, color: "oklch(0.3 0.01 250)" }}>Ask Theo...</span>
        <div style={{ width: compact ? 20 : 26, height: compact ? 20 : 26, borderRadius: 6, background: "var(--accent)", display: "grid", placeItems: "center", flexShrink: 0 }}>
          <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="#0a1418" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB MOCKUPS
══════════════════════════════════════════════════════════ */

function ReportsTabMockup() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const vals   = [52000, 48000, 61000, 55000, 58000, 63500];
  const max    = Math.max(...vals);
  return (
    <div style={{ background: "var(--surface)", borderRadius: 16, overflow: "hidden", boxShadow: "var(--shadow-lg)", border: "1px solid var(--line)" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--line-2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Government Contributions</div>
          <div style={{ fontSize: 11, color: "var(--soft)", fontFamily: "var(--font-geist-mono, monospace)" }}>Custom report · Generated by Theo AI</div>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: "var(--accent-50)", border: "1px solid oklch(0.88 0.06 215)" }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: "linear-gradient(135deg, oklch(0.65 0.18 280), oklch(0.74 0.12 215))" }} />
          <span style={{ fontSize: 11, color: "var(--accent-2)", fontWeight: 500 }}>AI Report</span>
        </div>
      </div>
      <div style={{ padding: "20px 20px 14px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 90 }}>
          {months.map((m, i) => (
            <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: "100%", borderRadius: 5, height: `${(vals[i] / max) * 72}px`, background: i === 5 ? "var(--accent-2)" : "var(--bg-tint)", border: i === 5 ? "none" : "1px solid var(--line)" }} />
              <span style={{ fontSize: 9, color: "var(--soft)", fontFamily: "var(--font-geist-mono, monospace)" }}>{m}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop: "1px solid var(--line-2)" }}>
        {[
          { agency: "SSS",        total: "₱ 42,000", trend: "+3.2%" },
          { agency: "PhilHealth", total: "₱ 10,500", trend: "+0.0%" },
          { agency: "Pag-IBIG",   total: "₱ 6,000",  trend: "+0.0%" },
        ].map((row, i) => (
          <div key={row.agency} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", borderBottom: i < 2 ? "1px solid var(--line-2)" : "none" }}>
            <span style={{ fontSize: 13, color: "var(--ink-2)" }}>{row.agency}</span>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "oklch(0.55 0.12 145)", fontFamily: "var(--font-geist-mono, monospace)" }}>{row.trend}</span>
              <span style={{ fontSize: 13, fontWeight: 500, fontFamily: "var(--font-geist-mono, monospace)" }}>{row.total}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PolicyTabMockup() {
  return (
    <div style={{ background: "var(--surface)", borderRadius: 16, overflow: "hidden", boxShadow: "var(--shadow-lg)", border: "1px solid var(--line)" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--line-2)", background: "var(--bg-tint)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Policy Handbook</div>
          <div style={{ fontSize: 11, color: "var(--soft)", fontFamily: "var(--font-geist-mono, monospace)" }}>Auto-generated · Last updated today</div>
        </div>
        <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 999, background: "var(--accent-50)", color: "var(--accent-2)", border: "1px solid oklch(0.88 0.06 215)" }}>Live</span>
      </div>
      <div style={{ padding: "16px 20px 8px" }}>
        {[
          {
            section: "Pay Components",
            entries: [
              { label: "Basic Pay",       val: "Daily rate × working days in period" },
              { label: "Overtime Pay",    val: "125% on regular days, 130% on rest days (DOLE)" },
              { label: "Night Differential", val: "10% of basic hourly rate (10 PM to 6 AM)" },
            ],
          },
          {
            section: "Allowances",
            entries: [
              { label: "Meal Allowance",     val: "₱2,000/month · de minimis treatment" },
              { label: "Transportation",     val: "₱1,500/month · de minimis treatment" },
            ],
          },
        ].map((sec) => (
          <div key={sec.section} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: "var(--soft)", fontFamily: "var(--font-geist-mono, monospace)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{sec.section}</div>
            {sec.entries.map((e) => (
              <div key={e.label} style={{ padding: "8px 0", borderBottom: "1px solid var(--line-2)", display: "flex", gap: 12 }}>
                <span style={{ fontSize: 12.5, color: "var(--ink)", fontWeight: 500, flexShrink: 0, width: 130 }}>{e.label}</span>
                <span style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.4 }}>{e.val}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ margin: "0 20px 16px", padding: "10px 12px", background: "var(--accent-50)", borderRadius: 8, border: "1px solid oklch(0.88 0.06 215)", display: "flex", gap: 8, alignItems: "center" }}>
        <Check size={13} />
        <span style={{ fontSize: 11.5, color: "var(--accent-2)" }}>Updates automatically when your settings change</span>
      </div>
    </div>
  );
}

function OrgChartTabMockup() {
  return (
    <div style={{ background: "var(--surface)", borderRadius: 16, overflow: "hidden", boxShadow: "var(--shadow-lg)", border: "1px solid var(--line)" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--line-2)" }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>Organizational Chart</div>
        <div style={{ fontSize: 11, color: "var(--soft)", fontFamily: "var(--font-geist-mono, monospace)" }}>4 departments · 12 employees</div>
      </div>
      <div style={{ padding: "24px 20px", overflowX: "auto" }}>
        <svg width="100%" height="180" viewBox="0 0 600 175" fill="none" style={{ minWidth: 320 }}>
          <line x1="300" y1="46" x2="300" y2="63" stroke="var(--line)" strokeWidth="1.5"/>
          <line x1="150" y1="63" x2="450" y2="63" stroke="var(--line)" strokeWidth="1.5"/>
          <line x1="150" y1="63" x2="150" y2="80" stroke="var(--line)" strokeWidth="1.5"/>
          <line x1="450" y1="63" x2="450" y2="80" stroke="var(--line)" strokeWidth="1.5"/>
          <line x1="150" y1="116" x2="150" y2="130" stroke="var(--line-2)" strokeWidth="1.2"/>
          <line x1="90"  y1="130" x2="210" y2="130" stroke="var(--line-2)" strokeWidth="1.2"/>
          <line x1="90"  y1="130" x2="90"  y2="140" stroke="var(--line-2)" strokeWidth="1.2"/>
          <line x1="210" y1="130" x2="210" y2="140" stroke="var(--line-2)" strokeWidth="1.2"/>
          <line x1="450" y1="116" x2="450" y2="130" stroke="var(--line-2)" strokeWidth="1.2"/>
          <line x1="390" y1="130" x2="510" y2="130" stroke="var(--line-2)" strokeWidth="1.2"/>
          <line x1="390" y1="130" x2="390" y2="140" stroke="var(--line-2)" strokeWidth="1.2"/>
          <line x1="510" y1="130" x2="510" y2="140" stroke="var(--line-2)" strokeWidth="1.2"/>
          <rect x="222" y="10" width="156" height="36" rx="9" fill="var(--ink)"/>
          <text x="300" y="32" textAnchor="middle" fill="var(--accent-3)" fontSize="12" fontWeight="600" fontFamily="sans-serif">YAHSHUA Corp</text>
          <rect x="90"  y="80" width="120" height="36" rx="7" fill="var(--surface)" stroke="var(--line)" strokeWidth="1"/>
          <text x="150" y="102" textAnchor="middle" fill="var(--ink-2)" fontSize="12" fontFamily="sans-serif">Operations</text>
          <rect x="390" y="80" width="120" height="36" rx="7" fill="var(--surface)" stroke="var(--line)" strokeWidth="1"/>
          <text x="450" y="102" textAnchor="middle" fill="var(--ink-2)" fontSize="12" fontFamily="sans-serif">Finance</text>
          {[
            { x: 50,  label: "Ana R."   },
            { x: 170, label: "Carlo M." },
            { x: 350, label: "Lara P."  },
            { x: 470, label: "Mark L."  },
          ].map(({ x, label }) => (
            <g key={label}>
              <rect x={x} y={140} width={80} height={26} rx="6" fill="var(--bg-tint)" stroke="var(--line-2)" strokeWidth="1"/>
              <text x={x + 40} y={157} textAnchor="middle" fill="var(--muted)" fontSize="11" fontFamily="sans-serif">{label}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
const TAB_DATA = [
  {
    label: "Payroll Run",
    title: "Full payroll, every cutoff, automatically.",
    body: "Your payroll runs automatically on cutoff day. Basic pay, overtime, night differential, 13th month, and all statutory deductions, computed for every employee. You review and approve.",
    bullets: ["Payslip per employee", "Bank disbursement file", "1-click approval", "Full audit trail"],
  },
  {
    label: "Theo AI",
    title: "Ask anything. Theo knows your company.",
    body: "Theo is an AI assistant that reads your actual payroll data. Ask about your allowance setup, your de minimis cap, or how a specific employee's net pay was computed. Theo can also take action for you, within your account's permissions.",
    bullets: ["Reads your actual data", "Answers compliance questions", "Acts within your permissions", "Global search across modules"],
  },
  {
    label: "Custom Reports",
    title: "Standard reports included. Need more? Just ask.",
    body: "YAHSHUA Payroll comes with standard reports built in. For anything else, describe what you need and AI generates it from your company's own data. All reports are permission-aware.",
    bullets: ["Government contribution summaries", "Headcount and cost reports", "AI-generated on demand", "Permission-aware output"],
  },
  {
    label: "Policy Handbook",
    title: "Your settings become your policy manual.",
    body: "The Policy Handbook turns every setting in YAHSHUA Payroll into a readable document automatically. No manual writing. When your settings change, the handbook updates on its own.",
    bullets: ["Auto-generated from settings", "Zero maintenance", "Updates when settings change", "HR-ready format"],
  },
  {
    label: "Org Chart",
    title: "Set up your structure. View your org chart.",
    body: "Define your departments, divisions, sections, units, and locations inside YAHSHUA Payroll. The organizational chart builds itself from that data. Highly requested by YAHSHUA users.",
    bullets: ["Departments and divisions", "Sections, units, locations", "Visual org chart", "Updates automatically"],
  },
] as const;

export default function PayrollPage() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [displayTab, setDisplayTab] = useState(0);
  const [tabFading, setTabFading] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 8);
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const btn = tabRefs.current[activeTab];
    if (btn) setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [activeTab]);

  const switchTab = (idx: number) => {
    if (idx === displayTab) return;
    setTabFading(true);
    setTimeout(() => { setDisplayTab(idx); setActiveTab(idx); setTabFading(false); }, 180);
  };

  const btnBase: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 8, height: 44, padding: "0 18px", borderRadius: 999, border: "1px solid transparent", fontWeight: 500, fontSize: 14.5, cursor: "pointer", textDecoration: "none", transition: "background .2s ease, border-color .2s ease, box-shadow .2s ease", fontFamily: "inherit" };
  const btnPrimary: React.CSSProperties = { ...btnBase, background: "var(--ink)", color: "#fff", borderColor: "var(--ink)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 2px rgba(15,17,21,0.18)" };
  const btnGhost: React.CSSProperties = { ...btnBase, background: "transparent", color: "var(--ink)", borderColor: "var(--line)" };
  const btnSm: React.CSSProperties = { height: 36, padding: "0 14px", fontSize: 13.5 };

  return (
    <div style={{ background: "var(--bg)", color: "var(--ink)", minHeight: "100vh" }}>

      {/* ── NAV ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(14px)", background: "color-mix(in oklab, var(--bg) 78%, transparent)", borderBottom: navScrolled ? "1px solid var(--line)" : "1px solid transparent", transition: "border-color .2s ease" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
            <a href="/" style={{ display: "flex", alignItems: "center", gap: 10 }} aria-label="YAHSHUA One home">
              <Image src="/logo.jpg" alt="YAHSHUA One" width={28} height={28} style={{ borderRadius: 8, objectFit: "cover", flexShrink: 0 }} priority />
              <span style={{ fontWeight: 600, letterSpacing: "-0.02em", fontSize: 16 }}>YAHSHUA <span style={{ color: "var(--muted)", fontWeight: 400 }}>One</span></span>
              <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "var(--accent-50)", color: "var(--accent-2)", fontFamily: "var(--font-geist-mono, monospace)", letterSpacing: "0.04em", fontWeight: 500, marginLeft: 2 }}>Payroll</span>
            </a>
            <nav className="nav-links" aria-label="Primary">
              {[
                { label: "Features",      href: "#features"      },
                { label: "Compliance",    href: "#compliance"    },
                { label: "How it works",  href: "#how-it-works"  },
                { label: "FAQ",           href: "#faq"           },
                { label: "← All modules", href: "/#modules"      },
              ].map((link) => (
                <a key={link.label} href={link.href} style={{ padding: "8px 12px", borderRadius: 8, fontSize: 14, color: "var(--ink-2)", transition: "background .15s ease" }}
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
                ? <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                : <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 6H17M3 10H17M3 14H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              }
            </button>
          </div>
          <div className={`mobile-menu${mobileNavOpen ? " open" : ""}`}>
            {[
              { label: "Features",      href: "#features"      },
              { label: "Compliance",    href: "#compliance"    },
              { label: "How it works",  href: "#how-it-works"  },
              { label: "FAQ",           href: "#faq"           },
              { label: "← All modules", href: "/#modules"      },
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
      <header style={{ padding: "80px 0 64px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -200, left: "50%", transform: "translateX(-50%)", width: 1100, height: 700, pointerEvents: "none", zIndex: 0, filter: "blur(20px)", background: "radial-gradient(45% 55% at 50% 30%, var(--accent-glow), transparent 70%), radial-gradient(35% 45% at 30% 50%, oklch(0.9 0.06 215 / 0.4), transparent 70%)" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px", position: "relative", zIndex: 1 }}>
          <div className="grid-2col-hero">
            {/* Left */}
            <div>
              <Reveal delay={60} direction="clip">
                <h1 style={{ margin: "0 0 20px", fontSize: "clamp(48px, 7.5vw, 92px)", lineHeight: 1.0, letterSpacing: "-0.04em", fontWeight: 300, color: "var(--ink)", textWrap: "balance" as React.CSSProperties["textWrap"] }}>
                  Payroll that{" "}
                  <em style={{ fontStyle: "normal", color: "var(--accent-2)", fontWeight: 800 }}>runs itself.</em>
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p style={{ fontSize: 19, lineHeight: 1.6, color: "var(--ink-2)", maxWidth: 520, margin: "0 0 32px" }}>
                  Your payroll runs automatically every cutoff. Statutory contributions, withholding tax, overtime, night differential, and 13th month, all computed for you. On cutoff day, just review and approve. And if you have any questions about your setup, you can just ask Theo. It reads your actual company data and gives you the answer.
                </p>
              </Reveal>
              <Reveal delay={180}>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
                  <a href="#waitlist" style={btnPrimary}>Start free for 30 days <Arrow /></a>
                  <a href="#how-it-works" style={btnGhost}>See how it works</a>
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
            {/* Right: App dashboard */}
            <Reveal direction="left" delay={100}>
              <AppDashboard />
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
            <AnimatedStat from={0} to={99.97} format={(v) => (v >= 99.9 ? v.toFixed(2) : Math.round(v).toString()) + "%"} delay={80} lbl="BIR filing accuracy on 1601-C, 2550M, quarterly returns" />
            <AnimatedStat from={4800} to={0} format={(v) => "₱ " + (Math.round(v) >= 1000 ? Math.round(v).toLocaleString("en-US") : Math.round(v).toString())} delay={120} lbl="Penalty exposure when deadlines are managed by YAHSHUA" />
          </div>
        </div>
      </section>

      {/* ── BENTO FEATURES ── */}
      <section id="features" style={{ padding: "110px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div style={{ maxWidth: 680, marginBottom: 48 }}>
              <h2 style={{ margin: "0 0 14px", fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-0.035em", fontWeight: 600, lineHeight: 1.05 }}>
                Everything your payroll needs. Nothing more.
              </h2>
              <p style={{ margin: 0, fontSize: 18, color: "var(--muted)", maxWidth: 560 }}>
                From timekeeping to bank disbursement, every step of your payroll cycle is handled automatically, accurately, and on time.
              </p>
            </div>
          </Reveal>

          <div className="bento-grid">

            {/* Theo AI — wide */}
            <Reveal className="bento-theo">
              <div style={{ background: "var(--ink)", borderRadius: "var(--radius-lg)", border: "1px solid oklch(0.22 0.012 250)", overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "20px 22px 0" }}>
                  <div style={{ fontSize: 11, color: "oklch(0.42 0.01 250)", fontFamily: "var(--font-geist-mono, monospace)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>01</div>
                  <h3 style={{ fontSize: "clamp(16px, 1.6vw, 20px)", fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 4px", color: "#fff" }}>Theo AI, your payroll intelligence layer</h3>
                  <p style={{ fontSize: 13, color: "oklch(0.55 0.01 250)", margin: 0, lineHeight: 1.5 }}>Ask anything in plain language. Theo reads your actual company data and answers from it.</p>
                </div>
                <TheoConversation compact />
              </div>
            </Reveal>

            {/* Policy Handbook */}
            <Reveal delay={40} className="bento-handbook">
              <div style={{ background: "var(--surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--line)", overflow: "hidden", height: "100%" }}>
                <div style={{ padding: "20px 22px 14px" }}>
                  <div style={{ fontSize: 11, color: "var(--soft)", fontFamily: "var(--font-geist-mono, monospace)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>02</div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 4px" }}>Policy Handbook</h3>
                  <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 16px", lineHeight: 1.5 }}>Auto-generated from your settings. No manual writing.</p>
                  {[
                    { label: "Meal Allowance", val: "₱2,000/month · de minimis", tag: "Non-taxable" },
                    { label: "OT Rate",        val: "125% regular · 130% rest",  tag: "DOLE"       },
                    { label: "Cutoffs",        val: "15th and last day of month", tag: "Semi-monthly"},
                  ].map((item, i) => (
                    <div key={i} style={{ paddingBottom: i < 2 ? 10 : 0, marginBottom: i < 2 ? 10 : 0, borderBottom: i < 2 ? "1px solid var(--line-2)" : "none" }}>
                      <div style={{ fontSize: 10, color: "var(--soft)", fontFamily: "var(--font-geist-mono, monospace)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 2 }}>{item.label}</div>
                      <div style={{ fontSize: 13, color: "var(--ink)", marginBottom: 4 }}>{item.val}</div>
                      <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, background: "var(--accent-50)", color: "var(--accent-2)", fontFamily: "var(--font-geist-mono, monospace)" }}>{item.tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Auto Computation */}
            <Reveal delay={60} className="bento-compute">
              <div style={{ background: "var(--bg-tint)", borderRadius: "var(--radius-lg)", border: "1px solid var(--line)", overflow: "hidden", height: "100%" }}>
                <div style={{ padding: "20px 22px" }}>
                  <div style={{ fontSize: 11, color: "var(--soft)", fontFamily: "var(--font-geist-mono, monospace)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>03</div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 16px" }}>Automatic computation</h3>
                  <div style={{ fontSize: 10, color: "var(--soft)", fontFamily: "var(--font-geist-mono, monospace)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Ana Reyes · Jun 1–15</div>
                  {[
                    { label: "Basic Pay",    amt: "₱ 32,000", type: "earn"   },
                    { label: "Overtime",     amt: "+ ₱ 2,400", type: "earn"   },
                    { label: "Night Diff",   amt: "+ ₱ 1,200", type: "earn"   },
                    { label: "SSS",          amt: "− ₱ 1,125", type: "deduct" },
                    { label: "PhilHealth",   amt: "− ₱ 450",  type: "deduct" },
                    { label: "W/Tax (BIR)",  amt: "− ₱ 3,210", type: "deduct" },
                  ].map((row) => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px dashed var(--line-2)" }}>
                      <span style={{ fontSize: 12, color: "var(--muted)" }}>{row.label}</span>
                      <span style={{ fontSize: 12, fontFamily: "var(--font-geist-mono, monospace)", fontVariantNumeric: "tabular-nums", color: row.type === "deduct" ? "#B45B4E" : "var(--ink)" }}>{row.amt}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 8, borderTop: "2px solid var(--line)" }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Net Pay</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "var(--accent-2)", fontFamily: "var(--font-geist-mono, monospace)" }}>₱ 30,815</span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Custom Formulas — dark */}
            <Reveal delay={80} className="bento-formulas">
              <div style={{ background: "var(--ink)", borderRadius: "var(--radius-lg)", border: "1px solid oklch(0.22 0.012 250)", overflow: "hidden", height: "100%" }}>
                <div style={{ padding: "20px 22px" }}>
                  <div style={{ fontSize: 11, color: "oklch(0.42 0.01 250)", fontFamily: "var(--font-geist-mono, monospace)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>04</div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 4px", color: "#fff" }}>Custom formulas and payroll flows</h3>
                  <p style={{ fontSize: 12.5, color: "oklch(0.48 0.01 250)", margin: "0 0 16px", lineHeight: 1.5 }}>Excel-like editor. Ask Theo to write them for you.</p>
                  {[
                    { name: "basic_pay",  expr: "daily_rate × days_worked"       },
                    { name: "ot_pay",     expr: "(daily_rate ÷ 8) × 1.25 × hrs"  },
                    { name: "night_diff", expr: "earnings × 0.10"                 },
                  ].map((f) => (
                    <div key={f.name} style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 11, color: "var(--accent-3)", fontFamily: "var(--font-geist-mono, monospace)", marginBottom: 3 }}>{f.name}</div>
                      <div style={{ fontSize: 11, color: "oklch(0.5 0.01 250)", fontFamily: "var(--font-geist-mono, monospace)", padding: "5px 9px", background: "oklch(0.16 0.012 250)", borderRadius: 6, border: "1px solid oklch(0.22 0.012 250)" }}>← {f.expr}</div>
                    </div>
                  ))}
                  <div style={{ marginTop: 12, padding: "8px 10px", background: "oklch(0.74 0.12 215 / 0.1)", borderRadius: 8, border: "1px solid oklch(0.74 0.12 215 / 0.22)" }}>
                    <span style={{ fontSize: 11.5, color: "var(--accent-3)" }}>Ask Theo to write formulas for you</span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Custom Reports — tall */}
            <Reveal delay={40} className="bento-reports">
              <div style={{ background: "var(--surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--line)", overflow: "hidden", height: "100%" }}>
                <div style={{ padding: "20px 22px" }}>
                  <div style={{ fontSize: 11, color: "var(--soft)", fontFamily: "var(--font-geist-mono, monospace)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>05</div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 4px" }}>Custom reports via AI</h3>
                  <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "0 0 18px", lineHeight: 1.5 }}>Describe it. AI generates it from your data.</p>
                  <div style={{ fontSize: 10, color: "var(--soft)", fontFamily: "var(--font-geist-mono, monospace)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Gov&apos;t Contributions · June 2026</div>
                  {[
                    { label: "SSS",        pct: 62, color: "#5B8EE8", ee: "₱900",   er: "₱1,900" },
                    { label: "PhilHealth", pct: 25, color: "#5BAF8E", ee: "₱350",   er: "₱350"   },
                    { label: "Pag-IBIG",   pct: 14, color: "#E8965B", ee: "₱200",   er: "₱200"   },
                    { label: "W/Tax (BIR)", pct: 42, color: "#C45BAF", ee: "₱2,400", er: "N/A"    },
                  ].map((row) => (
                    <div key={row.label} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 500, color: row.color }}>{row.label}</span>
                        <div style={{ display: "flex", gap: 10, fontSize: 11, fontFamily: "var(--font-geist-mono, monospace)" }}>
                          <span style={{ color: "var(--muted)" }}>EE {row.ee}</span>
                          <span style={{ color: "var(--soft)" }}>ER {row.er}</span>
                        </div>
                      </div>
                      <div style={{ height: 5, background: "var(--bg-tint)", borderRadius: 99 }}>
                        <div style={{ height: "100%", width: `${row.pct}%`, background: row.color, borderRadius: 99 }} />
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--line-2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "var(--soft)" }}>Total · 3 employees</span>
                    <span style={{ fontSize: 14, fontWeight: 600, fontFamily: "var(--font-geist-mono, monospace)" }}>₱ 15,945</span>
                  </div>
                  <div style={{ marginTop: 12, padding: "8px 10px", background: "var(--accent-50)", borderRadius: 8, border: "1px solid oklch(0.88 0.06 215)", display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 3, background: "linear-gradient(135deg, oklch(0.65 0.18 280), oklch(0.74 0.12 215))", flexShrink: 0 }} />
                    <span style={{ fontSize: 11.5, color: "var(--accent-2)" }}>Generated by Theo AI from your data</span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Org Chart — wide */}
            <Reveal delay={100} className="bento-orgchart">
              <div style={{ background: "var(--bg-tint)", borderRadius: "var(--radius-lg)", border: "1px solid var(--line)", overflow: "hidden", height: "100%" }}>
                <div style={{ padding: "20px 22px 0" }}>
                  <div style={{ fontSize: 11, color: "var(--soft)", fontFamily: "var(--font-geist-mono, monospace)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>06</div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 4px" }}>Organizational chart</h3>
                  <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "0 0 4px", lineHeight: 1.5 }}>Set up departments, divisions, sections, units, and locations. The chart builds itself.</p>
                </div>
                <div style={{ padding: "8px 22px 20px", overflowX: "auto" }}>
                  <svg width="100%" height="150" viewBox="0 0 600 150" fill="none" style={{ minWidth: 280 }}>
                    <line x1="300" y1="40" x2="300" y2="56" stroke="var(--line)" strokeWidth="1.5"/>
                    <line x1="160" y1="56" x2="440" y2="56" stroke="var(--line)" strokeWidth="1.5"/>
                    <line x1="160" y1="56" x2="160" y2="70" stroke="var(--line)" strokeWidth="1.5"/>
                    <line x1="440" y1="56" x2="440" y2="70" stroke="var(--line)" strokeWidth="1.5"/>
                    <line x1="160" y1="102" x2="160" y2="116" stroke="var(--line-2)" strokeWidth="1.2"/>
                    <line x1="100" y1="116" x2="220" y2="116" stroke="var(--line-2)" strokeWidth="1.2"/>
                    <line x1="100" y1="116" x2="100"  y2="124" stroke="var(--line-2)" strokeWidth="1.2"/>
                    <line x1="220" y1="116" x2="220"  y2="124" stroke="var(--line-2)" strokeWidth="1.2"/>
                    <line x1="440" y1="102" x2="440" y2="116" stroke="var(--line-2)" strokeWidth="1.2"/>
                    <line x1="380" y1="116" x2="500" y2="116" stroke="var(--line-2)" strokeWidth="1.2"/>
                    <line x1="380" y1="116" x2="380" y2="124" stroke="var(--line-2)" strokeWidth="1.2"/>
                    <line x1="500" y1="116" x2="500" y2="124" stroke="var(--line-2)" strokeWidth="1.2"/>
                    <rect x="224" y="8" width="152" height="32" rx="8" fill="var(--ink)"/>
                    <text x="300" y="28" textAnchor="middle" fill="var(--accent-3)" fontSize="11.5" fontWeight="600" fontFamily="sans-serif">YAHSHUA Corp</text>
                    <rect x="100" y="70" width="120" height="32" rx="7" fill="var(--surface)" stroke="var(--line)" strokeWidth="1"/>
                    <text x="160" y="90" textAnchor="middle" fill="var(--ink-2)" fontSize="11.5" fontFamily="sans-serif">Operations</text>
                    <rect x="380" y="70" width="120" height="32" rx="7" fill="var(--surface)" stroke="var(--line)" strokeWidth="1"/>
                    <text x="440" y="90" textAnchor="middle" fill="var(--ink-2)" fontSize="11.5" fontFamily="sans-serif">Finance</text>
                    {[{ x: 60, label: "Ana R." }, { x: 180, label: "Carlo M." }, { x: 340, label: "Lara P." }, { x: 460, label: "Mark L." }].map(({ x, label }) => (
                      <g key={label}>
                        <rect x={x} y={124} width={80} height={22} rx="5" fill="var(--surface)" stroke="var(--line-2)" strokeWidth="1"/>
                        <text x={x + 40} y={139} textAnchor="middle" fill="var(--muted)" fontSize="10" fontFamily="sans-serif">{label}</text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ── COMPLIANCE ── */}
      <section id="compliance" style={{ paddingBottom: 110 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div className="grid-ai" style={{ background: "var(--ink)", color: "#F7F6F1", borderRadius: "var(--radius-xl)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(50% 60% at 90% 0%, var(--accent-glow), transparent 60%), radial-gradient(40% 50% at 0% 100%, oklch(0.7 0.12 215 / 0.18), transparent 60%)" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-geist-mono, monospace)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-3)", marginBottom: 14 }}>
                  <Dot /> Philippine Compliance
                </div>
                <h2 style={{ fontSize: "clamp(28px, 3.2vw, 42px)", letterSpacing: "-0.03em", fontWeight: 500, lineHeight: 1.08, margin: "0 0 18px" }}>
                  Every statutory deduction, <em style={{ fontStyle: "normal", color: "var(--accent-3)" }}>auto-computed.</em>
                </h2>
                <p style={{ color: "oklch(0.85 0.01 250)", fontSize: 16, lineHeight: 1.6, margin: "0 0 28px", maxWidth: 440 }}>
                  YAHSHUA One is built around Philippine government agencies from the start. Rates update automatically. No manual table lookups. No calculation errors.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
                  {[{ label: "SSS", color: "#5B8EE8" }, { label: "PhilHealth", color: "#5BAF8E" }, { label: "Pag-IBIG", color: "#E8965B" }, { label: "BIR 1601-C", color: "#C45BAF" }, { label: "DOLE", color: "#8E8EE8" }].map((badge) => (
                    <div key={badge.label} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 999, border: `1px solid ${badge.color}44`, background: `${badge.color}18`, fontSize: 12.5, fontWeight: 500, color: badge.color }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: badge.color, flexShrink: 0 }} />{badge.label}
                    </div>
                  ))}
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 12 }}>
                  {["Contribution tables update automatically when FICA rates change", "Withholding tax computed per TRAIN Law and Revenue Regulations", "13th month auto-computed per DOLE formula, filed on time", "1601-C reports generated monthly, ready for eBIRForms upload"].map((item) => (
                    <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "oklch(0.88 0.01 250)" }}>
                      <span style={{ width: 20, height: 20, borderRadius: 5, background: "oklch(0.25 0.02 250)", color: "var(--accent-3)", display: "grid", placeItems: "center", flexShrink: 0, marginTop: 1 }}>
                        <svg width="11" height="11" viewBox="0 0 11 11"><path d="M2 5.5L4.5 8L9 3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ background: "oklch(0.2 0.012 250)", border: "1px solid oklch(0.28 0.012 250)", borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
                  <div style={{ padding: "14px 18px", borderBottom: "1px solid oklch(0.28 0.012 250)", display: "flex", alignItems: "center", gap: 8 }}>
                    {["oklch(0.5 0.18 25)", "oklch(0.7 0.16 70)", "oklch(0.6 0.18 145)"].map((bg, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: bg }} />)}
                    <span style={{ fontSize: 12, color: "oklch(0.55 0.01 250)", marginLeft: 8, fontFamily: "var(--font-geist-mono, monospace)" }}>Contribution breakdown · June 2026</span>
                  </div>
                  <div style={{ padding: "20px 20px 8px" }}>
                    <div style={{ fontSize: 11, color: "oklch(0.5 0.01 250)", fontFamily: "var(--font-geist-mono, monospace)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Employee: Ria Castro · ₱ 28,000 / mo</div>
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
                    <div style={{ fontSize: 12, padding: "8px 14px", borderRadius: 999, background: "var(--accent)", color: "#0a1418", fontWeight: 600 }}>Auto-remitted →</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── ANIMATED TABS ── */}
      <section id="how-it-works" style={{ padding: "110px 0", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <div style={{ maxWidth: 680, marginBottom: 44 }}>
              <h2 style={{ margin: "0 0 14px", fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-0.035em", fontWeight: 600, lineHeight: 1.05 }}>
                Explore every module.
              </h2>
              <p style={{ margin: 0, fontSize: 17, color: "var(--muted)" }}>
                Everything inside YAHSHUA Payroll, in one place.
              </p>
            </div>
          </Reveal>

          {/* Tab bar */}
          <div className="ftabs-bar" role="tablist" aria-label="Feature modules">
            {TAB_DATA.map((tab, i) => (
              <button
                key={tab.label}
                ref={(el) => { tabRefs.current[i] = el; }}
                role="tab"
                aria-selected={activeTab === i}
                className={`ftab-btn${activeTab === i ? " active" : ""}`}
                onClick={() => switchTab(i)}
              >
                {tab.label}
              </button>
            ))}
            <div className="ftab-indicator" style={{ left: indicator.left, width: indicator.width }} aria-hidden />
          </div>

          {/* Tab content */}
          <div
            style={{ opacity: tabFading ? 0 : 1, transform: tabFading ? "translateY(10px)" : "none", transition: "opacity 0.18s ease, transform 0.18s ease" }}
            role="tabpanel"
          >
            <div className="ftab-content">
              {/* Left: text */}
              <div>
                <h3 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.1, margin: "0 0 16px" }}>
                  {TAB_DATA[displayTab].title}
                </h3>
                <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.65, margin: "0 0 28px", maxWidth: 480 }}>
                  {TAB_DATA[displayTab].body}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {TAB_DATA[displayTab].bullets.map((b) => (
                    <li key={b} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14.5, color: "var(--ink-2)" }}>
                      <span style={{ width: 20, height: 20, borderRadius: 6, background: "var(--accent-50)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                        <Check size={11} />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 36 }}>
                  <a href="#waitlist" style={{ ...btnPrimary }}>Start free <Arrow /></a>
                </div>
              </div>

              {/* Right: mockup */}
              <div>
                {displayTab === 0 && <PayslipMockup />}
                {displayTab === 1 && (
                  <div style={{ background: "var(--ink)", borderRadius: 16, overflow: "hidden", boxShadow: "var(--shadow-lg)", border: "1px solid oklch(0.22 0.012 250)" }}>
                    <div style={{ padding: "14px 18px", borderBottom: "1px solid oklch(0.2 0.012 250)", display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(135deg, oklch(0.65 0.18 280), oklch(0.74 0.12 215), oklch(0.7 0.15 160))", flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 13, color: "#fff", fontWeight: 500 }}>Theo</div>
                        <div style={{ fontSize: 11, color: "oklch(0.45 0.01 250)" }}>Your YAHSHUA Payroll AI</div>
                      </div>
                    </div>
                    <TheoConversation />
                  </div>
                )}
                {displayTab === 2 && <ReportsTabMockup />}
                {displayTab === 3 && <PolicyTabMockup />}
                {displayTab === 4 && <OrgChartTabMockup />}
              </div>
            </div>
          </div>

          {/* AI callout */}
          <Reveal delay={200}>
            <div style={{ marginTop: 48, padding: "18px 28px", borderRadius: "var(--radius-lg)", background: "var(--accent-50)", border: "1px solid oklch(0.88 0.06 215)", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent)", display: "grid", placeItems: "center", color: "#fff", flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L9.5 6.5L14 7.3L10.5 10.5L11.5 15L8 12.7L4.5 15L5.5 10.5L2 7.3L6.5 6.5L8 2Z" fill="currentColor"/></svg>
              </span>
              <div>
                <div style={{ fontWeight: 500, fontSize: 14, color: "var(--accent-2)" }}>Theo AI is always watching</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>Theo flags anomalies before you approve: duplicate entries, rate mismatches, missing timesheets. Ask Theo anything about your setup and it answers from your actual company data, not a manual.</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: "80px 0", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 768, margin: "0 auto", padding: "0 28px" }}>
          <Reveal>
            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", letterSpacing: "-0.025em", fontWeight: 500, margin: "0 0 40px" }}>Payroll questions, answered.</h2>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <FaqItem delay={0} q="Does YAHSHUA One automatically compute SSS, PhilHealth, and Pag-IBIG contributions?" a="Yes. YAHSHUA One computes SSS (employee and employer share), PhilHealth (both shares), and Pag-IBIG (both shares) automatically based on each employee's monthly basic salary. Contribution tables are kept current. When government agencies update their rates, YAHSHUA updates too." />
            <FaqItem delay={40} q="How does YAHSHUA handle withholding tax computation?" a="YAHSHUA uses the BIR's TRAIN Law tax table (RR 11-2018) to compute monthly withholding tax for each employee. It accounts for exemptions, de minimis benefits, and 13th month pay exclusions. The monthly 1601-C report is generated automatically." />
            <FaqItem delay={80} q="Can it handle different pay schedules (semi-monthly, monthly)?" a="Yes. You can set semi-monthly or monthly payroll cutoffs per company or per department. Statutory contributions and tax are apportioned correctly across pay periods." />
            <FaqItem delay={120} q="What happens if an employee is absent or late?" a="Tardiness, undertime, and absences are auto-deducted based on the employee's daily rate and your attendance policy. Absences approved as leave are excluded from deductions." />
            <FaqItem delay={160} q="Does it generate BIR Form 2316 (Certificate of Compensation)?" a="Yes. YAHSHUA generates BIR Form 2316 for each employee at year-end, based on the full-year payroll data. Employees can download it from their self-service portal." />
            <FaqItem delay={200} q="Can YAHSHUA handle the 13th month pay computation?" a="Yes. 13th month pay is computed automatically per DOLE guidelines. It is your total basic pay for the year, divided by 12. The Payroll module generates the disbursement and the required Establishment Report to DOLE." />
          </div>
        </div>
      </section>

      {/* ── CTA / WAITLIST ── */}
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
                <a href="/" style={{ ...btnBase, background: "transparent", color: "#fff", borderColor: "oklch(0.35 0.02 250)" }}>See all modules</a>
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
