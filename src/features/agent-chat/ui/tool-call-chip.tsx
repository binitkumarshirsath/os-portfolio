import { getToolName, type DynamicToolUIPart, type ToolUIPart } from "ai";
import type { UiAction } from "@/shared/config/ui-actions";
import type { AgentTools } from "../model/agent-tools";
import { toolCallToUiAction } from "../model/tool-call-to-ui-action";

type ToolPart = ToolUIPart<AgentTools> | DynamicToolUIPart;

type ToolCallChipProps = {
  part: ToolPart;
  onUiAction: (action: UiAction) => void;
};

/** `showProject("devflow")`: arguments printed like a function call, as in a ReAct trace. */
function formatCall(name: string, input: unknown): string {
  const values = typeof input === "object" && input !== null ? Object.values(input) : [];
  return `${name}(${values.map((value) => JSON.stringify(value)).join(", ")})`;
}

/**
 * One tool call, shown above the answer it led to. It's a button so the visitor
 * can re-run it (reopen a window they closed), and on phones it's the only way
 * the action runs, since auto-opening would pull them out of the chat.
 */
export function ToolCallChip({ part, onUiAction }: ToolCallChipProps) {
  const name = getToolName(part);
  const isPending = part.state === "input-streaming";
  const isFailed = part.state === "output-error";
  const action = isPending
    ? null
    : toolCallToUiAction({ toolName: name, input: part.input });

  return (
    <button
      type="button"
      disabled={!action}
      onClick={() => action && onUiAction(action)}
      className="inline-flex items-center gap-1.5 rounded-sm border border-line-strong bg-background px-2 py-1 font-mono text-[11px] text-accent-text transition-colors hover:border-accent disabled:cursor-default disabled:hover:border-line-strong"
    >
      <span
        aria-hidden
        className={`size-1.5 rounded-full ${
          isFailed
            ? "bg-fg-muted"
            : isPending
              ? "animate-pulse bg-accent-text"
              : "bg-accent"
        }`}
      />
      {isPending ? `${name}(…)` : formatCall(name, part.input)}
    </button>
  );
}
