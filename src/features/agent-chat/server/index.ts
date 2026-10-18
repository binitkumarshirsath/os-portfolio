/**
 * Server-only entry for agent-chat, used by app/api/chat/route.ts.
 * Kept apart from the feature's main index so browser code can never
 * import it by accident. Shared server pieces (rate limits, the fallback
 * model, IP hashing) live in shared/api/server.
 */
export { parseChatRequest, type ChatRequestMessage } from "./request-schema";
export { runAgent } from "./run-agent";
