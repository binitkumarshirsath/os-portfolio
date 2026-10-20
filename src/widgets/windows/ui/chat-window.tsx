"use client";

import { AgentChatPanel, appendLocalExchange } from "@/features/agent-chat";
import { JdAttachButton } from "@/features/jd-match";
import { QuickActionChips, type QuickAction } from "@/features/quick-actions";
import { runUiAction } from "@/features/window-manager";
import { useIsDesktop } from "@/shared/lib";
import { matchJobDescription } from "../model/match-job-description";
import { ChatScenery } from "./chat-scenery";

// The two features don't know about each other; this is where they meet.
function handleQuickAction(quickAction: QuickAction) {
  appendLocalExchange(quickAction.question, quickAction.answer);
  runUiAction(quickAction.action);
}

export function ChatWindow() {
  // Unknown (null) during hydration counts as "not desktop": nothing auto-runs by accident.
  const isDesktop = useIsDesktop() === true;

  return (
    <AgentChatPanel
      suggestions={<QuickActionChips onSelect={handleQuickAction} />}
      onUiAction={runUiAction}
      runToolsAutomatically={isDesktop}
      composerAccessory={<JdAttachButton onMatch={matchJobDescription} />}
      backdrop={<ChatScenery withSun={!isDesktop} />}
    />
  );
}
