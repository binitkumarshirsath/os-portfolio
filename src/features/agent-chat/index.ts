/**
 * agent-chat — the "Ask Binit" conversation.
 * Owns the single module-level Chat (so history survives unmounts), renders it,
 * and lets other code append local question/answer pairs without calling the API.
 * Streaming from /api/chat and tool calls arrive in Phases 6–7.
 */
export { AgentChatPanel } from "./ui/agent-chat-panel";
export {
  agentChat,
  appendLocalExchange,
  type AgentMessage,
  type AgentMessageMetadata,
} from "./model/agent-chat";
