/**
 * One agent turn as a trace: what the server did between receiving a question
 * and finishing its answer. Recorded on the server, sent to the browser as
 * message metadata, drawn by the Activity Monitor. Plain data, no tracing library.
 */
export type TraceSpan = {
  kind: "model" | "tool";
  /** "llm.step" or "tool.<name>", in the style of OpenTelemetry span names. */
  name: string;
  /** For model steps, the model that actually answered; for tools, the arguments. */
  detail: string;
  /** Milliseconds since the request arrived. */
  startMs: number;
  endMs: number;
  inputTokens?: number;
  outputTokens?: number;
};

export type AgentTrace = {
  /** Wall-clock time the turn started, for display. */
  startedAt: number;
  totalMs: number;
  inputTokens: number;
  outputTokens: number;
  toolCalls: number;
  /** Ordered by start time. Tool spans sit inside the model step that called them. */
  spans: TraceSpan[];
};
