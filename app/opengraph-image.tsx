import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/shared/content";

// The card shown when the site is shared: the same sun, colours and type as the site.
export const alt = `${profile.fullName}, ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontsDir = join(process.cwd(), "src/shared/assets/fonts/og");
const displayFont = readFile(join(fontsDir, "shippori-mincho-b1-800.ttf"));
const monoFont = readFile(join(fontsDir, "jetbrains-mono-400.ttf"));

export default async function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: "#070707",
        color: "#F2ECE8",
        overflow: "hidden",
      }}
    >
      {/* The sun and its ring, as on the desktop. */}
      <div
        style={{
          position: "absolute",
          right: 50,
          top: 75,
          width: 480,
          height: 480,
          borderRadius: 9999,
          background: "rgba(229, 56, 59, 0.15)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 22,
          top: 47,
          width: 536,
          height: 536,
          borderRadius: 9999,
          border: "2px solid rgba(229, 56, 59, 0.4)",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 88px",
          gap: 24,
        }}
      >
        <div
          style={{ fontFamily: "Mono", fontSize: 26, color: "#FF8A8C", letterSpacing: 4 }}
        >
          {`${profile.role} · ${profile.level}`.toUpperCase()}
        </div>
        <div
          style={{ fontFamily: "Display", fontSize: 92, lineHeight: 1.05, maxWidth: 720 }}
        >
          {profile.fullName}
        </div>
        <div style={{ fontFamily: "Mono", fontSize: 24, color: "#A39A97" }}>
          {`BINIT · OS — ${profile.location}`}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Display", data: await displayFont, weight: 800 },
        { name: "Mono", data: await monoFont, weight: 400 },
      ],
    },
  );
}
