/**
 * agent-trace — the shape of one agent turn's trace (spans, timings, tokens).
 * Lives in entities so the chat (which produces traces) and the Activity
 * Monitor (which draws them) can share it without importing each other.
 */
export type { AgentTrace, TraceSpan } from "./model/agent-trace";
