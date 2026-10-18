import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { getSiteUrl } from "@/shared/config/site-url";
import { profile } from "@/shared/content";
import { MotionProvider } from "@/shared/ui";
import { BootScript } from "@/widgets/boot-screen";
import "./globals.css";

// Latin-only subsets of two Japanese fonts, made by scripts/subset-fonts.mjs. Via
// next/font/google they came as ~120 files per weight and 616 @font-face rules of
// render-blocking CSS; these are one small file per weight. next/font/local still
// generates a metric-matched fallback, so swapping in the font causes no layout shift.
// (Paths are literals because next/font reads them at build time.)
const display = localFont({
  src: [
    { path: "../src/shared/assets/fonts/shippori-mincho-b1-600.woff2", weight: "600" },
    { path: "../src/shared/assets/fonts/shippori-mincho-b1-800.woff2", weight: "800" },
  ],
  variable: "--font-shippori",
  fallback: ["Georgia", "serif"],
});

const body = localFont({
  src: [
    { path: "../src/shared/assets/fonts/zen-kaku-gothic-new-400.woff2", weight: "400" },
    { path: "../src/shared/assets/fonts/zen-kaku-gothic-new-500.woff2", weight: "500" },
    { path: "../src/shared/assets/fonts/zen-kaku-gothic-new-700.woff2", weight: "700" },
  ],
  variable: "--font-zen-kaku",
  fallback: ["system-ui", "sans-serif"],
});

// Mono is only used for meta text and traces, so it doesn't need to block first paint.
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  preload: false,
});

const title = `${profile.fullName} — ${profile.role}`;

export const metadata: Metadata = {
  // Lets the generated OG image and other relative URLs resolve to the real domain.
  metadataBase: getSiteUrl(),
  title,
  description: profile.positioning,
  openGraph: {
    type: "website",
    title,
    description: profile.positioning,
    siteName: "Binit OS",
  },
  twitter: { card: "summary_large_image", title, description: profile.positioning },
};

export const viewport: Viewport = {
  themeColor: "#070707",
  // Lets the mobile tab bar extend under the iPhone home indicator (padded via safe-area insets).
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
      // The boot script may add a class before React hydrates.
      suppressHydrationWarning
    >
      <head>
        <BootScript />
      </head>
      <body className="min-h-full">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
