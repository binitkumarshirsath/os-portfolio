import { MarkerType, Position, type Edge, type Node } from "@xyflow/react";
import { archEdges, archNodes, positions, type ArchNode, type Layout } from "./graph";

export type HighlightState = "active" | "dim" | "idle";

export type ArchFlowNode = Node<
  Pick<ArchNode, "title" | "caption" | "tone"> & {
    state: HighlightState;
    isOpen: boolean;
  },
  "arch"
>;

export type FlowEdgeType = Edge<
  { state: HighlightState; dashed: boolean; text?: string },
  "flow"
>;

type Highlight = { nodeIds: readonly string[]; edgeIds: readonly string[] } | null;

const stateOf = (id: string, activeIds: readonly string[] | undefined): HighlightState =>
  !activeIds ? "idle" : activeIds.includes(id) ? "active" : "dim";

/** Picks the sides of two boxes that face each other, so arrows leave and enter cleanly. */
function facingSides(from: { x: number; y: number }, to: { x: number; y: number }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0
      ? { sourceHandle: Position.Right, targetHandle: `in-${Position.Left}` }
      : { sourceHandle: Position.Left, targetHandle: `in-${Position.Right}` };
  }
  return dy >= 0
    ? { sourceHandle: Position.Bottom, targetHandle: `in-${Position.Top}` }
    : { sourceHandle: Position.Top, targetHandle: `in-${Position.Bottom}` };
}

/**
 * The diagram in React Flow's shapes, lit up for the current step (or not, for
 * the overview), with the box whose deep dive is open marked.
 */
export function toFlow(layout: Layout, highlight: Highlight, openId: string | null) {
  const place = positions[layout];

  const nodes: ArchFlowNode[] = archNodes.map(({ id, title, caption, tone }) => ({
    id,
    type: "arch",
    position: place[id],
    data: {
      title,
      caption,
      tone,
      state: stateOf(id, highlight?.nodeIds),
      isOpen: id === openId,
    },
  }));

  const edges: FlowEdgeType[] = archEdges.map(({ id, source, target, label, dashed }) => {
    const state = stateOf(id, highlight?.edgeIds);
    return {
      id,
      source,
      target,
      type: "flow",
      ...facingSides(place[source], place[target]),
      // Active arrows draw above the rest, so a lit path is never hidden behind a dim one.
      zIndex: state === "active" ? 1 : 0,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 16,
        height: 16,
        color: state === "active" ? "var(--color-accent)" : "var(--color-line-strong)",
      },
      data: { state, dashed: dashed ?? false, text: label },
    };
  });

  return { nodes, edges };
}
