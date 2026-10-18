"use client";

import { useEffect } from "react";

/** Any key or click ends the boot screen at once, for visitors who don't want to wait. */
export function BootSkip() {
  useEffect(() => {
    const skip = () => document.documentElement.classList.add("booted");
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, []);
  return null;
}
