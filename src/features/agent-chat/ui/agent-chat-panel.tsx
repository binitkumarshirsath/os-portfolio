"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, type ReactNode } from "react";
import { profile } from "@/shared/content";
import { agentChat } from "../model/agent-chat";
import { ChatMessage } from "./chat-message";

type AgentChatPanelProps = {
  /** Suggestion chips, supplied by whoever composes the chat (the quick-actions feature). */
  suggestions: ReactNode;
};

export function AgentChatPanel({ suggestions }: AgentChatPanelProps) {
  const { messages } = useChat({ chat: agentChat });
  const endRef = useRef<HTMLDivElement>(null);
  const hasMessages = messages.length > 0;

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        <div className="space-y-1">
          <p className="font-mono text-[11px] text-fg-muted">assistant</p>
          <p className="rounded-sm border border-line bg-raised p-3 text-sm leading-relaxed">
            Hi, I&apos;m the assistant on {profile.name}&apos;s portfolio. Ask about his
            projects, his experience, or how this site was built — or pick one below.
          </p>
        </div>
        {/* Before the first exchange the chips sit right under the greeting. */}
        {!hasMessages && suggestions}
        <ul aria-live="polite" aria-label="Conversation" className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </ul>
        <div ref={endRef} />
      </div>

      {hasMessages && (
        // Afterwards they move to a single scrolling row above the input.
        <div className="overflow-x-auto border-t border-line px-3 py-2 [&_ul]:flex-nowrap">
          {suggestions}
        </div>
      )}

      <div className="border-t border-line p-3">
        {/* Free-typed questions go live with the API route in Phase 6. */}
        <input
          disabled
          aria-label="Message"
          placeholder="Typing opens up soon — try a chip above"
          className="h-10 w-full rounded-sm border border-line bg-background px-3 text-sm placeholder:text-fg-muted disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
}
