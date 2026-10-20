/**
 * agent-trace — the shape of one agent turn's trace (spans, timings, tokens),
 * and where the latest turn is kept for replay. Lives in entities so the chat
 * (which produces traces) and the views that draw them (Activity Monitor, the
 * architecture page) can share it without importing each other.
 */
export type { AgentTrace, TraceSpan } from "./model/agent-trace";
export { saveLastTurn, useLastTurn, type SavedTurn } from "./model/last-trace";
export { formatCount, formatDuration, shortModelName } from "./lib/format";
