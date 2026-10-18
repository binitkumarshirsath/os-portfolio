/**
 * agent-chat — the "Ask Binit" conversation.
 * Owns the single module-level Chat (so history survives unmounts), renders it,
 * and lets other code append local question/answer pairs without calling the API.
 * Streams answers from /api/chat; server-side code lives behind ./server.
 */
export { AgentChatPanel } from "./ui/agent-chat-panel";
export { useAgentStatus, type AgentStatus } from "./model/use-agent-status";
export {
  agentChat,
  appendLocalExchange,
  type AgentMessage,
  type AgentMessageMetadata,
} from "./model/agent-chat";
