import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { RATE_LIMITS, type RateLimitBucket } from "@/shared/config/rate-limits";

export type RateLimitOutcome =
  | { allowed: true; remaining: number; reset: number }
  | { allowed: false; reason: "visitor" | "daily" | "unavailable"; reset: number };

function createLimiters() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const redis = new Redis({ url, token });
  const perVisitor = (bucket: RateLimitBucket, prefix: string) =>
    new Ratelimit({
      redis,
      prefix,
      limiter: Ratelimit.slidingWindow(
        RATE_LIMITS[bucket].requests,
        RATE_LIMITS[bucket].window,
      ),
    });

  return {
    // The chat prefix predates JD matching; keeping it keeps existing counters valid.
    perVisitor: {
      chat: perVisitor("chat", "binit-os:visitor"),
      jdMatch: perVisitor("jdMatch", "binit-os:jd"),
    },
    daily: new Ratelimit({
      redis,
      prefix: "binit-os:daily",
      limiter: Ratelimit.fixedWindow(
        RATE_LIMITS.daily.requests,
        RATE_LIMITS.daily.window,
      ),
    }),
  };
}

const isProduction = process.env.NODE_ENV === "production";

// Module scope: built once per server instance, so the warning below prints once.
const limiters = createLimiters();
if (!limiters) {
  console.warn(
    isProduction
      ? "[rate-limit] Upstash env vars missing in production: model requests are refused until they're set."
      : "[rate-limit] Upstash env vars missing: rate limiting is OFF for local development.",
  );
}

/** One shared key: the daily cap is for the whole site, not per visitor. */
const DAILY_KEY = "all-visitors";

export async function checkRateLimit(
  visitorId: string,
  bucket: RateLimitBucket,
): Promise<RateLimitOutcome> {
  if (!limiters) {
    // Fail closed in production: without limits, one script could spend the whole budget.
    return isProduction
      ? { allowed: false, reason: "unavailable", reset: Date.now() }
      : { allowed: true, remaining: RATE_LIMITS[bucket].requests, reset: Date.now() };
  }

  try {
    // Visitor first, so someone already blocked doesn't use up everyone's daily budget.
    const visitor = await limiters.perVisitor[bucket].limit(visitorId);
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
 * How many uses this visitor has left, without using one up. Lets the UI show an
 * accurate meter on page load, before the first request.
 */
export async function getRemainingQuota(
  visitorId: string,
  bucket: RateLimitBucket,
): Promise<number> {
  if (!limiters) return isProduction ? 0 : RATE_LIMITS[bucket].requests;
  try {
    const { remaining } = await limiters.perVisitor[bucket].getRemaining(visitorId);
    return remaining;
  } catch (error) {
    console.error("[rate-limit] Upstash request failed", error);
    return 0;
  }
}
