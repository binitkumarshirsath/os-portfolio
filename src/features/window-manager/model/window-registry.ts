import {
  Activity,
  BriefcaseBusiness,
  FolderGit2,
  Layers,
  Mail,
  MessageSquareText,
  UserRound,
  type LucideIcon,
} from "lucide-react";

// Ids live in shared/config so the server (tool schemas) can use them without UI code.
import { WINDOW_IDS, type WindowId } from "@/shared/config/windows";

export { WINDOW_IDS, type WindowId };

/** Where a window first appears on desktop: px from the top-right of the desktop area. */
type DesktopFrame = {
  top: number;
  right: number;
  /** px, or a CSS length for windows that should grow with the screen. */
  width: number | string;
  height: number;
};

export type WindowDefinition = {
  title: string;
  icon: LucideIcon;
  /** Project Detail opens from a project, so it has no dock button of its own. */
  inDock: boolean;
  /** Set for the four windows that are bottom tabs on mobile; the rest open as panels. */
  mobileTab?: string;
  frame: DesktopFrame;
};

// Two columns anchored to the right, so the hero on the left stays visible at 1024px.
// The chat owns the left column (24px margin + 320px column + 12px gap = 356px).
// Everything else opens in the right column with a small cascade, so a window opened
// from the chat never covers the answer that opened it.
export const windowRegistry: Record<WindowId, WindowDefinition> = {
  chat: {
    title: "Ask Binit",
    icon: MessageSquareText,
    inDock: true,
    mobileTab: "Ask",
    // Fills the gap between the hero and the right column, between 320px and 440px.
    // --hero-end is set by the desktop to where the hero text stops.
    frame: {
      top: 40,
      right: 356,
      width: "clamp(320px, calc(100% - 356px - var(--hero-end)), 440px)",
      height: 560,
    },
  },
  projects: {
    title: "Projects",
    icon: FolderGit2,
    inDock: true,
    mobileTab: "Work",
    frame: { top: 24, right: 24, width: 320, height: 560 },
  },
  "project-detail": {
    title: "Project",
    icon: FolderGit2,
    inDock: false,
    frame: { top: 32, right: 24, width: 320, height: 600 },
  },
  experience: {
    title: "Experience",
    icon: BriefcaseBusiness,
    inDock: true,
    mobileTab: "Experience",
    frame: { top: 44, right: 24, width: 320, height: 560 },
  },
  skills: {
    title: "Skills",
    icon: Layers,
    inDock: true,
    frame: { top: 56, right: 24, width: 320, height: 480 },
  },
  about: {
    title: "About",
    icon: UserRound,
    inDock: true,
    frame: { top: 68, right: 24, width: 320, height: 520 },
  },
  contact: {
    title: "Contact",
    icon: Mail,
    inDock: true,
    mobileTab: "Contact",
    frame: { top: 80, right: 24, width: 320, height: 340 },
  },
  activity: {
    title: "Activity Monitor",
    icon: Activity,
    inDock: true,
    frame: { top: 92, right: 24, width: 320, height: 420 },
  },
};

export const DOCK_WINDOW_IDS = WINDOW_IDS.filter((id) => windowRegistry[id].inDock);

export const MOBILE_TAB_IDS = WINDOW_IDS.filter((id) => isMobileTab(id));

export function isMobileTab(id: WindowId): boolean {
  return windowRegistry[id].mobileTab !== undefined;
}
