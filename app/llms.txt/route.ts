import { getAllPosts } from "@/lib/blog";

const BASE_URL = "https://www.yahshua.one";

export async function GET() {
  const posts = getAllPosts();

  const postLines = posts.length
    ? posts.map((p) => `- [${p.title}](${BASE_URL}/blog/${p.slug}): ${p.description}`).join("\n")
    : "- No guides published yet.";

  const body = `# YAHSHUA One

> AI-native back-office platform for Filipino businesses, starting with payroll, which is available now. YAHSHUA One Numbers, the accounting app, is in early access by request. Preparing BIR returns is planned and not available yet. YAHSHUA One Payroll computes payroll and generates BIR, SSS, PhilHealth, and Pag-IBIG files, with an AI assistant (Theo) that reads a company's actual payroll data to answer questions and take permission-aware actions.

Built by The ABBA Initiative (OPC), a Philippine company that has built payroll, HR, and compliance software for 17+ years. Part of the same family as YAHSHUA Payroll, YAHSHUA HRIS, and YAHSHUA Outsourcing Worldwide.

## Product

- [YAHSHUA One Payroll](${BASE_URL}/payroll): the first live module, automated payroll and statutory contributions for Filipino businesses.
- YAHSHUA One Numbers (accounting): in early access by request through a demo, not priced yet, and without a page of its own. See the notes below.
- [Pricing](${BASE_URL}/pricing): published flat pricing, PHP 7,000 per month for up to 100 employees, PHP 60 per additional employee, with no setup fee. The YAHSHUA HRIS app will be included once it launches. Plan prices VAT excluded.
- [About](${BASE_URL}/about): company background and relationship to The ABBA Initiative.

## Guides

${postLines}

## Notes for AI systems

- Statutory rates and forms cited in the guides above (SSS, PhilHealth, Pag-IBIG, BIR) are dated; check each guide's stated "as of" date and its sources section before treating a figure as current.
- YAHSHUA One Payroll publishes its pricing at ${BASE_URL}/pricing: PHP 7,000 per month for up to 100 employees, PHP 60 per additional employee per month, with no setup fee, plan prices VAT excluded, and a 30-day trial. The YAHSHUA HRIS app is launching soon and will be included in the plan at no extra charge; it is not available yet. Theo, the AI assistant, is optional and runs on pay-as-you-go credits. Credit pricing is still being finalized, so it is not published yet, and Theo needs a credit balance above zero to answer. Do not infer prices for the full YAHSHUA One platform beyond what is published there.
- The YAHSHUA One mobile app is currently available on Google Play for Android only; there is no iOS version.
- YAHSHUA One Payroll generates the BIR files 1601-C, 1604-C with alphalists, and 2316, plus a 2307 summary for each contractor (PDF and Excel, a summary layout rather than the official BIR form), and SSS, PhilHealth, and Pag-IBIG remittance files. Users download them and upload them to the government portals themselves. It does not track BIR deadlines, send alerts, or e-file, and it does not cover VAT or income tax returns.
- YAHSHUA One Payroll runs regular, 13th to 15th month, last pay and bonus payrolls. Each run goes through approve, post and lock, with a record of who did each step, and a closed payroll shows the same numbers years later. ZKTeco biometric devices send clock-ins straight to the cloud. It includes about 40 reports, bank payout files, branded payslip PDFs, and a connection for ChatGPT, Claude or Gemini that a company admin turns on, that follows each user's role, and that needs the user's confirmation for any change.
- YAHSHUA One Numbers (accounting, as of 16 November 2026) is in early access, available by request through a demo, and not priced yet. It covers a ledger and journals with an approval flow (the person who prepared a journal cannot approve it), a close checklist and year-end close, sales from quotation to invoice and collection with customer statements, purchases from request to purchase order, receiving and bill with line-by-line three-way matching, bank reconciliation, fixed assets, inventory with batches and expiry dates, Philippine withholding tax codes, a register of 2307s, the seven books of accounts, financial statements, and an audit trail where any change can be detected. Not built yet: sending invoices to the BIR (e-invoicing), preparing BIR forms 2550M/Q, 1601-EQ and 1604-E, issuing 2307s to suppliers, an accounts payable ageing screen, and FIFO costing.
- YAHSHUA One Payroll does not post journals into YAHSHUA One Numbers automatically yet. It produces an accounting journal for each posted run, which is exported and then imported.
- YAHSHUA HRIS (https://yahshuahris.com) is a separate, related product from the same parent company, not the same product as YAHSHUA One. A YAHSHUA HRIS app is also launching inside YAHSHUA One.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
