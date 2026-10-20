import { formatCount, formatDuration, type AgentTrace } from "@/entities/agent-trace";

function StatTile({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="min-w-0 rounded-sm border border-line bg-raised px-2.5 py-2">
      <p className="text-[11px] text-fg-muted">{label}</p>
      <p className="font-sans text-lg font-semibold tabular-nums">{value}</p>
      {note && (
        <p className="font-mono text-[10px] leading-tight text-fg-muted">{note}</p>
      )}
    </div>
  );
}

/** The three headline numbers: how long, how much, how many actions. */
export function TraceStats({ trace }: { trace: AgentTrace }) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      <StatTile label="Latency" value={formatDuration(trace.totalMs)} />
      <StatTile
        label="Tokens"
        value={formatCount(trace.inputTokens + trace.outputTokens)}
        note={`${formatCount(trace.inputTokens)} in · ${formatCount(trace.outputTokens)} out`}
      />
      <StatTile label="Tool calls" value={String(trace.toolCalls)} />
    </div>
  );
}
