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

export const JD_MATCH_LIMITS = {
  /** Text beyond this is cut off; a full JD is usually 3–8k characters. */
  maxJobDescriptionChars: 12_000,
  /** Anything shorter is unlikely to be a real job description. */
  minJobDescriptionChars: 200,
  /** 2 MB: plenty for a text JD, well under the hosting body limit. */
  maxFileBytes: 2 * 1024 * 1024,
  /** A structured report is longer than a chat answer. */
  maxOutputTokens: 1_500,
  /** The window shows the most relevant few, not an exhaustive audit. */
  maxMatches: 8,
  maxGaps: 5,
} as const;
