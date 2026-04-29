import { ImageResponse } from "next/og";

export const alt = "Alignum – Schreinerei in Mannheim";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #0a0a0a 60%, #1a1208 100%)",
          color: "#fbf8f3",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: "#d48408",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0a0a0a",
              fontWeight: 700,
              fontSize: 36,
            }}
          >
            A
          </div>
          <div style={{ fontSize: 32, fontWeight: 600 }}>alignum</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.0 }}>
            Schreiner aus
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.0,
              fontStyle: "italic",
              color: "#d48408",
            }}
          >
            Leidenschaft.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", color: "#a8a29e", fontSize: 24 }}>
          <div>Mannheim · seit 1992</div>
          <div>alignum.de</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
