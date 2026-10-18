"use client";

import { AgentChatPanel, appendLocalExchange } from "@/features/agent-chat";
import { QuickActionChips, type QuickAction } from "@/features/quick-actions";
import { runUiAction } from "@/features/window-manager";

// The two features don't know about each other; this is where they meet.
function handleQuickAction(quickAction: QuickAction) {
  appendLocalExchange(quickAction.question, quickAction.answer);
  runUiAction(quickAction.action);
}

const showContact = () => runUiAction({ type: "showContact" });

export function ChatWindow() {
  return (
    <AgentChatPanel
      suggestions={<QuickActionChips onSelect={handleQuickAction} />}
      onShowContact={showContact}
    />
  );
}
