/**
 * The agent's tool names. The tool definitions (features/agent-chat) must cover
 * exactly these, and the architecture page lists them, so both always agree.
 */
export const AGENT_TOOL_NAMES = [
  "openWindow",
  "showProject",
  "openResume",
  "showContact",
] as const;

export type AgentToolName = (typeof AGENT_TOOL_NAMES)[number];
