import { AI_MODELS, AGENT_LIMITS } from "@/shared/config/ai";

/**
 * How this site works, in plain sentences. The "How was this agent built?"
 * quick action and the agent's system prompt both read this, so the site
 * always describes itself the same way.
 */
export const siteArchitecture = [
  "Built with Next.js, React, TypeScript and Tailwind CSS, organised with Feature-Sliced Design.",
  `The agent runs on the Vercel AI SDK: Groq's ${AI_MODELS.primary.id} answers first, and Google ${AI_MODELS.fallback.id} takes over if Groq is rate-limited or down.`,
  "It uses tool calling: the model asks to open a window or show a project, and the browser runs that action — the trace chips in the chat show each call.",
  `Each turn is capped at ${AGENT_LIMITS.maxSteps} steps and ${AGENT_LIMITS.maxOutputTokens} output tokens, and the API route rate-limits per visitor and per day with Upstash Redis.`,
  "Quick actions like this one never call a model: they run the same UI actions locally and answer from the portfolio data, so they're instant and free.",
  "Recruiters can share a job description (PDF, DOCX, TXT or pasted): the server extracts the text and one structured-output call returns a fit report with evidence for each match and honest gaps. The JD is never stored.",
  "The Activity Monitor shows each agent turn as a trace — model steps, tool calls, latency and tokens — a nod to Binit's observability work.",
] as const;
