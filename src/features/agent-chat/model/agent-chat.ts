import { Chat } from "@ai-sdk/react";
import { DefaultChatTransport, generateId, type UIMessage } from "ai";

export type AgentMessageMetadata = {
  /** "quick-action" answers were written locally from content; no model was called. */
  source: "quick-action" | "model";
};

export type AgentMessage = UIMessage<AgentMessageMetadata>;

/**
 * The one conversation on the page. It lives at module scope, not in a component,
 * so it survives the chat view unmounting (closing the window, switching tabs).
 * Components subscribe to it with useChat({ chat: agentChat }).
 */
export const agentChat = new Chat<AgentMessage>({
  transport: new DefaultChatTransport({ api: "/api/chat" }),
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
