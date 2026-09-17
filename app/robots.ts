import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      // AI answer-engine crawlers: explicit, separate rules so citation
      // crawlers can be governed independently of a future training-data
      // policy, instead of relying only on the wildcard above.
      {
        userAgent: "OAI-SearchBot", // ChatGPT search citations
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "ChatGPT-User", // on-demand fetch when a ChatGPT user asks it to browse a page
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "ClaudeBot", // Anthropic
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "GPTBot", // OpenAI training-data crawl, kept separate from OAI-SearchBot on purpose
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://www.yahshua.one/sitemap.xml",
    host: "https://www.yahshua.one",
  };
}
