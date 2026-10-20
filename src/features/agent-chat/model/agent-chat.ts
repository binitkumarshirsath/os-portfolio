import { Chat } from "@ai-sdk/react";
import { DefaultChatTransport, generateId, type UIMessage } from "ai";
import { saveLastTurn, type AgentTrace } from "@/entities/agent-trace";
import { RATE_LIMIT_HEADERS } from "@/shared/config/rate-limits";
import type { AgentTools } from "./agent-tools";
import { useChatQuota } from "./chat-quota";
import { runToolCall } from "./tool-action-bridge";

export type AgentMessageMetadata = {
  /**
   * "quick-action": written locally from content, no model call.
   * "jd-match": a summary of a job-match report, whose full version is in its window.
   */
  source: "quick-action" | "jd-match" | "model";
  /** Model answers only: how the turn went, for the Activity Monitor. */
  trace?: AgentTrace;
};

export type AgentMessage = UIMessage<AgentMessageMetadata, never, AgentTools>;

/** Wraps fetch so every chat response updates the quota meter from its header. */
async function fetchAndTrackQuota(input: RequestInfo | URL, init?: RequestInit) {
  const response = await fetch(input, init);
  const remaining = response.headers.get(RATE_LIMIT_HEADERS.remaining);
  if (remaining !== null) useChatQuota.getState().setRemaining(Number(remaining));
  return response;
}

/**
 * The one conversation on the page. It lives at module scope, not in a component,
 * so it survives the chat view unmounting (closing the window, switching tabs).
 * Components subscribe to it with useChat({ chat: agentChat }).
 */
export const agentChat = new Chat<AgentMessage>({
  transport: new DefaultChatTransport({ api: "/api/chat", fetch: fetchAndTrackQuota }),
  // Fires as soon as a tool's input has streamed in, so a window can open while
  // the model is still writing the answer that goes with it.
  onToolCall: ({ toolCall }) => runToolCall(toolCall),
  // Keep the finished turn (question + trace) so the architecture page can replay it.
  onFinish: ({ message, messages }) => {
    const trace = message.metadata?.trace;
    const question = messages.findLast((m) => m.role === "user");
    if (!trace || !question) return;
    const text = question.parts
      .map((part) => (part.type === "text" ? part.text : ""))
      .join("");
    saveLastTurn({ question: text, trace });
  },
});

function textMessage(
  role: "user" | "assistant",
  text: string,
  source: AgentMessageMetadata["source"],
): AgentMessage {
  return {
    id: generateId(),
    role,
    parts: [{ type: "text", text }],
    metadata: { source },
  };
}

/** Adds a question and an already-known answer to the conversation without calling the chat API. */
export function appendLocalExchange(
  question: string,
  answer: string,
  source: Exclude<AgentMessageMetadata["source"], "model"> = "quick-action",
): void {
  agentChat.messages = [
    ...agentChat.messages,
    textMessage("user", question, source),
    textMessage("assistant", answer, source),
  ];
}
