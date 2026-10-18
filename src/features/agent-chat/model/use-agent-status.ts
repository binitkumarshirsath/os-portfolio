"use client";

import { useChat } from "@ai-sdk/react";
import { agentChat } from "./agent-chat";
import { describeChatError } from "./chat-error";
import { useChatQuota } from "./chat-quota";

export type AgentStatus = "ready" | "thinking" | "resting";

/** One word for the menubar dot: is the agent free, busy, or out of budget? */
export function useAgentStatus(): AgentStatus {
  const { status, error } = useChat({ chat: agentChat });
  const remaining = useChatQuota((state) => state.remaining);

  if (status === "submitted" || status === "streaming") return "thinking";
  const code = describeChatError(error)?.code;
  if (remaining === 0 || code === "daily_limit" || code === "model_unavailable") {
    return "resting";
  }
  return "ready";
}
