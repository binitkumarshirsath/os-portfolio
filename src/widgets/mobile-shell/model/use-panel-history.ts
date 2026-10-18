"use client";

import { useCallback, useEffect } from "react";
import { isMobileTab, useWindowStore, type WindowId } from "@/features/window-manager";

type PanelHistoryState = { binitPanel?: WindowId } | null;

const currentPanelInHistory = () =>
  (window.history.state as PanelHistoryState)?.binitPanel;

/**
 * Makes the phone's back gesture close the open panel instead of leaving the site.
 * Each panel that opens pushes one history entry; going back pops it and closes
 * the panel. Next's router merges its own state into ours, so routing is unaffected.
 * Returns the handler for the on-screen back button, which goes through history too.
 */
export function usePanelHistory(openPanelId: WindowId | null): () => void {
  const closeWindow = useWindowStore((state) => state.closeWindow);

  useEffect(() => {
    if (openPanelId && currentPanelInHistory() !== openPanelId) {
      window.history.pushState({ binitPanel: openPanelId }, "");
    }
  }, [openPanelId]);

  useEffect(() => {
    function onPopState() {
      const topId = useWindowStore.getState().stack.at(-1);
      // Tabs are top-level sections, so back only ever closes panels.
      if (topId && !isMobileTab(topId)) closeWindow(topId);
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [closeWindow]);

  return useCallback(() => {
    if (openPanelId && currentPanelInHistory() === openPanelId) {
      window.history.back(); // popstate above does the closing
    } else if (openPanelId) {
      closeWindow(openPanelId);
    }
  }, [openPanelId, closeWindow]);
}
