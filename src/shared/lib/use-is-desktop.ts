"use client";

import { useSyncExternalStore } from "react";

// Matches Tailwind's `lg` breakpoint, where the draggable desktop takes over.
const DESKTOP_QUERY = "(min-width: 64rem)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const getIsDesktop = () => window.matchMedia(DESKTOP_QUERY).matches;
// The server can't know the screen size, so it answers "unknown".
const getServerIsDesktop = () => null;

/** true / false in the browser; null on the server and during hydration. */
export function useIsDesktop(): boolean | null {
  return useSyncExternalStore(subscribe, getIsDesktop, getServerIsDesktop);
}
