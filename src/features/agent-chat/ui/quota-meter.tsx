"use client";

import { useEffect } from "react";
import { RATE_LIMITS } from "@/shared/config/rate-limits";
import { loadQuotaOnce, useChatQuota } from "../model/chat-quota";

const LIMIT = RATE_LIMITS.chat.requests;
const SEGMENTS = Array.from({ length: LIMIT }, (_, index) => index);

/**
 * A segmented bar like a battery: one segment per question left this hour.
 * Segments flex to fill the space beside the label, so it fits any window width.
 */
export function QuotaMeter() {
  const remaining = useChatQuota((state) => state.remaining);

  useEffect(loadQuotaOnce, []);

  // Reserve the row's height so nothing jumps when the number arrives.
  if (remaining === null) return <div aria-hidden className="h-4" />;

  return (
    <div className="flex h-4 items-center gap-2 font-mono text-[11px] text-fg-muted">
      <span aria-hidden className="flex max-w-48 min-w-0 flex-1 gap-px">
        {SEGMENTS.map((index) => (
          <span
            key={index}
            className={`h-1.5 flex-1 rounded-[1px] ${index < remaining ? "bg-accent" : "bg-line-strong"}`}
          />
        ))}
      </span>
      <span className="shrink-0 whitespace-nowrap">
        {remaining}/{LIMIT} messages left this hour
      </span>
    </div>
  );
}
