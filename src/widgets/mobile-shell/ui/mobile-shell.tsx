"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { ProfileHero } from "@/entities/profile";
import {
  isMobileTab,
  useWindowStore,
  windowRegistry,
  type WindowId,
} from "@/features/window-manager";
import { usePanelHistory } from "../model/use-panel-history";
import { MobileHeader } from "./mobile-header";
import { TabBar } from "./tab-bar";

type MobileShellProps = {
  bodies: Record<WindowId, ReactNode>;
};

const VIEW_TITLE_ID = "mobile-view-title";

/**
 * Same window store as the desktop, read differently: the top of the stack is
 * the one full-screen view. Tabs swap in place; everything else slides in as a
 * panel on top and is closed with the back button or gesture.
 */
export function MobileShell({ bodies }: MobileShellProps) {
  const stack = useWindowStore((state) => state.stack);
  const focusRequestId = useWindowStore((state) => state.focusRequestId);
  const openWindow = useWindowStore((state) => state.openWindow);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const clearFocusRequest = useWindowStore((state) => state.clearFocusRequest);

  const topId = stack.at(-1) ?? "chat";
  const isPanel = !isMobileTab(topId);
  const activeTab = stack.findLast(isMobileTab) ?? "chat";
  const goBack = usePanelHistory(isPanel ? topId : null);
  const viewRef = useRef<HTMLElement>(null);

  // Move keyboard and screen-reader focus to a view that was opened on purpose.
  useEffect(() => {
    if (focusRequestId !== topId) return;
    viewRef.current?.focus();
    clearFocusRequest();
  }, [focusRequestId, topId, clearFocusRequest]);

  function selectTab(id: WindowId) {
    // A tab is a fresh start: drop any panels stacked on the current one.
    stack.filter((openId) => !isMobileTab(openId)).forEach(closeWindow);
    openWindow(id);
  }

  return (
    <div className="flex h-dvh flex-col">
      <MobileHeader
        title={windowRegistry[topId].title}
        titleId={VIEW_TITLE_ID}
        showBack={isPanel}
        onBack={goBack}
      />
      <main className="relative min-h-0 flex-1 overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.section
            key={topId}
            ref={viewRef}
            tabIndex={-1}
            aria-labelledby={VIEW_TITLE_ID}
            initial={isPanel ? { x: "100%" } : { opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={isPanel ? { x: "100%" } : { opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            // Panels sit above tabs so one sliding out stays visible over the tab behind it.
            className={`absolute inset-0 flex flex-col overflow-y-auto bg-background outline-none ${
              isPanel ? "z-10" : "z-0"
            }`}
          >
            {topId === "chat" && (
              <div className="relative shrink-0 overflow-hidden border-b border-line p-4">
                {/* A small sunset behind the hero, so phones get the signature visual too. */}
                <div
                  aria-hidden
                  className="sun pointer-events-none absolute -top-10 -right-12 size-52 rounded-full opacity-80"
                />
                <div className="relative">
                  <ProfileHero compact />
                </div>
              </div>
            )}
            <div className="min-h-0 flex-1">{bodies[topId]}</div>
          </motion.section>
        </AnimatePresence>
      </main>
      <TabBar activeTab={activeTab} onSelect={selectTab} />
    </div>
  );
}
