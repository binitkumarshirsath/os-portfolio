import type { AgentTrace, TraceSpan } from "@/entities/agent-trace";
import { formatCount, formatDuration, shortModelName } from "./format";

/** Spans shorter than this still get a visible, hoverable mark. */
const MIN_MARK_PX = 4;

const percent = (value: number, total: number) => `${(value / total) * 100}%`;

function describe(span: TraceSpan): string {
  const detail = span.kind === "model" ? shortModelName(span.detail) : span.detail;
  const tokens =
    span.kind === "model"
      ? `, ${formatCount(span.inputTokens ?? 0)} tokens in, ${formatCount(span.outputTokens ?? 0)} out`
      : "";
  return `${span.name} ${detail}: ${formatDuration(span.endMs - span.startMs)}, from ${formatDuration(span.startMs)}${tokens}`;
}

function SpanRow({ span, totalMs }: { span: TraceSpan; totalMs: number }) {
  const isModel = span.kind === "model";
  const detail = isModel ? shortModelName(span.detail) : span.detail;

  return (
    // Focusable so keyboard users get the same tooltip as a hover.
    <li tabIndex={0} aria-label={describe(span)} className="group relative outline-none">
      <div className="flex items-baseline justify-between gap-2 font-mono text-[11px]">
        <span className="min-w-0 truncate">
          {span.name} <span className="text-fg-muted">{detail}</span>
        </span>
        <span className="shrink-0 text-fg-muted tabular-nums">
          {formatDuration(span.endMs - span.startMs)}
        </span>
      </div>
      <div className="relative mt-1 h-3">
        <div aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-line" />
        <div
          aria-hidden
          className={`absolute top-1/2 -translate-y-1/2 ${
            isModel ? "h-2.5 rounded-sm bg-fg" : "h-1.5 rounded-full bg-accent"
          } group-focus-visible:ring-2 group-focus-visible:ring-accent`}
          style={{
            left: percent(span.startMs, totalMs),
            width: `max(${MIN_MARK_PX}px, ${percent(span.endMs - span.startMs, totalMs)})`,
          }}
        />
      </div>
      <p
        aria-hidden
        className="pointer-events-none absolute bottom-full left-0 z-10 mb-1 w-full rounded-sm border border-line-strong bg-raised px-2 py-1.5 font-mono text-[10px] leading-relaxed opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {describe(span)}
      </p>
    </li>
  );
}

/**
 * A horizontal span timeline, like a trace view in an observability tool:
 * one row per span, bars positioned by start time and sized by duration.
 * Each row also prints its name and duration, so it reads as a table too.
 */
export function SpanTimeline({ trace }: { trace: AgentTrace }) {
  const totalMs = Math.max(trace.totalMs, 1);

  return (
    <div className="space-y-3">
      <ol aria-label="Spans" className="space-y-2.5">
        {trace.spans.map((span, index) => (
          <SpanRow key={`${span.name}-${index}`} span={span} totalMs={totalMs} />
        ))}
      </ol>
      <div
        aria-hidden
        className="border-t border-line pt-1 font-mono text-[10px] text-fg-muted"
      >
        <div className="flex justify-between tabular-nums">
          <span>0</span>
          <span>{formatDuration(totalMs / 2)}</span>
          <span>{formatDuration(totalMs)}</span>
        </div>
      </div>
      <div className="flex gap-4 font-mono text-[10px] text-fg-muted">
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="h-2.5 w-3 rounded-sm bg-fg" /> model step
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="h-1.5 w-3 rounded-full bg-accent" /> tool call
        </span>
      </div>
    </div>
  );
}
