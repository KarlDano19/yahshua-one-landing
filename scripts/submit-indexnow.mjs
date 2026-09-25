// Submits every URL in the live sitemap to IndexNow (Bing, Yandex, Naver, Seznam).
// Run manually after a production deploy that adds or changes pages:
//   node scripts/submit-indexnow.mjs
//
// Not wired into CI/CD (no pipeline exists for that yet) — this is a manual
// post-deploy step until one does.

const BASE_URL = "https://www.yahshua.one";
const INDEXNOW_KEY = "d6dc50ab279ad8dbb6b438f803adf055";
const KEY_LOCATION = `${BASE_URL}/${INDEXNOW_KEY}.txt`;

async function getSitemapUrls() {
  const res = await fetch(`${BASE_URL}/sitemap.xml`);
  if (!res.ok) throw new Error(`Failed to fetch sitemap.xml: ${res.status}`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  if (urls.length === 0) throw new Error("No URLs found in sitemap.xml");
  return urls;
}

async function submitToIndexNow(urls) {
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(BASE_URL).host,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList: urls,
    }),
  });
  return res;
}

const urls = await getSitemapUrls();
console.log(`Submitting ${urls.length} URLs to IndexNow:`);
urls.forEach((u) => console.log(`  ${u}`));

const res = await submitToIndexNow(urls);
if (res.status === 200 || res.status === 202) {
  console.log(`\nSubmitted successfully (HTTP ${res.status}).`);
} else {
  const body = await res.text().catch(() => "");
  console.error(`\nIndexNow submission failed: HTTP ${res.status}\n${body}`);
  process.exit(1);
}
