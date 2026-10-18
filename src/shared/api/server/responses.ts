import "server-only";
import {
  RATE_LIMIT_HEADERS,
  type ApiErrorCode,
  type RateLimitBucket,
} from "@/shared/config/rate-limits";
import type { RateLimitOutcome } from "./rate-limit";

/** Errors are JSON with a stable code; the UI maps codes to friendly states. */
export function apiError(
  status: number,
  code: ApiErrorCode,
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

// No exact minutes: in a sliding window, Upstash's reset marks the end of its
// internal bucket, not the moment the next request is actually allowed.
const visitorLimitMessages: Record<RateLimitBucket, string> = {
  chat: "That's the hourly limit for questions. It frees up again within the hour. The quick actions and every window still work.",
  jdMatch:
    "That's the hourly limit for job matches. It frees up again within the hour. Binit's experience and skills windows show the same evidence in the meantime.",
};

/** The 429 for a refused request, worded for a recruiter, not a developer. */
export function rateLimitedResponse(
  outcome: Extract<RateLimitOutcome, { allowed: false }>,
  bucket: RateLimitBucket,
): Response {
  const retryAfterSeconds = Math.max(1, Math.ceil((outcome.reset - Date.now()) / 1000));
  const headers = {
    ...rateLimitHeaders(outcome),
    "Retry-After": String(retryAfterSeconds),
  };

  if (outcome.reason === "visitor") {
    return apiError(429, "visitor_limit", visitorLimitMessages[bucket], headers);
  }
  // Daily cap, or limits unavailable: either way the agent rests for now.
  return apiError(
    429,
    "daily_limit",
    "I'm out of breath for today. Here's how to reach Binit directly.",
    headers,
  );
}
