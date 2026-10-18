"use client";

import { Mail, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { RATE_LIMITS } from "@/shared/config/rate-limits";
import { loadJdQuotaOnce, useJdMatch, type JdInput } from "../model/jd-match-store";
import { JdMatchForm } from "./jd-match-form";
import { JdMatchReportView } from "./jd-match-report";

type JdMatchPanelProps = {
  /** Supplied by the page, which also records the result in the chat. */
  onMatch: (input: JdInput) => void;
  onContact: () => void;
};

const secondaryButton =
  "inline-flex h-9 items-center gap-2 rounded-sm border border-line-strong px-3 text-sm transition-colors hover:border-accent hover:text-accent-text";

/** The Job Match window: a form until there's a report, then the report. */
export function JdMatchPanel({ onMatch, onContact }: JdMatchPanelProps) {
  const { status, label, report, truncated, error, remaining, reset } = useJdMatch();
  const isOutOfMatches = remaining === 0;

  useEffect(loadJdQuotaOnce, []);

  if (status === "analysing") {
    return (
      <div role="status" className="space-y-2 p-5">
        <p className="font-mono text-[11px] text-accent-text">
          <span className="animate-pulse">●</span> analysing
        </p>
        <p className="text-sm">
          Reading {label} and comparing it with Binit&apos;s work…
        </p>
        <p className="text-xs text-fg-muted">This usually takes 5–15 seconds.</p>
      </div>
    );
  }

  if (status === "done" && report) {
    return (
      <div className="space-y-5 p-5">
        <JdMatchReportView report={report} truncated={truncated} />
        <div className="flex flex-wrap gap-2 border-t border-line pt-4">
          <button type="button" onClick={reset} className={secondaryButton}>
            <RotateCcw aria-hidden className="size-4" />
            Match another
          </button>
          <button type="button" onClick={onContact} className={secondaryButton}>
            <Mail aria-hidden className="size-4" />
            Contact Binit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-5">
      <p className="text-sm leading-relaxed">
        Share a job description and get an honest fit report: requirements Binit&apos;s
        work backs up, with evidence, and the gaps.
      </p>
      {error && (
        <p
          role="alert"
          className="rounded-sm border border-accent-deep bg-accent-tint p-3 text-sm"
        >
          {error.message}
        </p>
      )}
      <JdMatchForm disabled={isOutOfMatches} onMatch={onMatch} />
      {remaining !== null && (
        <p className="font-mono text-[11px] text-fg-muted">
          {remaining}/{RATE_LIMITS.jdMatch.requests} matches left this hour
        </p>
      )}
    </div>
  );
}
