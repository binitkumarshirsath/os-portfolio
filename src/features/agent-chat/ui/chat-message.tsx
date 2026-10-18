import { motion } from "motion/react";
import type { AgentMessage } from "../model/agent-chat";

function messageText(message: AgentMessage): string {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("")
    .trim();
}

export function ChatMessage({ message }: { message: AgentMessage }) {
  const isUser = message.role === "user";
  const isInstant = message.metadata?.source === "quick-action";

  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}
    >
      <span className="font-mono text-[11px] text-fg-muted">
        {isUser ? "you" : "assistant"}
        {!isUser && isInstant && (
          <span className="text-accent-text"> · instant, no model call</span>
        )}
      </span>
      <p
        className={`max-w-[92%] rounded-sm border p-3 text-sm leading-relaxed whitespace-pre-line ${
          isUser ? "border-accent-deep bg-accent-tint" : "border-line bg-raised"
        }`}
      >
        {messageText(message)}
      </p>
    </motion.li>
  );
}
