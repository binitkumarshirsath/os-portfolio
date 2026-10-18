// Phase 2 stand-in. The real trace view arrives in Phase 8.
export function ActivityWindow() {
  return (
    <div className="grid h-full place-items-center p-6 text-center">
      <div className="space-y-2">
        <p className="font-mono text-xs text-accent-text">no traces yet</p>
        <p className="max-w-xs text-sm text-fg-muted">
          Ask the agent something and a timeline of that turn — model steps, tool calls,
          latency and tokens — shows up here.
        </p>
      </div>
    </div>
  );
}
