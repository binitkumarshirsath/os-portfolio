"use client";

import "@xyflow/react/dist/base.css";
import "./flow.css";
import { Background, BackgroundVariant, ReactFlow, useReactFlow } from "@xyflow/react";
import { useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef } from "react";
import { isArchNodeId, type ArchNodeId, type Layout } from "../model/graph";
import type { Step } from "../model/steps";
import { toFlow } from "../model/to-flow";
import { ArchNodeCard } from "./arch-node";
import { FlowEdge } from "./flow-edge";

const nodeTypes = { arch: ArchNodeCard };
const edgeTypes = { flow: FlowEdge };

type CameraProps = {
  nodeIds: readonly string[] | undefined;
  /** The box whose deep dive is open, and how much of the canvas the panel covers. */
  focus: { id: string; coveredPx: number } | null;
};

/**
 * Moves the view like a guide pointing: to the current step's boxes, to the box
 * being read about (in the part the panel leaves visible), or to everything.
 */
function CameraFollow({ nodeIds, focus }: CameraProps) {
  const { fitBounds, getNodes, getNodesBounds, getZoom, setCenter } = useReactFlow();
  const reduceMotion = useReducedMotion();
  const isFirstRun = useRef(true);
  const key = nodeIds?.join(",") ?? "";
  const focusId = focus?.id;
  const coveredPx = focus?.coveredPx ?? 0;

  useEffect(() => {
    // The fitView prop frames the first render, before nodes are measured.
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    const duration = reduceMotion ? 0 : 800;
    if (focusId) {
      const box = getNodesBounds([focusId]);
      const zoom = Math.max(getZoom(), 0.9);
      // Shift right by half the covered width, so the box centres in what's still visible.
      void setCenter(
        box.x + box.width / 2 - coveredPx / 2 / zoom,
        box.y + box.height / 2,
        {
          zoom,
          duration,
        },
      );
      return;
    }
    // fitBounds rather than fitView: fitView is queued until the next nodes update,
    // which here may never come, so the camera would sit still.
    const bounds = getNodesBounds(key ? key.split(",") : getNodes());
    void fitBounds(bounds, { duration, padding: key ? 0.35 : 0.08 });
  }, [
    key,
    focusId,
    coveredPx,
    fitBounds,
    getNodes,
    getNodesBounds,
    getZoom,
    setCenter,
    reduceMotion,
  ]);

  return null;
}

type FlowCanvasProps = {
  layout: Layout;
  step: Step | null;
  openId: ArchNodeId | null;
  /** Width of the canvas hidden under the deep-dive panel; null when it covers everything. */
  panelCoversPx: number | null;
  onOpen: (id: ArchNodeId) => void;
};

/** The architecture diagram. Boxes open their deep dive; they can't be moved or connected. */
export function FlowCanvas({
  layout,
  step,
  openId,
  panelCoversPx,
  onOpen,
}: FlowCanvasProps) {
  const { nodes, edges } = useMemo(
    () => toFlow(layout, step, openId),
    [layout, step, openId],
  );

  return (
    <ReactFlow
      className="arch-flow"
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      fitViewOptions={{ padding: 0.08 }}
      minZoom={0.25}
      maxZoom={1.2}
      nodesDraggable={false}
      nodesConnectable={false}
      nodesFocusable={false}
      edgesFocusable={false}
      elementsSelectable={false}
      onNodeClick={(_, node) => isArchNodeId(node.id) && onOpen(node.id)}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={22}
        size={1.2}
        color="var(--color-line-strong)"
      />
      <CameraFollow
        nodeIds={step?.nodeIds}
        // A panel covering the whole canvas (phones) leaves nothing to aim at.
        focus={
          openId && panelCoversPx !== null
            ? { id: openId, coveredPx: panelCoversPx }
            : null
        }
      />
    </ReactFlow>
  );
}
