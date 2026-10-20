import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/shared/content";

// The card shown when the site is shared: the same washi paper, vermilion sun,
// ink ridges and type as the site's daytime look.
export const alt = `${profile.fullName}, ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontsDir = join(process.cwd(), "src/shared/assets/fonts/og");
const displayFont = readFile(join(fontsDir, "shippori-mincho-b1-800.ttf"));
const monoFont = readFile(join(fontsDir, "jetbrains-mono-400.ttf"));

const PAPER = "#F3EDE2";
const INK = "#1F1B17";
const VERMILION = "#C2402C";

// The far and near ridges from the site's landscape, redrawn for a 1200×630 card,
// with the peak set under the sun and clear of the text.
const FAR_RIDGE =
  "M0 470C90 458 170 440 260 446C350 452 420 466 520 458C600 452 660 444 720 446L850 362C864 352 884 352 898 362L1010 440C1080 452 1140 446 1200 440V630H0Z";
const NEAR_RIDGE =
  "M0 548C110 534 200 524 300 530C400 536 460 552 570 546C680 540 750 524 860 528C970 532 1040 548 1200 542V630H0Z";

export default async function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: PAPER,
        color: INK,
      }}
    >
      <svg
        width="1200"
        height="630"
        viewBox="0 0 1200 630"
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        <circle cx="960" cy="200" r="118" fill={VERMILION} />
        <path d={FAR_RIDGE} fill={INK} fillOpacity="0.09" />
        <path d={NEAR_RIDGE} fill={INK} fillOpacity="0.16" />
      </svg>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "96px 88px",
          gap: 22,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontFamily: "Mono",
            fontSize: 24,
            color: VERMILION,
            letterSpacing: 3,
          }}
        >
          <div style={{ width: 40, height: 2, background: VERMILION }} />
          {`${profile.role} · ${profile.level}`.toUpperCase()}
        </div>
        <div
          style={{ fontFamily: "Display", fontSize: 96, lineHeight: 1.02, maxWidth: 700 }}
        >
          {profile.fullName}
        </div>
        <div style={{ fontFamily: "Mono", fontSize: 24, color: "#675D53" }}>
          {`Binit OS · ${profile.location}`}
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
