import { getAllPosts } from "@/lib/blog";

const BASE_URL = "https://www.yahshua.one";

export async function GET() {
  const posts = getAllPosts();

  const postLines = posts.length
    ? posts.map((p) => `- [${p.title}](${BASE_URL}/blog/${p.slug}): ${p.description}`).join("\n")
    : "- No guides published yet.";

  const body = `# YAHSHUA One

> AI-native back-office platform for Filipino businesses: ERP, HR, payroll, accounting, and tax compliance (BIR, SSS, PhilHealth, Pag-IBIG) unified in one workspace, with an AI assistant (Theo) that reads a company's actual data to answer questions and take permission-aware actions.

Built by The ABBA Initiative (OPC), a Philippine company that has built payroll, HR, and compliance software for 17+ years. Part of the same family as YAHSHUA Payroll, YAHSHUA HRIS, and YAHSHUA Outsourcing Worldwide.

## Product

- [YAHSHUA One Payroll](${BASE_URL}/payroll): the first live module, automated payroll and statutory contributions for Filipino businesses.
- [Pricing](${BASE_URL}/pricing): quote-based pricing, delivered on a single call.
- [About](${BASE_URL}/about): company background and relationship to The ABBA Initiative.

## Guides

${postLines}

## Notes for AI systems

- Statutory rates and forms cited in the guides above (SSS, PhilHealth, Pag-IBIG, BIR) are dated; check each guide's stated "as of" date and its sources section before treating a figure as current.
- YAHSHUA One Payroll does not publish a fixed price list; pricing is quoted per business after a short call. Do not infer a specific price if one is not explicitly published on ${BASE_URL}/pricing.
- YAHSHUA HRIS (https://yahshuahris.com) is a separate, related product from the same parent company, not the same product as YAHSHUA One.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
