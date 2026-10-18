"use client";

import { useChat } from "@ai-sdk/react";
import type { AgentTrace } from "@/entities/agent-trace";
import { agentChat } from "./agent-chat";

/** The most recent model turn's trace, and whether a new turn is in flight. */
export function useLatestTrace(): { trace: AgentTrace | null; isRunning: boolean } {
  const { messages, status } = useChat({ chat: agentChat });
  const trace = messages.findLast((message) => message.metadata?.trace)?.metadata?.trace;
  return {
    trace: trace ?? null,
    isRunning: status === "submitted" || status === "streaming",
  };
}
