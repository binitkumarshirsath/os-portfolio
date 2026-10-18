import "server-only";
import { RATE_LIMIT_HEADERS, type ChatErrorCode } from "@/shared/config/rate-limits";
import type { RateLimitOutcome } from "./rate-limit";

/** Errors are JSON with a stable code; the chat maps codes to friendly UI states. */
export function chatError(
  status: number,
  code: ChatErrorCode,
  message: string,
  headers?: HeadersInit,
): Response {
  return Response.json({ error: { code, message } }, { status, headers });
}

export function rateLimitHeaders(outcome: RateLimitOutcome): Record<string, string> {
  return {
    [RATE_LIMIT_HEADERS.remaining]: String(outcome.allowed ? outcome.remaining : 0),
    [RATE_LIMIT_HEADERS.reset]: String(outcome.reset),
  };
}

/** The 429 for a refused request, worded for a recruiter, not a developer. */
export function rateLimitedResponse(
  outcome: Extract<RateLimitOutcome, { allowed: false }>,
): Response {
  const retryAfterSeconds = Math.max(1, Math.ceil((outcome.reset - Date.now()) / 1000));
  const headers = {
    ...rateLimitHeaders(outcome),
    "Retry-After": String(retryAfterSeconds),
  };

  if (outcome.reason === "visitor") {
    // No exact minutes: in a sliding window, Upstash's reset marks the end of its
    // internal bucket, not the moment the next question is actually allowed.
    return chatError(
      429,
      "visitor_limit",
      "That's the hourly limit for questions. It frees up again within the hour. The quick actions and every window still work.",
      headers,
    );
  }
  // Daily cap, or limits unavailable: either way the agent rests for now.
  return chatError(
    429,
    "daily_limit",
    "I'm out of breath for today. Here's how to reach Binit directly.",
    headers,
  );
}
