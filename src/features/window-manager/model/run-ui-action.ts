import type { UiAction } from "@/shared/config/ui-actions";
import { profile } from "@/shared/content";
import { useWindowStore } from "./window-store";

function downloadResume() {
  // A synthetic <a download> click: unlike window.open, browsers don't treat it as a
  // popup, so it also works when the agent triggers it after a network round trip.
  const link = document.createElement("a");
  link.href = profile.resumeHref;
  link.download = "";
  // Browsers that ignore `download` (iOS Safari) open the PDF instead; a new tab keeps
  // the site. No popup risk: desktop browsers honour `download`, and on phones the agent's
  // tools only run from a tap on their chip.
  link.target = "_blank";
  link.rel = "noreferrer";
  link.click();
}

/** The one place UI actions run — for quick actions now, and agent tool calls later. */
export function runUiAction(action: UiAction): void {
  const { openWindow, showProject } = useWindowStore.getState();

  switch (action.type) {
    case "openWindow":
      return openWindow(action.windowId);
    case "showProject":
      return showProject(action.slug);
    case "showContact":
      return openWindow("contact");
    case "openResume":
      return downloadResume();
  }
}
