"use client";

import { useLatestTrace } from "@/features/agent-chat";
import { TraceMonitor } from "@/features/trace-monitor";

export function ActivityWindow() {
  const { trace, isRunning } = useLatestTrace();
  return <TraceMonitor trace={trace} isRunning={isRunning} />;
}
