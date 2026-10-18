import type { UiAction } from "@/shared/config/ui-actions";
import { isOpenableWindowId, isProjectSlug } from "./tool-targets";

type ToolCall = { toolName: string; input: unknown };

const field = (input: unknown, key: string): unknown =>
  typeof input === "object" && input !== null && key in input
    ? (input as Record<string, unknown>)[key]
    : undefined;

/**
 * Maps a tool call onto the UiAction the rest of the site already knows how to
 * run. Inputs are re-checked here because they arrive from the model via the
 * network; anything unexpected is ignored rather than trusted.
 */
export function toolCallToUiAction({ toolName, input }: ToolCall): UiAction | null {
  switch (toolName) {
    case "openWindow": {
      const windowId = field(input, "windowId");
      return isOpenableWindowId(windowId) ? { type: "openWindow", windowId } : null;
    }
    case "showProject": {
      const slug = field(input, "slug");
      return isProjectSlug(slug) ? { type: "showProject", slug } : null;
    }
    case "openResume":
      return { type: "openResume" };
    case "showContact":
      return { type: "showContact" };
    default:
      return null;
  }
}
