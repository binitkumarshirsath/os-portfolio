"use client";

import "@xyflow/react/dist/base.css";
import "./flow.css";
import { Background, BackgroundVariant, ReactFlow, useReactFlow } from "@xyflow/react";
import { useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef } from "react";
import type { Layout } from "../model/graph";
import type { Step } from "../model/steps";
import { toFlow } from "../model/to-flow";
import { ArchNodeCard } from "./arch-node";
import { FlowEdge } from "./flow-edge";

const nodeTypes = { arch: ArchNodeCard };
const edgeTypes = { flow: FlowEdge };

/** Moves the view to the current step's boxes, like a guide pointing; the overview shows everything. */
function CameraFollow({ nodeIds }: { nodeIds: readonly string[] | undefined }) {
  const { fitBounds, getNodes, getNodesBounds } = useReactFlow();
  const reduceMotion = useReducedMotion();
  const isFirstRun = useRef(true);
  const key = nodeIds?.join(",") ?? "";

  useEffect(() => {
    // The fitView prop frames the first render, before nodes are measured.
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    // fitBounds rather than fitView: fitView is queued until the next nodes update,
    // which here may never come, so the camera would sit still.
    const bounds = getNodesBounds(key ? key.split(",") : getNodes());
    void fitBounds(bounds, {
      duration: reduceMotion ? 0 : 800,
      padding: key ? 0.35 : 0.08,
    });
  }, [key, fitBounds, getNodes, getNodesBounds, reduceMotion]);

  return null;
}

type FlowCanvasProps = {
  layout: Layout;
  step: Step | null;
};

/** The architecture diagram. Look-only: boxes can't be moved or connected, but the view pans and zooms. */
export function FlowCanvas({ layout, step }: FlowCanvasProps) {
  const { nodes, edges } = useMemo(() => toFlow(layout, step), [layout, step]);

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
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={22}
        size={1.2}
        color="var(--color-line-strong)"
      />
      <CameraFollow nodeIds={step?.nodeIds} />
    </ReactFlow>
  );
}
