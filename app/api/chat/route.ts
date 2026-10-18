import { RATE_LIMITS } from "@/shared/config/rate-limits";
import {
  chatError,
  checkRateLimit,
  getRemainingQuota,
  parseChatRequest,
  rateLimitedResponse,
  rateLimitHeaders,
  runAgent,
  visitorIdFrom,
} from "@/features/agent-chat/server";

// Long enough for a 3-step agent turn to finish streaming on Vercel.
export const maxDuration = 30;

/**
 * The only door to the model. Cheapest checks run first, so abuse is turned
 * away before it costs anything: validate (free) → rate limit (one Redis call)
 * → model.
 */
export async function POST(request: Request) {
  // TODO(turnstile): verify a Cloudflare Turnstile token here, before anything else,
  // if bots start getting past the rate limits.

  const parsed = parseChatRequest(await request.text());
  if (!parsed.ok) return chatError(400, "invalid_request", parsed.message);

  const outcome = await checkRateLimit(visitorIdFrom(request.headers));
  if (!outcome.allowed) return rateLimitedResponse(outcome);

  return runAgent({
    messages: parsed.messages,
    headers: rateLimitHeaders(outcome),
    abortSignal: request.signal,
  });
}

/** The visitor's remaining quota, for the chat meter. Doesn't count as a question. */
export async function GET(request: Request) {
  const remaining = await getRemainingQuota(visitorIdFrom(request.headers));
  return Response.json(
    { remaining, limit: RATE_LIMITS.perVisitor.requests },
    { headers: { "Cache-Control": "no-store" } },
  );
}
