import { useMemo, useSyncExternalStore } from "react";
import type { AgentTrace } from "./agent-trace";

/**
 * The most recent agent turn, kept in the visitor's own browser so the
 * architecture page (opened in a new tab, with no access to the chat's memory)
 * can replay it. Only ever the latest one; nothing leaves the browser.
 */
export type SavedTurn = { question: string; trace: AgentTrace };

const KEY = "binit-os:last-turn";

export function saveLastTurn(turn: SavedTurn): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(turn));
  } catch {
    // Storage full or blocked: replay just won't be offered.
  }
}

function isSavedTurn(value: unknown): value is SavedTurn {
  if (typeof value !== "object" || value === null) return false;
  if (!("question" in value) || typeof value.question !== "string") return false;
  if (!("trace" in value) || typeof value.trace !== "object" || value.trace === null)
    return false;
  return "spans" in value.trace && Array.isArray(value.trace.spans);
}

function parse(raw: string | null): SavedTurn | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    return isSavedTurn(value) ? value : null;
  } catch {
    return null;
  }
}

// The "storage" event fires when another tab writes, so a question asked on the
// desktop shows up on an already-open architecture page without a reload.
function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function readRaw(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

/** The last saved turn, or null (always null on the server and during hydration). */
export function useLastTurn(): SavedTurn | null {
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  return useMemo(() => parse(raw), [raw]);
}
