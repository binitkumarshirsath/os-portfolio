import { AGENT_LIMITS } from "@/shared/config/ai";
import { RATE_LIMITS } from "@/shared/config/rate-limits";
import type { DeepDive } from "./types";

const { chat, daily } = RATE_LIMITS;

/** The way in: the chat, its no-AI shortcut, and the server's first checks. */
export const requestDives = {
  visitor: {
    summary:
      "The chat is a Vercel AI SDK client talking to exactly one endpoint, /api/chat.",
    sections: [
      {
        heading: "How it works",
        points: [
          "The conversation lives in one Chat instance at module scope, so it survives closing the chat window or switching tabs on a phone.",
          "Each question POSTs the conversation; the reply streams back as message parts: text, tool calls and metadata.",
          "A wrapped fetch reads X-RateLimit-Remaining from every response, so the quota meter stays exact with no extra request. One GET on page load fills it in for returning visitors and doesn't count as a question.",
        ],
      },
      {
        heading: "What the browser doesn't decide",
        points: [
          `The ${AGENT_LIMITS.maxMessageChars}-character limit on the input is a convenience; the server checks it again. Nothing the browser sends can change the model, the token cap or the tools.`,
        ],
      },
    ],
    files: [
      "src/features/agent-chat/model/agent-chat.ts",
      "src/features/agent-chat/model/chat-quota.ts",
    ],
  },
  quick: {
    summary: "The suggestion chips answer without any network request at all.",
    sections: [
      {
        heading: "How it works",
        points: [
          "A chip appends its question and a pre-written answer to the conversation locally. The answers are built from the same content files as the windows, so they can't disagree.",
          "Each chip carries a typed UiAction (open a window, show a project, download the resume) and runs through the same runUiAction as the agent's tool calls. One code path, two triggers.",
          "Cost: zero tokens and zero quota. They keep working when the hourly or daily limit is reached.",
        ],
      },
    ],
    files: [
      "src/features/quick-actions/model/quick-actions.ts",
      "src/features/window-manager/model/run-ui-action.ts",
    ],
  },
  route: {
    summary:
      "One route handler is the only door to the model, and it runs the cheapest checks first.",
    sections: [
      {
        heading: "Order of checks",
        points: [
          "Validate (free) → rate limit (one Redis round trip) → model. Abuse is turned away before it costs anything.",
          `A body over ${AGENT_LIMITS.maxBodyChars.toLocaleString("en")} characters is refused before JSON.parse runs.`,
          `A Zod schema then requires 1–${AGENT_LIMITS.maxMessages} messages: questions are text only, at most ${AGENT_LIMITS.maxMessageChars} characters; earlier answers at most ${AGENT_LIMITS.maxAssistantChars.toLocaleString("en")}; and the last message must be a non-blank question.`,
          `Only the last ${AGENT_LIMITS.maxHistoryMessages} messages go to the model, whatever the client sends.`,
          "The AI SDK's validateUIMessages then checks tool parts against each tool's own schema.",
        ],
      },
    ],
    bypass: [
      {
        attempt: "Skip the site and call the API directly",
        outcome:
          "Same route, same checks, same limits. The site's own UI has no special access.",
        holds: true,
      },
      {
        attempt: "Send a 10,000-word question",
        outcome: "400 invalid_request. It never reaches the rate limiter or the model.",
        holds: true,
      },
      {
        attempt: "Hide text in a non-text part to dodge the length check",
        outcome:
          'Every part typed "text" is counted, and no other part may claim that type.',
        holds: true,
      },
      {
        attempt: "Forge earlier assistant turns to steer the model",
        outcome:
          "Possible, as with any stateless chat API: the client owns the history. Forged turns are length-capped, only the most recent ones are sent, and the model has nothing secret to leak and no harmful tool to call.",
        holds: false,
      },
    ],
    files: ["app/api/chat/route.ts", "src/features/agent-chat/server/request-schema.ts"],
  },
  limiter: {
    summary: `Two limits backed by Upstash Redis: ${chat.requests} questions an hour per visitor, and a hard ceiling of ${daily.requests} model requests a day for the whole site.`,
    sections: [
      {
        heading: "Two limits, in order",
        points: [
          `Per visitor: ${chat.requests} questions per hour, as a sliding window.`,
          `Whole site: ${daily.requests} requests per day, as a fixed window on one shared key. Chat questions and job matches both count.`,
          "The visitor limit is checked first, so someone who's already blocked can't use up everyone else's daily budget.",
        ],
      },
      {
        heading: "Who counts as a visitor",
        points: [
          "The key is a SHA-256 hash of a secret salt plus the IP address. Raw IPs never reach Redis, and the salt stops anyone reversing a hash by hashing all 4 billion IPv4 addresses.",
          "The IP is the first entry of x-forwarded-for. On Vercel the platform sets that header itself, replacing any value the client sent.",
          "Nothing is kept in cookies or localStorage, so there's nothing on the client to reset.",
        ],
      },
      {
        heading: "Details that matter",
        points: [
          `Why a sliding window: a fixed hourly window would allow ${chat.requests} questions at 10:59 and ${chat.requests} more at 11:00. The sliding window weighs in the previous window, so bursts at the boundary don't double the limit.`,
          "Each check runs as a single Lua script inside Redis, so it's atomic: fifty parallel requests can't all read “one left” and slip through together.",
          "It fails closed. If Redis is unreachable, or its keys are missing in production, requests are refused, because without a counter there's no limit. Only local development runs without it.",
        ],
      },
    ],
    bypass: [
      {
        attempt: "Clear cookies, go incognito, switch browser",
        outcome: "Same IP, same bucket. The count lives on the server.",
        holds: true,
      },
      {
        attempt: "Send a fake X-Forwarded-For header",
        outcome:
          "Vercel overwrites it with the real client IP, so you can't choose your own bucket.",
        holds: true,
      },
      {
        attempt: "Fire many requests at the same moment",
        outcome: "Counting is atomic in Redis; everything past the limit gets a 429.",
        holds: true,
      },
      {
        attempt: "Rotate IPs with VPNs, proxies or a botnet",
        outcome: `This does buy more per-visitor buckets. That's what the daily cap is for: however many IPs are used, the site makes at most ${daily.requests} model requests a day, so the bill has a hard ceiling. A Cloudflare Turnstile check is the next step if bots ever show up, and the route has a marked place for it.`,
        holds: false,
      },
    ],
    files: [
      "src/shared/api/server/rate-limit.ts",
      "src/shared/api/server/visitor-id.ts",
      "src/shared/config/rate-limits.ts",
    ],
  },
  blocked: {
    summary: "Being refused is designed as a normal state, not an error page.",
    sections: [
      {
        heading: "How it works",
        points: [
          "A refusal is HTTP 429 with a stable code (visitor_limit or daily_limit), plus Retry-After and X-RateLimit-* headers.",
          "The chat maps each code to a message written for a recruiter: the hourly limit “frees up again within the hour”; the daily one points to ways of reaching Binit directly.",
          "It promises no exact minutes, because with a sliding window the reset Upstash reports is the end of its internal bucket, not the moment the next request is allowed.",
          "Quick actions and every window keep working, since they never needed the model.",
          "People sharing one office IP share one bucket. That's the accepted trade-off for not needing accounts.",
        ],
      },
    ],
    files: [
      "src/shared/api/server/responses.ts",
      "src/features/agent-chat/model/chat-error.ts",
    ],
  },
} satisfies Record<string, DeepDive>;
