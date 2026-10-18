import "server-only";
import { convertToModelMessages, stepCountIs, streamText, validateUIMessages } from "ai";
import { AGENT_LIMITS } from "@/shared/config/ai";
import type { AgentMessage } from "../model/agent-chat";
import { agentTools } from "../model/agent-tools";
import { systemPrompt } from "../model/system-prompt";
import { fallbackModel, modelProviderOptions } from "@/shared/api/server";
import type { ChatRequestMessage } from "./request-schema";
import { createTraceRecorder } from "./trace-recorder";

/**
 * Sent instead of raw provider errors, in the same JSON shape as HTTP errors.
 * Both providers failing at once is usually a short spike, so it says "right
 * now"; only the daily cap says "for today".
 */
const modelUnavailable = JSON.stringify({
  error: {
    code: "model_unavailable",
    message:
      "I'm out of breath right now. Try again in a minute, or reach Binit directly.",
  },
});

type RunAgentOptions = {
  messages: ChatRequestMessage[];
  headers: Record<string, string>;
  abortSignal: AbortSignal;
};

/** Streams one agent turn back to the browser in the AI SDK's UI message format. */
export async function runAgent({ messages, headers, abortSignal }: RunAgentOptions) {
  // Our schema enforced the limits; this checks the shape the SDK expects and types it.
  const uiMessages = await validateUIMessages<AgentMessage>({
    messages,
    tools: agentTools,
  });

  const trace = createTraceRecorder();

  const result = streamText({
    model: fallbackModel,
    system: systemPrompt,
    messages: await convertToModelMessages(uiMessages, { tools: agentTools }),
    tools: agentTools,
    maxOutputTokens: AGENT_LIMITS.maxOutputTokens,
    stopWhen: stepCountIs(AGENT_LIMITS.maxSteps),
    providerOptions: modelProviderOptions,
    // Retries would hit Groq again; the model wrapper already falls back to Gemini instead.
    maxRetries: 0,
    // Stop paying for tokens as soon as the visitor goes away.
    abortSignal,
    onError: ({ error }) => console.error("[agent] stream failed", error),
    // Timings and token usage for the Activity Monitor.
    experimental_onStepStart: ({ stepNumber }) => trace.stepStarted(stepNumber),
    onStepFinish: (step) => trace.stepFinished(step),
    experimental_onToolCallStart: ({ toolCall }) => trace.toolStarted(toolCall),
    experimental_onToolCallFinish: ({ toolCall }) => trace.toolFinished(toolCall),
  });

  return result.toUIMessageStreamResponse<AgentMessage>({
    headers,
    sendReasoning: false,
    // The trace rides on the final "finish" event, once every step has been recorded.
    messageMetadata: ({ part }) => {
      if (part.type === "start") return { source: "model" };
      if (part.type === "finish") return { source: "model", trace: trace.finish() };
      return undefined;
    },
    onError: () => modelUnavailable,
  });
}
