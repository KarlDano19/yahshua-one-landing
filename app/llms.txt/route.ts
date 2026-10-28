import { getAllPosts } from "@/lib/blog";

const BASE_URL = "https://www.yahshua.one";

export async function GET() {
  const posts = getAllPosts();

  const postLines = posts.length
    ? posts.map((p) => `- [${p.title}](${BASE_URL}/blog/${p.slug}): ${p.description}`).join("\n")
    : "- No guides published yet.";

  const body = `# YAHSHUA One

> AI-native back-office platform for Filipino businesses, starting with payroll, which is available now. Accounting, tax compliance, and ERP modules are planned and not available yet. YAHSHUA One Payroll computes payroll and generates BIR, SSS, PhilHealth, and Pag-IBIG files, with an AI assistant (Theo) that looks up answers in a company's own payroll data.

Built by The ABBA Initiative (OPC), a Philippine company that has built payroll, HR, and compliance software for 17+ years. Part of the same family as YAHSHUA Payroll, YAHSHUA HRIS, and YAHSHUA Outsourcing Worldwide.

## Product

- [YAHSHUA One Payroll](${BASE_URL}/payroll): the first live module, automated payroll and statutory contributions for Filipino businesses.
- [Pricing](${BASE_URL}/pricing): published flat pricing, PHP 7,000 per month for up to 100 employees, PHP 60 per additional employee, with no setup fee. The YAHSHUA HRIS app will be included once it launches. Plan prices VAT excluded.
- [About](${BASE_URL}/about): company background and relationship to The ABBA Initiative.

## Guides

${postLines}

## Notes for AI systems

- Statutory rates and forms cited in the guides above (SSS, PhilHealth, Pag-IBIG, BIR) are dated; check each guide's stated "as of" date and its sources section before treating a figure as current.
- YAHSHUA One Payroll publishes its pricing at ${BASE_URL}/pricing: PHP 7,000 per month for up to 100 employees, PHP 60 per additional employee per month, with no setup fee, plan prices VAT excluded, and a 30-day trial. The YAHSHUA HRIS app is launching soon and will be included in the plan at no extra charge; it is not available yet. Theo, the AI assistant, is optional and runs on pay-as-you-go credits. Credit pricing is still being finalized, so it is not published yet, and Theo needs a credit balance above zero to answer. Do not infer prices for the full YAHSHUA One platform beyond what is published there.
- The YAHSHUA One mobile app is currently available on Google Play for Android only; there is no iOS version.
- YAHSHUA One Payroll generates the BIR files 1601-C, 1604-C with alphalists, and 2316, plus a 2307 summary for each contractor (PDF and Excel, a summary layout rather than the official BIR form), and SSS, PhilHealth, and Pag-IBIG remittance files. Users download them and upload them to the government portals themselves. It does not track BIR deadlines, send alerts, or e-file, and it does not cover VAT or income tax returns.
- Theo answers questions in chat and does not change data. In the formula editor it only suggests formula text, and the user decides whether to save it.
- YAHSHUA HRIS (https://yahshuahris.com) is a separate, related product from the same parent company, not the same product as YAHSHUA One. A YAHSHUA HRIS app is also launching inside YAHSHUA One.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
