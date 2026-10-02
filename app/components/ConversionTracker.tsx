"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export default function ConversionTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const link = (e.target as Element | null)?.closest?.("a");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      const params = { link_url: href, page_path: window.location.pathname };
      if (href.includes("calendly.com")) {
        trackEvent("book_demo_click", params);
      } else if (href.includes("app.yahshua.one") && !/sign in/i.test(link.textContent ?? "")) {
        trackEvent("start_free_click", params);
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
