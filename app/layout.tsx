import type { Metadata, Viewport } from "next";
import {
  JetBrains_Mono,
  Shippori_Mincho_B1,
  Zen_Kaku_Gothic_New,
} from "next/font/google";
import { profile } from "@/shared/content";
import { MotionProvider } from "@/shared/ui";
import "./globals.css";

const display = Shippori_Mincho_B1({
  weight: ["600", "800"],
  subsets: ["latin"],
  variable: "--font-shippori",
});

const body = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-zen-kaku",
});

// Mono is only used for meta text and traces, so it doesn't need to block first paint.
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  preload: false,
});

export const metadata: Metadata = {
  title: `${profile.fullName} — ${profile.role}`,
  description: profile.positioning,
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
    >
      <body className="min-h-full">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
