"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface Update {
  date: string;
  badge: string;
  title: string;
  description: string;
  body?: string[];
}

function useInView<T extends Element = HTMLDivElement>(threshold = 0.1) {
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

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} className={`reveal${visible ? " visible" : ""}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Badge({ label }: { label: string }) {
  const n = label.toLowerCase();
  let cls = "badge-feature";
  if (n === "launch") cls = "badge-launch";
  else if (n.includes("fix")) cls = "badge-fix";
  else if (n.includes("improve")) cls = "badge-improvement";
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${cls}`} style={{ letterSpacing: "0.02em" }}>
      {label}
    </span>
  );
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch { return dateStr; }
}

export default function UpdatesPage() {
  const [updates, setUpdates] = useState<Update[] | null>(null);

  useEffect(() => {
    fetch("/updates.json").then((r) => r.json()).then(setUpdates).catch(() => setUpdates([]));
  }, []);

  return (
    <div style={{ background: "var(--bg)", color: "var(--ink)", minHeight: "100vh", fontFamily: "var(--font-geist, sans-serif)" }}>

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        backdropFilter: "blur(14px)",
        background: "color-mix(in oklab, var(--bg) 78%, transparent)",
        borderBottom: "1px solid var(--line)",
      }}>
        <div style={{ maxWidth: 768, margin: "0 auto", padding: "0 28px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Image src="/logo.jpg" alt="YAHSHUA One" width={28} height={28} style={{ borderRadius: 8, objectFit: "cover", flexShrink: 0 }} priority />
            <span style={{ fontWeight: 600, letterSpacing: "-0.02em", fontSize: 16 }}>
              YAHSHUA <span style={{ color: "var(--muted)", fontWeight: 400 }}>One</span>
            </span>
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <a href="/" style={{ fontSize: 14, color: "var(--muted)", display: "flex", alignItems: "center", gap: 6 }}>← Back</a>
            <a href="https://app.yahshua.one/" style={{
              fontSize: 13.5, fontWeight: 500, color: "#fff", padding: "8px 16px",
              background: "var(--ink)", borderRadius: 999, border: "none",
            }}>Start free</a>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header style={{ maxWidth: 768, margin: "0 auto", padding: "72px 28px 48px" }}>
        <Reveal>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 12px 5px 8px", border: "1px solid var(--line)", background: "var(--surface)", borderRadius: 999, fontSize: 12, color: "var(--ink-2)", marginBottom: 20 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 0 4px var(--accent-glow)" }} />
            Building in public
          </div>
        </Reveal>
        <Reveal delay={50}>
          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 3.5rem)", letterSpacing: "-0.03em", fontWeight: 500, lineHeight: 1.05, margin: "0 0 16px", color: "var(--ink)" }}>
            What&apos;s New
          </h1>
        </Reveal>
        <Reveal delay={100}>
          <p style={{ fontSize: 18, color: "var(--muted)", lineHeight: 1.6, margin: 0, maxWidth: 520 }}>
            Every update, every milestone — in plain language. Follow along as we build YAHSHUA One from the ground up.
          </p>
        </Reveal>
      </header>

      <div style={{ maxWidth: 768, margin: "0 auto", padding: "0 28px" }}>
        <div style={{ borderTop: "1px solid var(--line)" }} />
      </div>

      {/* Feed */}
      <main style={{ maxWidth: 768, margin: "0 auto", padding: "48px 28px" }}>

        {updates === null && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[1,2,3].map((i) => (
              <div key={i} style={{ borderRadius: 16, padding: 24, background: "var(--surface)", border: "1px solid var(--line)" }}>
                <div className="skeleton" style={{ height: 24, width: 96, borderRadius: 999, marginBottom: 16 }} />
                <div className="skeleton" style={{ height: 20, width: "65%", borderRadius: 6, marginBottom: 12 }} />
                <div className="skeleton" style={{ height: 14, width: "100%", borderRadius: 4, marginBottom: 6 }} />
                <div className="skeleton" style={{ height: 14, width: "80%", borderRadius: 4 }} />
              </div>
            ))}
          </div>
        )}

        {updates !== null && updates.length === 0 && (
          <div className="section-pad-lg" style={{ textAlign: "center" }}>
            <p style={{ fontSize: 18, color: "var(--muted)" }}>No updates yet. We&apos;re building!</p>
          </div>
        )}

        {updates !== null && updates.length > 0 && (
          <div style={{ position: "relative" }}>
            {/* Timeline line */}
            <div style={{
              position: "absolute", left: 11, top: 8, bottom: 8, width: 1,
              background: "linear-gradient(to bottom, var(--accent) 0%, transparent 100%)",
            }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {updates.map((update, i) => (
                <Reveal key={i} delay={i * 50}>
                  <div style={{ paddingLeft: 40, position: "relative" }}>
                    {/* Timeline dot */}
                    <div style={{
                      position: "absolute", left: 0, top: 22,
                      width: 23, height: 23, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: i === 0 ? "var(--accent)" : "var(--accent-50)",
                      border: "2px solid var(--bg)",
                      boxShadow: i === 0 ? "0 0 0 3px var(--accent-glow)" : "none",
                    }}>
                      {i === 0 && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
                    </div>

                    {/* Card */}
                    <div style={{
                      background: "var(--surface)", border: `1px solid ${i === 0 ? "oklch(0.88 0.06 215)" : "var(--line)"}`,
                      borderRadius: 16, padding: 24,
                      boxShadow: i === 0 ? "var(--shadow)" : "none",
                      transition: "border-color .15s ease",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
                        <Badge label={update.badge} />
                        <span style={{ fontSize: 12, color: "var(--soft)" }}>{formatDate(update.date)}</span>
                        {i === 0 && (
                          <span style={{ fontSize: 10.5, fontWeight: 500, padding: "2px 8px", borderRadius: 999, background: "var(--accent)", color: "#fff", fontFamily: "var(--font-geist-mono, monospace)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                            Latest
                          </span>
                        )}
                      </div>

                      <h2 style={{ fontWeight: 600, color: "var(--ink)", marginBottom: 10, fontSize: "clamp(1.05rem, 2.5vw, 1.2rem)", lineHeight: 1.35, letterSpacing: "-0.01em" }}>
                        {update.title}
                      </h2>

                      <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
                        {update.body
                          ? update.body[0].length > 200 ? update.body[0].slice(0, 200).trimEnd() + "…" : update.body[0]
                          : update.description}
                      </p>

                      {update.body && (
                        <a href={`/updates/${update.date}`} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13.5, fontWeight: 500, color: "var(--accent-2)", marginTop: 14 }}>
                          Read full update →
                        </a>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* CTA */}
      <section style={{ maxWidth: 768, margin: "0 auto", padding: "0 28px 80px" }}>
        <Reveal>
          <div style={{
            borderRadius: 20, padding: 48, textAlign: "center", overflow: "hidden", position: "relative",
            border: "1px solid var(--line)",
            background: "radial-gradient(70% 100% at 0% 100%, var(--accent-glow), transparent 60%), radial-gradient(60% 100% at 100% 0%, oklch(0.95 0.03 215 / 0.5), transparent 60%), var(--surface)",
          }}>
            <p style={{ fontWeight: 600, color: "var(--ink)", fontSize: 20, margin: "0 0 8px" }}>Want to be first when we launch?</p>
            <p style={{ color: "var(--muted)", fontSize: 15, margin: "0 0 24px" }}>Join the waitlist — no spam, no credit card.</p>
            <a href="/#waitlist" style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px",
              background: "var(--ink)", color: "#fff", borderRadius: 999,
              fontWeight: 500, fontSize: 14.5,
            }}>
              Claim My Spot →
            </a>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--line)", padding: "32px 28px" }}>
        <div style={{ maxWidth: 768, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Image src="/logo.jpg" alt="YAHSHUA One" width={22} height={22} style={{ borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
            <span style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>YAHSHUA One</span>
          </a>
          <span style={{ fontSize: 13, color: "var(--soft)" }}>Built in the Philippines 🇵🇭 · © 2026 ABBA Initiative</span>
        </div>
      </footer>
    </div>
  );
}
