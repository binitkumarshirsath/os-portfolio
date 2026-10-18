/**
 * Server-only building blocks shared by every route that calls a model:
 * the Groq → Gemini fallback model, per-visitor and daily rate limits,
 * IP hashing, and the JSON error shape the UI understands.
 */
export { fallbackModel, modelProviderOptions } from "./model";
export { checkRateLimit, getRemainingQuota, type RateLimitOutcome } from "./rate-limit";
export { visitorIdFrom } from "./visitor-id";
export { apiError, rateLimitHeaders, rateLimitedResponse } from "./responses";
