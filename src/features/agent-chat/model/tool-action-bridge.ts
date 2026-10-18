import type { UiAction } from "@/shared/config/ui-actions";
import { toolCallToUiAction } from "./tool-call-to-ui-action";

type Runner = (action: UiAction) => void;

let runner: Runner | null = null;

/**
 * The chat lives at module scope, but running a UI action is the page's job.
 * Whoever renders the chat connects a runner while it's on screen; with none
 * connected (e.g. on mobile, where tools become tap-to-open chips), tool calls
 * are simply shown, not run. Returns a disconnect function for effect cleanup.
 */
export function connectToolRunner(nextRunner: Runner): () => void {
  runner = nextRunner;
  return () => {
    if (runner === nextRunner) runner = null;
  };
}

export function runToolCall(toolCall: { toolName: string; input: unknown }): void {
  const action = toolCallToUiAction(toolCall);
  if (action && runner) runner(action);
}
