import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { ArchFlowNode, HighlightState } from "../model/to-flow";

const sides = [
  { side: "top", position: Position.Top },
  { side: "right", position: Position.Right },
  { side: "bottom", position: Position.Bottom },
  { side: "left", position: Position.Left },
] as const;

const stateClass: Record<HighlightState, string> = {
  active: "border-accent shadow-[0_0_0_4px_var(--color-accent-tint)]",
  dim: "border-line-strong opacity-40",
  idle: "border-line-strong",
};

/**
 * One part of the system, drawn like a paper card. Dashed means "only sometimes"
 * (a shortcut or a limit), matching the dashed arrows that lead to it.
 */
export function ArchNodeCard({ data }: NodeProps<ArchFlowNode>) {
  return (
    <div
      className={`w-[220px] rounded-md border bg-surface px-3.5 py-3 transition-[opacity,border-color,box-shadow] duration-300 ${
        data.tone === "muted" ? "border-dashed" : ""
      } ${stateClass[data.state]}`}
    >
      {/* Every side can start or end an arrow; the graph picks the sides that face each other. */}
      {sides.map(({ side, position }) => (
        <Handle key={`s-${side}`} id={side} type="source" position={position} />
      ))}
      {sides.map(({ side, position }) => (
        <Handle key={`t-${side}`} id={`in-${side}`} type="target" position={position} />
      ))}
      <p className="flex items-center gap-2 font-display text-[15px] leading-snug font-semibold text-fg">
        {data.tone === "accent" && (
          <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-accent" />
        )}
        {data.title}
      </p>
      <p className="mt-1 font-mono text-[11px] leading-4 break-words text-fg-muted">
        {data.caption}
      </p>
    </div>
  );
}
