/**
 * Model choices and agent limits, in one place so they are easy to swap.
 * Plain constants only — provider clients are created in the API route,
 * which keeps API keys and SDK code out of the browser bundle.
 */

export const AI_MODELS = {
  primary: { provider: "groq", id: "openai/gpt-oss-120b" },
  // The "latest" alias tracks Google's current Flash model on the free tier.
  fallback: { provider: "google", id: "gemini-flash-latest" },
} as const;

export const AGENT_LIMITS = {
  maxOutputTokens: 400,
  maxSteps: 3,
  maxMessageChars: 500,
  /** Only the most recent messages are sent to the model, to cap cost. */
  maxHistoryMessages: 6,
} as const;
