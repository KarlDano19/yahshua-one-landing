import { notFound } from "next/navigation";
import Image from "next/image";
import updatesData from "../../../public/updates.json";

interface Update {
  date: string;
  badge: string;
  title: string;
  description: string;
  body?: string[];
}

const updates: Update[] = updatesData as Update[];

export async function generateStaticParams() {
  return updates.map((u) => ({ slug: u.date }));
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch { return dateStr; }
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

export default async function UpdateDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const update = updates.find((u) => u.date === slug);
  if (!update) notFound();

  const paragraphs = update.body ?? [update.description];

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
            <a href="/updates" style={{ fontSize: 14, color: "var(--muted)" }}>← What&apos;s New</a>
            <a href="https://app.yahshua.one/" style={{ fontSize: 13.5, fontWeight: 500, color: "#fff", padding: "8px 16px", background: "var(--ink)", borderRadius: 999 }}>
              Start free
            </a>
          </div>
        </div>
      </nav>

      {/* Article */}
      <main style={{ maxWidth: 680, margin: "0 auto", padding: "64px 28px 80px" }}>

        <a href="/updates" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, color: "var(--muted)", marginBottom: 40 }}>
          ← Back to What&apos;s New
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
          <Badge label={update.badge} />
          <span style={{ fontSize: 13, color: "var(--soft)" }}>{formatDate(update.date)}</span>
        </div>

        <h1 style={{ fontWeight: 600, color: "var(--ink)", marginBottom: 32, fontSize: "clamp(1.75rem, 5vw, 2.4rem)", letterSpacing: "-0.025em", lineHeight: 1.2 }}>
          {update.title}
        </h1>

        <div style={{ borderTop: "1px solid var(--line)", marginBottom: 40 }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {paragraphs.map((para, i) => (
            <p key={i} style={{ fontSize: 16, lineHeight: 1.85, color: "var(--ink-2)", margin: 0 }}>
              {para}
            </p>
          ))}
        </div>
      </main>

      {/* CTA */}
      <section style={{ maxWidth: 680, margin: "0 auto", padding: "0 28px 80px" }}>
        <div style={{
          borderRadius: 20, padding: 40, textAlign: "center",
          border: "1px solid var(--line)",
          background: "radial-gradient(70% 100% at 0% 100%, var(--accent-glow), transparent 60%), radial-gradient(60% 100% at 100% 0%, oklch(0.95 0.03 215 / 0.5), transparent 60%), var(--surface)",
        }}>
          <p style={{ fontWeight: 600, color: "var(--ink)", fontSize: 19, margin: "0 0 8px" }}>Want to be first when we launch?</p>
          <p style={{ color: "var(--muted)", fontSize: 14, margin: "0 0 22px" }}>Join the waitlist — no spam, no credit card.</p>
          <a href="/#waitlist" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 26px", background: "var(--ink)", color: "#fff", borderRadius: 999, fontWeight: 500, fontSize: 14 }}>
            Claim My Spot →
          </a>
        </div>
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
