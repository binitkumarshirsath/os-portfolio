import "server-only";
import type { AgentTrace, TraceSpan } from "@/entities/agent-trace";

type StepUsage = { inputTokens: number | undefined; outputTokens: number | undefined };
type FinishedStep = {
  stepNumber: number;
  usage: StepUsage;
  response: { modelId: string };
};
type ToolCall = { toolCallId: string; toolName: string; input: unknown };

const formatArgs = (input: unknown) =>
  typeof input === "object" && input !== null
    ? Object.values(input)
        .map((value) => JSON.stringify(value))
        .join(", ")
    : "";

/**
 * Collects one agent turn's spans from the AI SDK's step and tool callbacks.
 * Times are relative to the request, from a monotonic clock, so they can't be
 * skewed by the system clock changing mid-request.
 */
export function createTraceRecorder() {
  const startedAt = Date.now();
  const origin = performance.now();
  const elapsed = () => Math.round(performance.now() - origin);

  const spans: TraceSpan[] = [];
  const stepStarts = new Map<number, number>();
  const toolStarts = new Map<string, number>();

  return {
    stepStarted(stepNumber: number) {
      stepStarts.set(stepNumber, elapsed());
    },
    stepFinished(step: FinishedStep) {
      spans.push({
        kind: "model",
        name: "llm.step",
        detail: step.response.modelId,
        startMs: stepStarts.get(step.stepNumber) ?? 0,
        endMs: elapsed(),
        inputTokens: step.usage.inputTokens ?? 0,
        outputTokens: step.usage.outputTokens ?? 0,
      });
    },
    toolStarted(toolCall: ToolCall) {
      toolStarts.set(toolCall.toolCallId, elapsed());
    },
    toolFinished(toolCall: ToolCall) {
      spans.push({
        kind: "tool",
        name: `tool.${toolCall.toolName}`,
        detail: formatArgs(toolCall.input),
        startMs: toolStarts.get(toolCall.toolCallId) ?? elapsed(),
        endMs: elapsed(),
      });
    },
    finish(): AgentTrace {
      const sorted = [...spans].sort((a, b) => a.startMs - b.startMs);
      const modelSpans = sorted.filter((span) => span.kind === "model");
      return {
        startedAt,
        totalMs: elapsed(),
        inputTokens: modelSpans.reduce((sum, span) => sum + (span.inputTokens ?? 0), 0),
        outputTokens: modelSpans.reduce((sum, span) => sum + (span.outputTokens ?? 0), 0),
        toolCalls: sorted.length - modelSpans.length,
        spans: sorted,
      };
    },
  };
}
