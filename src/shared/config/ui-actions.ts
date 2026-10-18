import type { ProjectSlug } from "@/shared/content";
import type { WindowId } from "./windows";

/**
 * Something the site can do to its own UI. Quick actions describe themselves
 * with these, and the agent's tool calls map onto exactly the same shapes,
 * so one runner (in window-manager) executes both.
 */
export type UiAction =
  | { type: "openWindow"; windowId: WindowId }
  | { type: "showProject"; slug: ProjectSlug }
  | { type: "openResume" }
  | { type: "showContact" };
