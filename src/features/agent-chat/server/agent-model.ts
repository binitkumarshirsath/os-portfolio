import "server-only";
import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import { APICallError, wrapLanguageModel } from "ai";
import { AI_MODELS } from "@/shared/config/ai";

const primary = groq(AI_MODELS.primary.id);
const fallback = google(AI_MODELS.fallback.id);

/**
 * Both models "think" before answering, and thinking tokens count against the
 * 400-token output cap. Measured: Gemini Flash spent 303 of 327 tokens thinking
 * by default, which would truncate answers. These settings keep the budget for
 * the visible answer. Each provider only reads its own key.
 */
export const agentProviderOptions = {
  groq: { reasoningEffort: "low" },
  google: { thinkingConfig: { thinkingBudget: 0 } },
};

/**
 * Worth trying the other provider: rate limits (429), outages (5xx), network
 * failures, and Groq-side config problems (401/403/404: revoked key, retired model)
 * that the visitor can't fix. A 400 means our request is wrong, so it isn't retried.
 */
function shouldFallBack(error: unknown, signal: AbortSignal | undefined): boolean {
  if (signal?.aborted) return false; // the visitor left; don't spend a second call
  if (!APICallError.isInstance(error)) return true; // network error: no HTTP status at all
  const status = error.statusCode ?? 0;
  return status === 429 || status >= 500 || [401, 403, 404].includes(status);
}

const label = (model: { provider: string; modelId: string }) =>
  `${model.provider}/${model.modelId}`;

/**
 * One model that is Groq first and Gemini second. The switch happens inside the
 * model call, before any text reaches the visitor, so a fallback is invisible
 * apart from the server log. It runs per agent step, so each step gets a retry.
 */
export const agentModel = wrapLanguageModel({
  model: primary,
  middleware: {
    specificationVersion: "v3",
    wrapStream: async ({ doStream, params }) => {
      try {
        const result = await doStream();
        console.info(`[agent] step served by ${label(primary)}`);
        return result;
      } catch (error) {
        if (!shouldFallBack(error, params.abortSignal)) throw error;
        const reason = APICallError.isInstance(error) ? error.statusCode : "network";
        console.warn(`[agent] ${label(primary)} failed (${reason}); falling back`);
        const result = await fallback.doStream(params);
        console.info(`[agent] step served by ${label(fallback)}`);
        return result;
      }
    },
  },
});
