import { motion } from "motion/react";
import type { AgentMessage } from "../model/agent-chat";
import { MessageText } from "./message-text";

function messageText(message: AgentMessage): string {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("")
    .trim();
}

export function ChatMessage({ message }: { message: AgentMessage }) {
  const isUser = message.role === "user";
  const isInstant = message.metadata?.source === "quick-action";
  const text = messageText(message);

  // A streaming answer has no text until its first token; the thinking dots cover that gap.
  if (!text) return null;

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
        <MessageText text={text} />
      </p>
    </motion.li>
  );
}

/** Shown between sending and the first streamed token. */
export function ThinkingIndicator() {
  return (
    <div className="space-y-1" aria-label="Assistant is thinking" role="status">
      <p className="font-mono text-[11px] text-fg-muted">assistant · thinking</p>
      <div className="flex w-fit gap-1 rounded-sm border border-line bg-raised px-3 py-3.5">
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            aria-hidden
            className="size-1.5 rounded-full bg-accent"
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1, repeat: Infinity, delay: dot * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}
