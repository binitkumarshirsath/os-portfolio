"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, type ReactNode } from "react";
import type { UiAction } from "@/shared/config/ui-actions";
import { profile } from "@/shared/content";
import { agentChat } from "../model/agent-chat";
import { describeChatError } from "../model/chat-error";
import { useChatQuota } from "../model/chat-quota";
import { connectToolRunner } from "../model/tool-action-bridge";
import { ChatComposer } from "./chat-composer";
import { ChatErrorNotice } from "./chat-error-notice";
import { ChatMessage, ThinkingIndicator } from "./chat-message";
import { QuotaMeter } from "./quota-meter";

type AgentChatPanelProps = {
  /** Suggestion chips, supplied by whoever composes the chat (the quick-actions feature). */
  suggestions: ReactNode;
  /** Runs a UI action: tool-chip taps, and the "Contact Binit" way out on errors. */
  onUiAction: (action: UiAction) => void;
  /**
   * Run the agent's tool calls as they arrive. On for the desktop, where windows
   * open beside the chat; off on phones, where a panel would cover the answer.
   */
  runToolsAutomatically: boolean;
  /** Extra control in the input row, supplied by another feature (the JD paperclip). */
  composerAccessory?: ReactNode;
  /** Decorative scenery pinned to the bottom of the conversation area, behind it. */
  backdrop?: ReactNode;
};

export function AgentChatPanel({
  suggestions,
  onUiAction,
  runToolsAutomatically,
  composerAccessory,
  backdrop,
}: AgentChatPanelProps) {
  const { messages, sendMessage, regenerate, status, error } = useChat({
    chat: agentChat,
  });
  const remaining = useChatQuota((state) => state.remaining);
  const endRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const isBusy = status === "submitted" || status === "streaming";
  const isOutOfQuota = remaining === 0;
  const chatError = describeChatError(error);
  const hasMessages = messages.length > 0;
  useEffect(() => {
    if (runToolsAutomatically) return connectToolRunner(onUiAction);
  }, [runToolsAutomatically, onUiAction]);

  // Follow the conversation as it grows: new messages, streamed tokens, and answers
  // still being revealed word by word after the stream itself has finished.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const follow = new ResizeObserver(() =>
      endRef.current?.scrollIntoView({ block: "end" }),
    );
    follow.observe(list);
    return () => follow.disconnect();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [status]);

  return (
    <div className="flex h-full flex-col">
      {/* The backdrop stays put while the conversation scrolls over it. */}
      <div className="relative min-h-0 flex-1">
        {backdrop && (
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0">
            {backdrop}
          </div>
        )}
        <div className="relative h-full space-y-4 overflow-y-auto p-4">
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
            ref={listRef}
            aria-live="polite"
            aria-busy={isBusy}
            aria-label="Conversation"
            className="space-y-4"
          >
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isStreaming={isBusy && index === messages.length - 1}
                onUiAction={onUiAction}
              />
            ))}
          </ul>
          {status === "submitted" && <ThinkingIndicator />}
          {chatError && (
            <ChatErrorNotice
              error={chatError}
              onShowContact={() => onUiAction({ type: "showContact" })}
              onRetry={() => regenerate()}
            />
          )}
          <div ref={endRef} />
        </div>
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
          accessory={composerAccessory}
        />
        <QuotaMeter />
      </div>
    </div>
  );
}
