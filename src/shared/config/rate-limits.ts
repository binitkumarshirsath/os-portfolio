/**
 * Rate limits for everything that calls a model. Shared by the API routes
 * (enforcement) and the UI (quota meters), so they can't drift apart.
 */
export const RATE_LIMITS = {
  /**
   * Chat questions per visitor (hashed IP), sliding window. Recruiters rarely type
   * more than a handful; 20 leaves room to explore while one visitor can still only
   * take about a twelfth of the daily budget below.
   */
  chat: { requests: 20, window: "1 h" },
  /**
   * Job-description matches per visitor. Each one sends a whole JD to the model, so
   * it costs several chat questions' worth of tokens; 3 an hour is plenty for a
   * recruiter comparing a couple of roles.
   */
  jdMatch: { requests: 3, window: "1 h" },
  /**
   * Across all visitors and all features, fixed window. One agent turn can make
   * ~3 model calls, so this keeps the site under the providers' free-tier daily limits.
   */
  daily: { requests: 250, window: "1 d" },
} as const;

/** The per-visitor limits; the daily cap applies on top of whichever one is used. */
export type RateLimitBucket = "chat" | "jdMatch";

export const RATE_LIMIT_HEADERS = {
  remaining: "X-RateLimit-Remaining",
  /** Unix time in ms when the visitor's window frees up again. */
  reset: "X-RateLimit-Reset",
} as const;

/** Error codes the API returns as JSON, so the UI can show the right friendly state. */
export type ApiErrorCode =
  | "invalid_request"
  | "unsupported_file"
  | "visitor_limit"
  | "daily_limit"
  | "model_unavailable";
