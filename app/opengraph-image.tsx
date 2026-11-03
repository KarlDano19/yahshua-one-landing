import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "YAHSHUA One: AI-Powered Payroll and BIR Files for Filipino Businesses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#07090f",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gradient glow */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 800,
            height: 600,
            background:
              "radial-gradient(ellipse, rgba(40,176,232,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "rgba(40,176,232,0.12)",
            border: "1px solid rgba(40,176,232,0.25)",
            borderRadius: 999,
            padding: "8px 20px",
            marginBottom: 36,
          }}
        >
          <span style={{ color: "#7DE5F0", fontSize: 14, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            ✦ AI-Powered · Built for Filipino Businesses
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 72,
            fontWeight: 400,
            color: "#ffffff",
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
            marginBottom: 28,
            maxWidth: 820,
          }}
        >
          <div>Payroll. BIR Files.</div>
          <div style={{ color: "#28B0E8" }}>Contributions. Payslips.</div>
          <div>All automated.</div>
        </div>

        {/* Sub */}
        <div style={{ fontSize: 22, color: "rgba(255,255,255,0.5)", maxWidth: 680, lineHeight: 1.5, marginBottom: 48 }}>
          The AI backoffice built for Filipino SMBs. SSS, PhilHealth, Pag-IBIG, BIR forms, payslips, and an Android clock-in app.
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {["Automated Payroll", "BIR Forms", "SSS · PhilHealth · Pag-IBIG", "Payslips", "Android Clock-in"].map((f) => (
            <div
              key={f}
              style={{
                background: "rgba(40,176,232,0.1)",
                border: "1px solid rgba(40,176,232,0.2)",
                borderRadius: 999,
                padding: "10px 20px",
                color: "#7DE5F0",
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              {f}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 52,
            right: 80,
            fontSize: 18,
            color: "rgba(255,255,255,0.3)",
            fontWeight: 600,
          }}
        >
          yahshua.one
        </div>
      </div>
    ),
    { ...size }
  );
}
