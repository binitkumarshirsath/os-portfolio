import { AGENT_LIMITS, AI_MODELS } from "@/shared/config/ai";
import { AGENT_TOOL_NAMES } from "@/shared/config/agent-tools";
import { RATE_LIMITS } from "@/shared/config/rate-limits";

/**
 * The agent's architecture as boxes and arrows. Numbers and names come from the
 * same config the API route enforces, so the diagram can't drift from the code.
 */
export type ArchNodeId =
  | "visitor"
  | "quick"
  | "route"
  | "limiter"
  | "blocked"
  | "prompt"
  | "groq"
  | "gemini"
  | "tools"
  | "ui"
  | "answer"
  | "trace";

export type ArchNode = {
  id: ArchNodeId;
  /** Short and plain, for anyone. */
  title: string;
  /** One line under the title; the technical name of the thing. */
  caption: string;
  tone?: "accent" | "muted";
};

export type ArchEdge = {
  id: string;
  source: ArchNodeId;
  target: ArchNodeId;
  label?: string;
  /** Paths that only happen sometimes: shortcuts, limits, fallbacks. */
  dashed?: boolean;
};

export type Layout = "wide" | "tall";

export const archNodes: readonly ArchNode[] = [
  {
    id: "visitor",
    title: "You ask a question",
    caption: "chat in the browser",
    tone: "accent",
  },
  { id: "quick", title: "Quick actions", caption: "pre-written, no AI", tone: "muted" },
  { id: "route", title: "Server checks it", caption: "Next.js route · Zod" },
  {
    id: "limiter",
    title: "Rate limiter",
    caption: `${RATE_LIMITS.chat.requests}/hour each · ${RATE_LIMITS.daily.requests}/day total`,
  },
  {
    id: "blocked",
    title: "Friendly limit notice",
    caption: "no AI call, no cost",
    tone: "muted",
  },
  { id: "prompt", title: "Instructions", caption: "system prompt from portfolio data" },
  { id: "groq", title: "Groq", caption: AI_MODELS.primary.id, tone: "accent" },
  { id: "gemini", title: "Gemini (backup)", caption: AI_MODELS.fallback.id },
  { id: "tools", title: "Tools", caption: AGENT_TOOL_NAMES.join(" · ") },
  { id: "ui", title: "Your screen reacts", caption: "windows open, resume downloads" },
  {
    id: "answer",
    title: "Streamed answer",
    caption: `≤ ${AGENT_LIMITS.maxOutputTokens} tokens, word by word`,
  },
  { id: "trace", title: "Activity Monitor", caption: "timings, tokens, tool calls" },
];

export const archEdges: readonly ArchEdge[] = [
  {
    id: "visitor-quick",
    source: "visitor",
    target: "quick",
    label: "tap a chip",
    dashed: true,
  },
  {
    id: "quick-ui",
    source: "quick",
    target: "ui",
    label: "same actions, no AI",
    dashed: true,
  },
  { id: "visitor-route", source: "visitor", target: "route", label: "question" },
  { id: "route-limiter", source: "route", target: "limiter" },
  {
    id: "limiter-blocked",
    source: "limiter",
    target: "blocked",
    label: "over limit",
    dashed: true,
  },
  { id: "limiter-prompt", source: "limiter", target: "prompt", label: "allowed" },
  { id: "prompt-groq", source: "prompt", target: "groq" },
  {
    id: "groq-gemini",
    source: "groq",
    target: "gemini",
    label: "busy or down",
    dashed: true,
  },
  { id: "groq-tools", source: "groq", target: "tools", label: "tool call" },
  { id: "gemini-tools", source: "gemini", target: "tools" },
  { id: "tools-ui", source: "tools", target: "ui", label: "browser runs it" },
  { id: "groq-answer", source: "groq", target: "answer" },
  { id: "gemini-answer", source: "gemini", target: "answer" },
  { id: "answer-trace", source: "answer", target: "trace", label: "spans" },
];

export const isArchNodeId = (id: string): id is ArchNodeId =>
  archNodes.some((node) => node.id === id);

const COL = 280;
const ROW = 170;

/**
 * Hand-placed rather than auto-laid-out: twelve nodes don't need a layout
 * library, and placing them keeps the main path on one straight line.
 */
export const positions: Record<Layout, Record<ArchNodeId, { x: number; y: number }>> = {
  // Left to right, main path along the middle row.
  wide: {
    visitor: { x: 0, y: ROW },
    quick: { x: COL, y: 0 },
    route: { x: COL, y: ROW },
    limiter: { x: COL * 2, y: ROW },
    blocked: { x: COL * 2, y: ROW * 2 },
    prompt: { x: COL * 3, y: ROW },
    groq: { x: COL * 4, y: ROW },
    gemini: { x: COL * 4, y: ROW * 2 },
    tools: { x: COL * 5, y: ROW },
    ui: { x: COL * 5, y: 0 },
    answer: { x: COL * 5, y: ROW * 2 },
    trace: { x: COL * 6, y: ROW * 2 },
  },
  // Top to bottom for phones, main path down the left lane.
  tall: {
    visitor: { x: 0, y: 0 },
    quick: { x: COL, y: 0 },
    route: { x: 0, y: ROW },
    limiter: { x: 0, y: ROW * 2 },
    blocked: { x: COL, y: ROW * 2 },
    prompt: { x: 0, y: ROW * 3 },
    groq: { x: 0, y: ROW * 4 },
    gemini: { x: COL, y: ROW * 4 },
    tools: { x: 0, y: ROW * 5 },
    answer: { x: COL, y: ROW * 5 },
    ui: { x: 0, y: ROW * 6 },
    trace: { x: COL, y: ROW * 6 },
  },
};
