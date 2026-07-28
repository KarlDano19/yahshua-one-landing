import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug, formatDate } from "@/lib/blog";

const BASE_URL = "https://www.yahshua.one";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `${BASE_URL}/blog/${slug}` },
    openGraph: {
      type: "article",
      locale: "en_PH",
      url: `${BASE_URL}/blog/${slug}`,
      siteName: "YAHSHUA One",
      title: post.title,
      description: post.description,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: post.title }],
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: "ABBA Initiative",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "YAHSHUA One",
      url: BASE_URL,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.jpg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/blog/${slug}` },
    inLanguage: "en-PH",
  };

  return (
    <div style={{ background: "var(--bg)", color: "var(--ink)", minHeight: "100vh", fontFamily: "var(--font-geist, sans-serif)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        backdropFilter: "blur(14px)",
        background: "color-mix(in oklab, var(--bg) 78%, transparent)",
        borderBottom: "1px solid var(--line)",
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 28px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Image src="/logo.jpg" alt="YAHSHUA One" width={28} height={28} style={{ borderRadius: 8, objectFit: "cover", flexShrink: 0 }} priority />
            <span style={{ fontWeight: 600, letterSpacing: "-0.02em", fontSize: 16 }}>
              YAHSHUA <span style={{ color: "var(--muted)", fontWeight: 400 }}>One</span>
            </span>
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <a href="/blog" style={{ fontSize: 14, color: "var(--muted)", display: "flex", alignItems: "center", gap: 6 }}>← Blog</a>
            <a href="https://app.yahshua.one/" style={{
              fontSize: 13.5, fontWeight: 500, color: "#fff", padding: "8px 16px",
              background: "var(--ink)", borderRadius: 999,
            }}>Start free</a>
          </div>
        </div>
      </nav>

      {/* Article */}
      <article style={{ maxWidth: 720, margin: "0 auto", padding: "60px 28px 80px" }}>

        {/* Meta */}
        <header style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
            <span
              className="badge-feature"
              style={{
                display: "inline-flex", alignItems: "center",
                fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999,
                letterSpacing: "0.04em", textTransform: "uppercase",
              }}
            >
              {post.category}
            </span>
            <span style={{ fontSize: 13, color: "var(--soft)" }}>{formatDate(post.date)}</span>
            {post.readTime && (
              <span style={{ fontSize: 13, color: "var(--soft)" }}>· {post.readTime}</span>
            )}
          </div>

          <h1 style={{
            fontSize: "clamp(1.8rem, 4.5vw, 2.5rem)",
            fontWeight: 600,
            lineHeight: 1.12,
            letterSpacing: "-0.025em",
            color: "var(--ink)",
            margin: "0 0 20px",
          }}>
            {post.title}
          </h1>

          <p style={{
            fontSize: 18,
            color: "var(--muted)",
            lineHeight: 1.65,
            margin: 0,
            borderBottom: "1px solid var(--line)",
            paddingBottom: 32,
          }}>
            {post.description}
          </p>
        </header>

        {/* Content */}
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
        />

        {/* CTA */}
        <div style={{
          marginTop: 64,
          borderRadius: 16,
          padding: "36px 32px",
          border: "1px solid var(--line)",
          background: "radial-gradient(70% 140% at 0% 100%, var(--accent-glow), transparent 60%), var(--surface)",
        }}>
          <p style={{ fontWeight: 600, color: "var(--ink)", fontSize: 18, margin: "0 0 8px" }}>
            Stop computing this by hand.
          </p>
          <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.6, margin: "0 0 20px", maxWidth: 440 }}>
            YAHSHUA One automatically computes SSS, PhilHealth, Pag-IBIG, and BIR withholding tax for every employee — every cutoff, zero manual work.
          </p>
          <a href="/#waitlist" style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 24px",
            background: "var(--ink)", color: "#fff", borderRadius: 999,
            fontWeight: 500, fontSize: 14,
          }}>
            Join the waitlist →
          </a>
        </div>
      </article>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--line)", padding: "32px 28px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
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
