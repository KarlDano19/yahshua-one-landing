import { sendGAEvent } from "@next/third-parties/google";

export function trackEvent(name: string, params: Record<string, string> = {}) {
  if (process.env.NODE_ENV !== "production") return;
  sendGAEvent("event", name, params);
}
