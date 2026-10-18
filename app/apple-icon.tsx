import { ImageResponse } from "next/og";

// iOS home-screen icon: the same sun as icon.svg (Apple needs a PNG).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#070707",
      }}
    >
      <div
        style={{
          width: 128,
          height: 128,
          borderRadius: 9999,
          border: "4px solid rgba(229, 56, 59, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{ width: 94, height: 94, borderRadius: 9999, background: "#E5383B" }}
        />
      </div>
    </div>,
    size,
  );
}
