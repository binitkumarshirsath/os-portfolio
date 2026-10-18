"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

// "user" follows prefers-reduced-motion: movement is skipped, opacity fades stay.
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
