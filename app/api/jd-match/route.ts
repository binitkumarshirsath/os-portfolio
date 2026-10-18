import {
  apiError,
  checkRateLimit,
  getRemainingQuota,
  rateLimitedResponse,
  visitorIdFrom,
} from "@/shared/api/server";
import { JD_MATCH_LIMITS } from "@/shared/config/ai";
import { RATE_LIMITS } from "@/shared/config/rate-limits";
import { matchJobDescription, readJobDescription } from "@/features/jd-match/server";

// A structured report from a full JD can take a while on the fallback model.
export const maxDuration = 60;

/** Room for the multipart envelope around a maximum-size file. */
const MAX_REQUEST_BYTES = JD_MATCH_LIMITS.maxFileBytes + 64 * 1024;

/**
 * Compares a job description with Binit's profile. Same order as the chat:
 * check and read the input (no model cost) → rate limit → one model call.
 */
export async function POST(request: Request) {
  // TODO(turnstile): verify a Cloudflare Turnstile token here once bots appear.

  const declaredSize = Number(request.headers.get("content-length") ?? 0);
  if (declaredSize > MAX_REQUEST_BYTES) {
    return apiError(
      413,
      "unsupported_file",
      "That file is over 2 MB. Try pasting the text instead.",
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return apiError(400, "invalid_request", "Send the job description as a form upload.");
  }

  const input = await readJobDescription(form);
  if (!input.ok) return apiError(400, input.code, input.message);

  const outcome = await checkRateLimit(visitorIdFrom(request.headers), "jdMatch");
  if (!outcome.allowed) return rateLimitedResponse(outcome, "jdMatch");

  try {
    const report = await matchJobDescription(input.text, request.signal);
    return Response.json({
      report,
      label: input.label,
      truncated: input.truncated,
      remaining: outcome.remaining,
    });
  } catch (error) {
    console.error("[jd-match] report failed", error);
    return apiError(
      503,
      "model_unavailable",
      "The matcher is out of breath right now. Try again in a minute, or reach Binit directly.",
    );
  }
}

/** Matches left this hour, for the window's counter. Doesn't use one up. */
export async function GET(request: Request) {
  const remaining = await getRemainingQuota(visitorIdFrom(request.headers), "jdMatch");
  return Response.json(
    { remaining, limit: RATE_LIMITS.jdMatch.requests },
    { headers: { "Cache-Control": "no-store" } },
  );
}
