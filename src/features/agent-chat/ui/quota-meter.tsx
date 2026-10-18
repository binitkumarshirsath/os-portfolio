"use client";

import { useEffect } from "react";
import { RATE_LIMITS } from "@/shared/config/rate-limits";
import { loadQuotaOnce, useChatQuota } from "../model/chat-quota";

const LIMIT = RATE_LIMITS.perVisitor.requests;
const SEGMENTS = Array.from({ length: LIMIT }, (_, index) => index);

/** A segmented bar like a battery: one segment per question left this hour. */
export function QuotaMeter() {
  const remaining = useChatQuota((state) => state.remaining);

  useEffect(loadQuotaOnce, []);

  // Reserve the row's height so nothing jumps when the number arrives.
  if (remaining === null) return <div aria-hidden className="h-4" />;

  return (
    <div className="flex h-4 items-center gap-2 font-mono text-[11px] text-fg-muted">
      <span aria-hidden className="flex gap-0.5">
        {SEGMENTS.map((index) => (
          <span
            key={index}
            className={`h-1.5 w-2 rounded-[1px] ${index < remaining ? "bg-accent" : "bg-line-strong"}`}
          />
        ))}
      </span>
      <span className="whitespace-nowrap">
        {remaining}/{LIMIT} messages left this hour
      </span>
    </div>
  );
}
