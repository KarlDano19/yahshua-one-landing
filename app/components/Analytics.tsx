"use client";

import { useSyncExternalStore } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import ConversionTracker from "./ConversionTracker";

const GA_MEASUREMENT_ID = "G-RCH2HNM48V";
const ANALYTICS_HOST = "www.yahshua.one";

const subscribe = () => () => {};
const onProductionHost = () => window.location.hostname === ANALYTICS_HOST;
const onServer = () => false;

export default function Analytics() {
  const enabled = useSyncExternalStore(subscribe, onProductionHost, onServer);
  if (!enabled) return null;

  return (
    <>
      <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      <ConversionTracker />
    </>
  );
}
