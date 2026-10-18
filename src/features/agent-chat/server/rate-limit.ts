import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { RATE_LIMITS } from "@/shared/config/rate-limits";

export type RateLimitOutcome =
  | { allowed: true; remaining: number; reset: number }
  | { allowed: false; reason: "visitor" | "daily" | "unavailable"; reset: number };

function createLimiters() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const redis = new Redis({ url, token });
  const { perVisitor, daily } = RATE_LIMITS;
  return {
    perVisitor: new Ratelimit({
      redis,
      prefix: "binit-os:visitor",
      limiter: Ratelimit.slidingWindow(perVisitor.requests, perVisitor.window),
    }),
    daily: new Ratelimit({
      redis,
      prefix: "binit-os:daily",
      limiter: Ratelimit.fixedWindow(daily.requests, daily.window),
    }),
  };
}

const isProduction = process.env.NODE_ENV === "production";

// Module scope: built once per server instance, so the warning below prints once.
const limiters = createLimiters();
if (!limiters) {
  console.warn(
    isProduction
      ? "[rate-limit] Upstash env vars missing in production: chat requests are refused until they're set."
      : "[rate-limit] Upstash env vars missing: rate limiting is OFF for local development.",
  );
}

/** One shared key: the daily cap is for the whole site, not per visitor. */
const DAILY_KEY = "all-visitors";

export async function checkRateLimit(visitorId: string): Promise<RateLimitOutcome> {
  if (!limiters) {
    // Fail closed in production: without limits, one script could spend the whole budget.
    return isProduction
      ? { allowed: false, reason: "unavailable", reset: Date.now() }
      : { allowed: true, remaining: RATE_LIMITS.perVisitor.requests, reset: Date.now() };
  }

  try {
    // Visitor first, so someone already blocked doesn't use up everyone's daily budget.
    const visitor = await limiters.perVisitor.limit(visitorId);
    if (!visitor.success)
      return { allowed: false, reason: "visitor", reset: visitor.reset };

    const daily = await limiters.daily.limit(DAILY_KEY);
    if (!daily.success) return { allowed: false, reason: "daily", reset: daily.reset };

    return { allowed: true, remaining: visitor.remaining, reset: visitor.reset };
  } catch (error) {
    // If Redis is unreachable we can't count, so we don't spend: same as the daily cap.
    console.error("[rate-limit] Upstash request failed", error);
    return { allowed: false, reason: "unavailable", reset: Date.now() };
  }
}

/**
 * How many questions this visitor has left, without using one up. Lets the chat
 * show an accurate meter on page load, before the first question is sent.
 */
export async function getRemainingQuota(visitorId: string): Promise<number> {
  if (!limiters) return isProduction ? 0 : RATE_LIMITS.perVisitor.requests;
  try {
    const { remaining } = await limiters.perVisitor.getRemaining(visitorId);
    return remaining;
  } catch (error) {
    console.error("[rate-limit] Upstash request failed", error);
    return 0;
  }
}
