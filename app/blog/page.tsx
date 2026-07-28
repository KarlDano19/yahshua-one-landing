import Image from "next/image";
import { getAllPosts, formatDate } from "@/lib/blog";

function CategoryBadge({ label }: { label: string }) {
  return (
    <span
      className="badge-feature"
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: 11,
        fontWeight: 600,
        padding: "3px 10px",
        borderRadius: 999,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div style={{ background: "var(--bg)", color: "var(--ink)", minHeight: "100vh", fontFamily: "var(--font-geist, sans-serif)" }}>

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        backdropFilter: "blur(14px)",
        background: "color-mix(in oklab, var(--bg) 78%, transparent)",
        borderBottom: "1px solid var(--line)",
      }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 28px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
              background: "var(--ink)", borderRadius: 999,
            }}>Start free</a>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header style={{ maxWidth: 860, margin: "0 auto", padding: "72px 28px 48px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 12px 5px 8px", border: "1px solid var(--line)", background: "var(--surface)", borderRadius: 999, fontSize: 12, color: "var(--ink-2)", marginBottom: 20 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 0 4px var(--accent-glow)" }} />
          Payroll & HR knowledge base
        </div>
        <h1 style={{ fontSize: "clamp(2.2rem, 5.5vw, 3.25rem)", letterSpacing: "-0.03em", fontWeight: 500, lineHeight: 1.08, margin: "0 0 16px", color: "var(--ink)" }}>
          Guides for Filipino businesses
        </h1>
        <p style={{ fontSize: 18, color: "var(--muted)", lineHeight: 1.6, margin: "0 auto", maxWidth: 480 }}>
          Plain-language guides on payroll computation, BIR compliance, SSS, PhilHealth, Pag-IBIG, and HR — written for the Philippine context.
        </p>
      </header>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 28px" }}>
        <div style={{ borderTop: "1px solid var(--line)" }} />
      </div>

      {/* Posts */}
      <main style={{ maxWidth: 860, margin: "0 auto", padding: "48px 28px 80px" }}>
        {posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: 18, color: "var(--muted)" }}>No posts yet — check back soon.</p>
          </div>
        ) : (
          <div className="grid-blog">
            {posts.map((post) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{ display: "block", textDecoration: "none" }}
              >
                <article className="blog-card">
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <CategoryBadge label={post.category} />
                    {post.readTime && (
                      <span style={{ fontSize: 12, color: "var(--soft)" }}>{post.readTime}</span>
                    )}
                  </div>
                  <h2 style={{
                    fontSize: "clamp(1.05rem, 2vw, 1.15rem)",
                    fontWeight: 600,
                    color: "var(--ink)",
                    lineHeight: 1.35,
                    letterSpacing: "-0.01em",
                    margin: 0,
                    flex: 1,
                  }}>
                    {post.title}
                  </h2>
                  <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.65, margin: 0 }}>
                    {post.description}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                    <span style={{ fontSize: 12, color: "var(--soft)" }}>{formatDate(post.date)}</span>
                    <span style={{ fontSize: 13.5, fontWeight: 500, color: "var(--accent-2)" }}>Read →</span>
                  </div>
                </article>
              </a>
            ))}
          </div>
        )}
      </main>

      {/* CTA */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "0 28px 80px" }}>
        <div style={{
          borderRadius: 20, padding: 48, textAlign: "center",
          border: "1px solid var(--line)",
          background: "radial-gradient(70% 100% at 0% 100%, var(--accent-glow), transparent 60%), radial-gradient(60% 100% at 100% 0%, oklch(0.95 0.03 215 / 0.5), transparent 60%), var(--surface)",
        }}>
          <p style={{ fontWeight: 600, color: "var(--ink)", fontSize: 20, margin: "0 0 8px" }}>See YAHSHUA One in action.</p>
          <p style={{ color: "var(--muted)", fontSize: 15, margin: "0 0 24px" }}>Walk through payroll, BIR compliance, and HR with our team — free, no commitment.</p>
          <a href="/#waitlist" style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px",
            background: "var(--ink)", color: "#fff", borderRadius: 999,
            fontWeight: 500, fontSize: 14.5,
          }}>
            Book a Free Demo →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--line)", padding: "32px 28px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Image src="/logo.jpg" alt="YAHSHUA One" width={22} height={22} style={{ borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
            <span style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>YAHSHUA One</span>
          </a>
          <span style={{ fontSize: 13, color: "var(--soft)" }}>© 2026 The ABBA Initiative (OPC). All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
