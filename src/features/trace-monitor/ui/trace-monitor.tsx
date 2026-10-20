import { shortModelName, type AgentTrace } from "@/entities/agent-trace";
import { AI_MODELS } from "@/shared/config/ai";
import { SpanTimeline } from "./span-timeline";
import { TraceStats } from "./trace-stats";

const sectionLabel = "font-mono text-[11px] tracking-[0.18em] text-fg-muted uppercase";

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

type TraceMonitorProps = {
  trace: AgentTrace | null;
  isRunning: boolean;
};

/** Which model answered, and whether the fallback had to step in. */
function servedBy(trace: AgentTrace): string {
  const models = [
    ...new Set(trace.spans.filter((s) => s.kind === "model").map((s) => s.detail)),
  ];
  const fellBack = models.some((model) => model !== AI_MODELS.primary.id);
  const names = models.map(shortModelName).join(" + ");
  return fellBack ? `${names} · Groq was busy, so Gemini answered` : names;
}

/**
 * The Activity Monitor: the last agent turn as a trace. A small nod to the
 * observability dashboards Binit builds, using the same vocabulary (spans,
 * latency, a timeline) for the agent on this page.
 */
export function TraceMonitor({ trace, isRunning }: TraceMonitorProps) {
  if (!trace) {
    return (
      <div className="grid h-full place-items-center p-6 text-center">
        <div className="space-y-2">
          <p className="font-mono text-xs text-accent-text">
            {isRunning ? "recording the first trace…" : "no traces yet"}
          </p>
          <p className="max-w-xs text-sm text-fg-muted">
            Ask the agent something and a timeline of that turn (model steps, tool calls,
            latency and tokens) shows up here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className={sectionLabel}>Last agent turn</h3>
        <p
          className="font-mono text-[11px] text-fg-muted tabular-nums"
          aria-live="polite"
        >
          {isRunning ? (
            <span className="text-accent-text">
              <span className="animate-pulse">●</span> running
            </span>
          ) : (
            timeFormat.format(trace.startedAt)
          )}
        </p>
      </div>

      <TraceStats trace={trace} />

      <p className="font-mono text-[11px] text-fg-muted">served by {servedBy(trace)}</p>

      <section aria-label="Span timeline" className="space-y-2">
        <h3 className={sectionLabel}>Spans</h3>
        <SpanTimeline trace={trace} />
      </section>

      <p className="text-xs leading-relaxed text-fg-muted">
        Span names follow OpenTelemetry style. Tool calls sit inside the model step that
        made them; the server only acknowledges them, and the browser opens the window.
      </p>
    </div>
  );
}
