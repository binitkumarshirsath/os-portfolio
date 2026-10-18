/**
 * Chat rate limits. Shared by the API route (enforcement) and the chat UI
 * (the "7 / 10 messages left this hour" meter), so they can't drift apart.
 */
export const RATE_LIMITS = {
  /** Per visitor (hashed IP), sliding window. */
  perVisitor: { requests: 10, window: "1 h" },
  /**
   * Across all visitors, fixed window. One agent turn can make ~3 model calls,
   * so this keeps the site under the providers' free-tier daily limits.
   */
  daily: { requests: 250, window: "1 d" },
} as const;

export const RATE_LIMIT_HEADERS = {
  remaining: "X-RateLimit-Remaining",
  /** Unix time in ms when the visitor's window frees up again. */
  reset: "X-RateLimit-Reset",
} as const;

/** Error codes the API returns as JSON, so the chat can show the right friendly state. */
export type ChatErrorCode = "invalid_request" | "visitor_limit" | "daily_limit";
