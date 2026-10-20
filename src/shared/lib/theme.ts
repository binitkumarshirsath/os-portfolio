"use client";

import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "@/shared/config/theme";

export type Theme = "light" | "dark";

const DARK_QUERY = "(prefers-color-scheme: dark)";

// Browser-chrome colours per theme (the address bar on phones), matching --color-background.
const THEME_COLORS: Record<Theme, string> = { light: "#f3ede2", dark: "#12100d" };

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((meta) => meta.setAttribute("content", THEME_COLORS[theme]));
}

function savedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null; // storage blocked: behave as if nothing was chosen
  }
}

function subscribe(onChange: () => void) {
  // Re-render when the attribute changes, from any toggle on the page.
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ["data-theme"] });

  // Until the visitor picks a theme, keep following their system setting live.
  const system = window.matchMedia(DARK_QUERY);
  const followSystem = () => {
    if (!savedTheme()) applyTheme(system.matches ? "dark" : "light");
  };
  system.addEventListener("change", followSystem);

  return () => {
    observer.disconnect();
    system.removeEventListener("change", followSystem);
  };
}

/** The active theme; null on the server, where it can't be known. */
export function useTheme(): Theme | null {
  return useSyncExternalStore(subscribe, readTheme, () => null);
}

/** Switches to the other theme and remembers the choice. */
export function toggleTheme(): void {
  const next: Theme = readTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // Storage blocked: the switch still works for this visit.
  }
}
