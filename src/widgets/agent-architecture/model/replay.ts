import {
  formatCount,
  formatDuration,
  shortModelName,
  type SavedTurn,
  type TraceSpan,
} from "@/entities/agent-trace";
import { AI_MODELS } from "@/shared/config/ai";
import type { ArchNodeId } from "./graph";
import type { Step } from "./steps";

/**
 * Real steps take a second or two, too fast to follow. Replay slows them down
 * by the same factor, so a slow step still looks slower than a quick one.
 */
const SLOW_MOTION = 3;
const clampMs = (ms: number) => Math.min(6_000, Math.max(2_800, ms));

const toolPhrases: Record<string, string> = {
  openWindow: "open a window",
  showProject: "show a project",
  openResume: "download the resume",
  showContact: "show contact details",
};

const isBackup = (span: TraceSpan) => span.detail !== AI_MODELS.primary.id;
const modelNode = (span: TraceSpan | undefined): ArchNodeId =>
  span && isBackup(span) ? "gemini" : "groq";

function modelStep(span: TraceSpan, index: number): Step {
  const ms = span.endMs - span.startMs;
  const backup = isBackup(span);
  const tokens = `read ${formatCount(span.inputTokens ?? 0)} tokens and wrote ${formatCount(span.outputTokens ?? 0)}`;
  return {
    id: `model-${index}`,
    title: backup
      ? `Step ${index}: Gemini stepped in`
      : `Step ${index}: Groq is thinking`,
    plain: backup
      ? `Groq was busy, so the backup took this step. It ${tokens} in ${formatDuration(ms)}.`
      : `The model ${tokens} in ${formatDuration(ms)}.`,
    technical: `llm.step on ${shortModelName(span.detail)} · ${span.startMs}–${span.endMs} ms after the request`,
    nodeIds: backup ? ["groq", "gemini"] : ["groq"],
    edgeIds: [
      index === 1 ? "prompt-groq" : "groq-tools",
      ...(backup ? ["groq-gemini"] : []),
    ],
    durationMs: clampMs(ms * SLOW_MOTION),
  };
}

function toolStep(span: TraceSpan, by: ArchNodeId, index: number): Step {
  const name = span.name.replace(/^tool\./, "");
  const ms = span.endMs - span.startMs;
  return {
    id: `tool-${index}`,
    title: `Tool call: ${name}`,
    plain: `The model asked the page to ${toolPhrases[name] ?? "do something"}, and your browser did it.`,
    technical: `${span.name}(${span.detail}) · acknowledged in ${formatDuration(ms)}`,
    nodeIds: [by, "tools", "ui"],
    edgeIds: [`${by}-tools`, "tools-ui"],
    durationMs: clampMs(ms * SLOW_MOTION),
  };
}

/** Turns a recorded trace into steps on the same diagram the walkthrough uses. */
export function replaySteps({ question, trace }: SavedTurn): Step[] {
  const steps: Step[] = [
    {
      id: "asked",
      title: "You asked",
      plain: `“${question}”`,
      technical: `Turn started at ${new Date(trace.startedAt).toLocaleTimeString()}.`,
      nodeIds: ["visitor", "route"],
      edgeIds: ["visitor-route"],
      durationMs: 3_500,
    },
    {
      id: "checked",
      title: "Checked and allowed",
      plain:
        "It passed validation and the rate limiter, and the model got its instructions.",
      technical: `The first model step started ${formatDuration(trace.spans[0]?.startMs ?? 0)} into the turn.`,
      nodeIds: ["route", "limiter", "prompt"],
      edgeIds: ["route-limiter", "limiter-prompt"],
      durationMs: 3_500,
    },
  ];

  let modelIndex = 0;
  let lastModel: TraceSpan | undefined;
  trace.spans.forEach((span, i) => {
    if (span.kind === "model") {
      lastModel = span;
      steps.push(modelStep(span, ++modelIndex));
    } else {
      steps.push(toolStep(span, modelNode(lastModel), i));
    }
  });

  const by = modelNode(lastModel);
  const toolCalls = `${trace.toolCalls} tool call${trace.toolCalls === 1 ? "" : "s"}`;
  steps.push({
    id: "done",
    title: "Answer delivered",
    plain: `The whole turn took ${formatDuration(trace.totalMs)}, with ${toolCalls} and ${formatCount(trace.inputTokens + trace.outputTokens)} tokens in total.`,
    technical: `${trace.inputTokens} input · ${trace.outputTokens} output tokens, recorded as ${trace.spans.length} spans.`,
    nodeIds: [by, "answer", "trace"],
    edgeIds: [`${by}-answer`, "answer-trace"],
    durationMs: 5_000,
  });
  return steps;
}
