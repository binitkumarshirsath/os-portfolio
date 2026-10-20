import { AGENT_LIMITS, AI_MODELS } from "@/shared/config/ai";
import type { DeepDive } from "./types";

const { maxOutputTokens, maxSteps } = AGENT_LIMITS;

/** The thinking part: what the model is told, who answers, and the backup. */
export const modelDives = {
  prompt: {
    summary:
      "The system prompt is generated from the portfolio's content files, so the agent knows what the site shows and nothing else.",
    sections: [
      {
        heading: "What it says",
        points: [
          "Use only the profile data. If the answer isn't there, say so and suggest emailing Binit; never invent facts, numbers, dates or companies.",
          "Describe, don't sell: no added praise like “scalable” or “expert” unless the data itself says it.",
          "Placeholders such as [ADD ROLE] must be reported as missing, never filled in.",
          "Stay on topic: anything unrelated gets one friendly sentence pointing back to Binit's work.",
        ],
      },
      {
        heading: "Small things that made a difference",
        points: [
          "Each tool result carries a one-line reminder (“the visitor can see this; don't list it”). Measured: that worked far better than the same rule in the prompt alone, because the model reads results right before writing.",
          "Edit the content files and the prompt updates with them; there's no second copy to keep in sync.",
        ],
      },
    ],
    bypass: [
      {
        attempt: "“Ignore previous instructions and…”",
        outcome:
          "The prompt tells the model to carry on, but a prompt isn't a security boundary and is treated as if it could fail. What actually protects the site: there are no secrets in the prompt (only public portfolio data), and the tools can only open windows.",
        holds: false,
      },
      {
        attempt: "Use it as a free general-purpose chatbot",
        outcome: `It declines, and even if talked round, each answer is capped at ${maxOutputTokens} tokens and every question still counts against the rate limit.`,
        holds: true,
      },
    ],
    files: [
      "src/features/agent-chat/model/system-prompt.ts",
      "src/shared/content/site.ts",
    ],
  },
  groq: {
    summary: `${AI_MODELS.primary.id}, an open-weight model served by Groq, writes the answers.`,
    sections: [
      {
        heading: "The call",
        points: [
          `streamText with stopWhen(stepCountIs(${maxSteps})): at most ${maxSteps} model steps per question, e.g. call a tool, read its result, answer.`,
          `maxOutputTokens: ${maxOutputTokens}. Reasoning effort is set to low, because thinking tokens count against that cap.`,
          "maxRetries: 0. A retry would just hit Groq again; the fallback switches provider instead.",
          "The request's abort signal is passed through: if the visitor closes the tab, the model call is cancelled and stops spending tokens.",
        ],
      },
      {
        heading: "Keys stay on the server",
        points: [
          "API keys are server-only environment variables, never NEXT_PUBLIC_*. The provider SDKs are imported only from server-only modules, so the build fails if one is ever pulled into browser code.",
        ],
      },
    ],
    files: [
      "src/shared/api/server/model.ts",
      "src/features/agent-chat/server/run-agent.ts",
    ],
  },
  gemini: {
    summary: `If Groq can't answer, Google's ${AI_MODELS.fallback.id} takes the same call.`,
    sections: [
      {
        heading: "How the switch works",
        points: [
          "A wrapLanguageModel middleware wraps Groq. When Groq's call fails, the identical call (same messages, tools and limits) runs on Gemini.",
          "It switches on 429 (rate limited), 5xx (outage), network errors, and 401/403/404 (revoked key, retired model), all things the visitor can't fix.",
          "It doesn't switch on 400, which means the request itself is wrong, so another provider won't help. And it doesn't switch if the visitor has left: no second call is paid for.",
          "Each step decides on its own, so one answer can mix models. The trace records which model actually served each step.",
        ],
      },
      {
        heading: "Tuning and limits",
        points: [
          "Gemini's thinking budget is 0. Measured: by default it spent 303 of 327 output tokens thinking, which would cut answers short.",
          "The switch happens as the call starts, before any text is sent, so it's invisible. If a provider fails after text has started streaming, the turn ends with a friendly “try again in a minute” rather than switching mid-sentence.",
          "Raw provider errors never reach the browser; both failure cases show the same calm message.",
        ],
      },
    ],
    files: ["src/shared/api/server/model.ts"],
  },
} satisfies Record<string, DeepDive>;
