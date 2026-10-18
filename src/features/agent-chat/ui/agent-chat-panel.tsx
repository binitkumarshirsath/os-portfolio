"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, type ReactNode } from "react";
import { profile } from "@/shared/content";
import { agentChat } from "../model/agent-chat";
import { describeChatError } from "../model/chat-error";
import { useChatQuota } from "../model/chat-quota";
import { ChatComposer } from "./chat-composer";
import { ChatErrorNotice } from "./chat-error-notice";
import { ChatMessage, ThinkingIndicator } from "./chat-message";
import { QuotaMeter } from "./quota-meter";

type AgentChatPanelProps = {
  /** Suggestion chips, supplied by whoever composes the chat (the quick-actions feature). */
  suggestions: ReactNode;
  /** Shown as the way out when the agent can't answer. */
  onShowContact: () => void;
};

export function AgentChatPanel({ suggestions, onShowContact }: AgentChatPanelProps) {
  const { messages, sendMessage, regenerate, status, error } = useChat({
    chat: agentChat,
  });
  const remaining = useChatQuota((state) => state.remaining);
  const endRef = useRef<HTMLDivElement>(null);

  const isBusy = status === "submitted" || status === "streaming";
  const isOutOfQuota = remaining === 0;
  const chatError = describeChatError(error);
  const hasMessages = messages.length > 0;
  // Changes on every streamed token, so the view follows a growing answer.
  const lastMessageSize = JSON.stringify(messages.at(-1)?.parts ?? []).length;

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, lastMessageSize, status]);

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
        {/* aria-busy holds announcements until a streamed answer is complete. */}
        <ul
          aria-live="polite"
          aria-busy={isBusy}
          aria-label="Conversation"
          className="space-y-4"
        >
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </ul>
        {status === "submitted" && <ThinkingIndicator />}
        {chatError && (
          <ChatErrorNotice
            error={chatError}
            onShowContact={onShowContact}
            onRetry={() => regenerate()}
          />
        )}
        <div ref={endRef} />
      </div>

      {hasMessages && (
        // Afterwards they move to a single scrolling row above the input.
        <div className="overflow-x-auto border-t border-line px-3 py-2 [&_ul]:flex-nowrap">
          {suggestions}
        </div>
      )}

      <div className="space-y-2 border-t border-line p-3">
        <ChatComposer
          canSend={!isBusy && !isOutOfQuota}
          placeholder={
            isOutOfQuota
              ? "Hourly limit reached; the chips still work"
              : "Ask about his work…"
          }
          onSend={(text) => sendMessage({ text })}
        />
        <QuotaMeter />
      </div>
    </div>
  );
}
