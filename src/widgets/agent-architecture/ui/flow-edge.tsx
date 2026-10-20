import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from "@xyflow/react";
import { useReducedMotion } from "motion/react";
import type { FlowEdgeType } from "../model/to-flow";

/** An arrow that, while its step is active, carries a moving dot: the request in transit. */
export function FlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  data,
}: EdgeProps<FlowEdgeType>) {
  const reduceMotion = useReducedMotion();
  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 14,
  });
  const state = data?.state ?? "idle";
  const isActive = state === "active";

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        markerEnd={markerEnd}
        style={{
          stroke: isActive ? "var(--color-accent)" : "var(--color-line-strong)",
          strokeWidth: isActive ? 2 : 1.5,
          strokeDasharray: data?.dashed ? "6 5" : undefined,
          opacity: state === "dim" ? 0.45 : 1,
          transition: "stroke 300ms, opacity 300ms",
        }}
      />
      {isActive && !reduceMotion && (
        <circle r={4.5} className="fill-accent">
          <animateMotion dur="1.6s" repeatCount="indefinite" path={path} />
        </circle>
      )}
      {data?.text && (
        <EdgeLabelRenderer>
          <span
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
            className={`pointer-events-none absolute rounded-sm bg-background px-1.5 py-0.5 font-mono text-[10px] whitespace-nowrap transition-opacity duration-300 ${
              isActive ? "text-accent-text" : "text-fg-muted"
            } ${state === "dim" ? "opacity-40" : ""}`}
          >
            {data.text}
          </span>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
