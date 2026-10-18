import { create } from "zustand";
import { NETWORK_ERROR, readApiError, type ApiErrorState } from "@/shared/lib";
import type { JdMatchReport } from "./report-schema";

export type JdInput = { file: File } | { text: string };

type JdMatchState = {
  status: "idle" | "analysing" | "done" | "error";
  /** What's being or was analysed: a file name, or "pasted job description". */
  label: string | null;
  report: JdMatchReport | null;
  /** The JD was longer than the limit, so only its start was analysed. */
  truncated: boolean;
  error: ApiErrorState | null;
  /** Matches left this hour; null until the server has told us. */
  remaining: number | null;
  reset: () => void;
};

export const useJdMatch = create<JdMatchState>()((set) => ({
  status: "idle",
  label: null,
  report: null,
  truncated: false,
  error: null,
  remaining: null,
  reset: () =>
    set({ status: "idle", label: null, report: null, truncated: false, error: null }),
}));

type MatchResponse = {
  report: JdMatchReport;
  label: string;
  truncated: boolean;
  remaining: number;
};

// The body comes from our own route; checking the outer shape is enough to tell
// a report from an error or a proxy's HTML page.
const isMatchResponse = (value: unknown): value is MatchResponse =>
  typeof value === "object" &&
  value !== null &&
  "report" in value &&
  "remaining" in value;

export type JdMatchOutcome =
  { ok: true; report: JdMatchReport; label: string } | { ok: false };

/** Sends a JD for matching and keeps the store in step. The caller decides what else to do. */
export async function submitJobDescription(input: JdInput): Promise<JdMatchOutcome> {
  const label = "file" in input ? input.file.name : "pasted job description";
  useJdMatch.setState({ status: "analysing", label, report: null, error: null });

  const body = new FormData();
  if ("file" in input) body.append("file", input.file);
  else body.append("text", input.text);

  let json: unknown = null;
  try {
    const response = await fetch("/api/jd-match", { method: "POST", body });
    json = await response.json().catch(() => null);
    if (response.ok && isMatchResponse(json)) {
      useJdMatch.setState({
        status: "done",
        label: json.label,
        report: json.report,
        truncated: json.truncated,
        remaining: json.remaining,
      });
      return { ok: true, report: json.report, label: json.label };
    }
  } catch {
    // Network failure: handled below like any other unusable response.
  }

  const error = readApiError(json) ?? NETWORK_ERROR;
  useJdMatch.setState((state) => ({
    status: "error",
    error,
    remaining: error.code === "visitor_limit" ? 0 : state.remaining,
  }));
  return { ok: false };
}

let hasRequestedQuota = false;

/** Asks once per page load how many matches this visitor has left. */
export function loadJdQuotaOnce(): void {
  if (hasRequestedQuota) return;
  hasRequestedQuota = true;
  fetch("/api/jd-match")
    .then((response) => (response.ok ? response.json() : null))
    .then((body: { remaining?: unknown } | null) => {
      if (typeof body?.remaining === "number")
        useJdMatch.setState({ remaining: body.remaining });
    })
    .catch(() => {
      // The counter just stays hidden; matching still works.
    });
}
