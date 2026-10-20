import { AGENT_LIMITS, AI_MODELS } from "@/shared/config/ai";
import { AGENT_TOOL_NAMES } from "@/shared/config/agent-tools";
import { RATE_LIMITS } from "@/shared/config/rate-limits";
import type { ArchNodeId } from "./graph";

/** One stop on a tour of the diagram: what lights up, and what to say about it. */
export type Step = {
  id: string;
  title: string;
  /** For anyone, recruiters included. */
  plain: string;
  /** For engineers, shown on request. */
  technical: string;
  nodeIds: readonly ArchNodeId[];
  edgeIds: readonly string[];
  /** How long autoplay stays on this step. */
  durationMs: number;
};

// Long enough to read the plain text at a relaxed pace.
const READ_MS = 5_500;

const step = (s: Omit<Step, "durationMs">): Step => ({ ...s, durationMs: READ_MS });

/** The guided tour: one question's journey, from the chat box to the answer. */
export const walkthroughSteps: readonly Step[] = [
  step({
    id: "ask",
    title: "You ask a question",
    plain:
      "A recruiter types anything into the chat. Nothing is scripted: the question goes to the server as written.",
    technical:
      "useChat from the Vercel AI SDK posts the conversation to /api/chat and reads the reply as a stream.",
    nodeIds: ["visitor"],
    edgeIds: [],
  }),
  step({
    id: "quick",
    title: "The shortcut: quick actions",
    plain:
      "The suggested chips skip the AI completely. Their answers are written from the portfolio data, so they're instant, free and always accurate.",
    technical:
      "A chip runs the same typed UiAction an agent tool call maps to; one runner executes both.",
    nodeIds: ["visitor", "quick", "ui"],
    edgeIds: ["visitor-quick", "quick-ui"],
  }),
  step({
    id: "check",
    title: "The server checks the request",
    plain: `Before anything else, the server makes sure the message is well formed and short (${AGENT_LIMITS.maxMessageChars} characters at most).`,
    technical:
      "A Next.js route handler validates the body with a Zod schema, then the AI SDK validates the messages and tool parts.",
    nodeIds: ["visitor", "route"],
    edgeIds: ["visitor-route"],
  }),
  step({
    id: "limit",
    title: "Rate limiting keeps it fair",
    plain: `Each visitor can ask ${RATE_LIMITS.chat.requests} questions an hour, and the whole site ${RATE_LIMITS.daily.requests} a day. Past that, a friendly notice appears and no AI is called, so costs can't run away.`,
    technical:
      "Upstash Redis: a sliding window per visitor plus a fixed daily cap. Visitors are keyed by a salted SHA-256 hash of the IP, never the IP itself.",
    nodeIds: ["route", "limiter", "blocked"],
    edgeIds: ["route-limiter", "limiter-blocked"],
  }),
  step({
    id: "prompt",
    title: "Instructions for the model",
    plain:
      "The model is given a brief written from this portfolio's own content and told to answer only from it, so it doesn't make things up.",
    technical: `Only the last ${AGENT_LIMITS.maxHistoryMessages} messages are sent. Each turn is capped at ${AGENT_LIMITS.maxSteps} steps and ${AGENT_LIMITS.maxOutputTokens} output tokens.`,
    nodeIds: ["limiter", "prompt"],
    edgeIds: ["limiter-prompt"],
  }),
  step({
    id: "groq",
    title: "Groq writes the answer",
    plain: `A large open model (${AI_MODELS.primary.id}) running on Groq's fast inference hardware reads the question and writes the reply.`,
    technical: `streamText with stopWhen(stepCountIs(${AGENT_LIMITS.maxSteps})) and low reasoning effort, so thinking doesn't eat the token budget.`,
    nodeIds: ["prompt", "groq"],
    edgeIds: ["prompt-groq"],
  }),
  step({
    id: "fallback",
    title: "A backup if Groq is busy",
    plain:
      "If Groq is rate-limited or down, Google's Gemini takes over the same request before any text is sent. The visitor never sees an error.",
    technical:
      "A wrapLanguageModel middleware catches 429s, 5xx and network errors and replays the call on Gemini. Every step gets its own chance to fall back.",
    nodeIds: ["groq", "gemini"],
    edgeIds: ["groq-gemini"],
  }),
  step({
    id: "tools",
    title: "The agent can act, not just talk",
    plain:
      "The model can ask the page to do things: open a window, show a project, download the resume or show contact details. Your browser carries them out.",
    technical: `Typed tools (${AGENT_TOOL_NAMES.join(", ")}). The server only acknowledges a call; the browser maps it to a UiAction and runs it.`,
    nodeIds: ["groq", "gemini", "tools", "ui"],
    edgeIds: ["groq-tools", "gemini-tools", "tools-ui"],
  }),
  step({
    id: "stream",
    title: "The answer streams in",
    plain:
      "The reply is sent word by word as it's written, so it starts appearing almost at once instead of after a long wait.",
    technical:
      "toUIMessageStreamResponse streams UI message parts; message metadata carries the turn's trace.",
    nodeIds: ["groq", "gemini", "answer"],
    edgeIds: ["groq-answer", "gemini-answer"],
  }),
  step({
    id: "trace",
    title: "Every turn is traced",
    plain:
      "Each model step and tool call is timed and counted, then drawn in the Activity Monitor, like the observability dashboards Binit builds at work.",
    technical:
      "Spans are recorded from the AI SDK's step and tool-call hooks, with OpenTelemetry-style names, and sent with the final message.",
    nodeIds: ["answer", "trace"],
    edgeIds: ["answer-trace"],
  }),
];
