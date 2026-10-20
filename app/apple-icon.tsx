import { ImageResponse } from "next/og";

// iOS home-screen icon: the same scene as icon.svg (Apple needs a PNG).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{ width: "100%", height: "100%", display: "flex", background: "#F3EDE2" }}
    >
      <svg width="180" height="180" viewBox="0 0 64 64">
        <circle cx="38" cy="27" r="14" fill="#C2402C" />
        <path
          d="M0 50 L18 34 C20 32 22 32 24 34 L36 44 C44 40 54 42 64 44 V64 H0 Z"
          fill="#1F1B17"
          fillOpacity="0.82"
        />
      </svg>
    </div>,
    size,
  );
}
