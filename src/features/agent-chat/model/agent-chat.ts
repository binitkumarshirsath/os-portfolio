import { Chat } from "@ai-sdk/react";
import { DefaultChatTransport, generateId, type UIMessage } from "ai";
import { RATE_LIMIT_HEADERS } from "@/shared/config/rate-limits";
import { useChatQuota } from "./chat-quota";

export type AgentMessageMetadata = {
  /** "quick-action" answers were written locally from content; no model was called. */
  source: "quick-action" | "model";
};

export type AgentMessage = UIMessage<AgentMessageMetadata>;

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

/** Adds a question and a pre-written answer to the conversation without calling the API. */
export function appendLocalExchange(question: string, answer: string): void {
  agentChat.messages = [
    ...agentChat.messages,
    textMessage("user", question, "quick-action"),
    textMessage("assistant", answer, "quick-action"),
  ];
}
