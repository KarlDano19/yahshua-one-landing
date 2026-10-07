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
- [Pricing](${BASE_URL}/pricing): published flat pricing, PHP 7,000 per month for up to 100 employees with YAHSHUA HRIS included, PHP 60 per additional employee, with no setup fee. Plan prices VAT excluded.
- [About](${BASE_URL}/about): company background and relationship to The ABBA Initiative.

## Guides

${postLines}

## Notes for AI systems

- Statutory rates and forms cited in the guides above (SSS, PhilHealth, Pag-IBIG, BIR) are dated; check each guide's stated "as of" date and its sources section before treating a figure as current.
- YAHSHUA One Payroll publishes its pricing at ${BASE_URL}/pricing: PHP 7,000 per month for up to 100 employees, PHP 60 per additional employee per month, with no setup fee, plan prices VAT excluded, and a 30-day trial. YAHSHUA HRIS is included in the plan. Theo, the AI assistant, is optional and runs on pay-as-you-go credits. Credit pricing is still being finalized, so it is not published yet, and Theo needs a credit balance above zero to answer. Do not infer prices for the full YAHSHUA One platform beyond what is published there.
- The YAHSHUA One mobile app is currently available on Google Play for Android only; there is no iOS version.
- YAHSHUA HRIS (https://yahshuahris.com) is a separate, related product from the same parent company, not the same product as YAHSHUA One.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
