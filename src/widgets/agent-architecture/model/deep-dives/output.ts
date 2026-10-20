import { AGENT_TOOL_NAMES } from "@/shared/config/agent-tools";
import type { DeepDive } from "./types";

/** The way out: tool calls, what the browser does with them, the stream and the trace. */
export const outputDives = {
  tools: {
    summary: `${AGENT_TOOL_NAMES.length} typed tools let the agent change what's on screen: ${AGENT_TOOL_NAMES.join(", ")}.`,
    sections: [
      {
        heading: "How it works",
        points: [
          "Inputs are Zod enums: window ids from a fixed list, project slugs generated from the content. The model can't name a target that doesn't exist.",
          "On the server, a tool only acknowledges. That lets the model finish its answer in the same request instead of a second round trip that would cost another question.",
          "The browser runs the real action as soon as the tool's input has streamed in, so a window opens while the answer is still being written.",
        ],
      },
    ],
    bypass: [
      {
        attempt: "Get the agent to open a URL, fetch a page or run code",
        outcome:
          "No tool can do that. The most a tool call can do is open one of the site's own windows or download the resume.",
        holds: true,
      },
      {
        attempt: "Tamper with a tool call on its way to the browser",
        outcome:
          "The browser checks inputs again before acting, and anything unexpected is ignored rather than trusted.",
        holds: true,
      },
    ],
    files: [
      "src/features/agent-chat/model/agent-tools.ts",
      "src/features/agent-chat/model/tool-call-to-ui-action.ts",
    ],
  },
  ui: {
    summary:
      "Tool calls and quick actions become the same typed UI actions, run in one place.",
    sections: [
      {
        heading: "How it works",
        points: [
          "runUiAction is the single runner: it opens, focuses or restores windows through a Zustand store. On phones the same store drives full-screen panels.",
          "On phones, tool calls show as tap-to-open chips instead of running automatically, so a panel doesn't cover the answer being read.",
          "The resume downloads through a synthetic <a download> click rather than window.open, so browsers don't treat it as a popup even after a network round trip.",
        ],
      },
    ],
    files: [
      "src/features/window-manager/model/run-ui-action.ts",
      "src/features/agent-chat/model/tool-action-bridge.ts",
    ],
  },
  answer: {
    summary: "The answer streams to the browser as it's written.",
    sections: [
      {
        heading: "How it works",
        points: [
          "toUIMessageStreamResponse sends the turn as server-sent events: text deltas, tool-call parts and metadata.",
          "The model's reasoning isn't sent to the browser, only the answer.",
          "The final event carries the turn's trace as metadata, once every step has been recorded.",
          "An error mid-stream becomes JSON in the same shape as HTTP errors, so the chat shows one friendly state for both.",
        ],
      },
    ],
    files: ["src/features/agent-chat/server/run-agent.ts"],
  },
  trace: {
    summary:
      "Every turn is recorded as spans, the way observability tools do it, without a tracing library.",
    sections: [
      {
        heading: "How it works",
        points: [
          "A small recorder hooks the AI SDK's callbacks: step start and finish, tool call start and finish.",
          "Times come from performance.now(), relative to the request: a monotonic clock, so a system clock change can't skew them.",
          "Each step records the model that actually answered (taken from the response, not the config) and its token counts. That's how a Gemini fallback shows up.",
          "Span names follow OpenTelemetry style: llm.step and tool.<name>.",
          "Your last turn is saved in this browser's localStorage, which is how this page replays it. Nothing is stored on the server.",
        ],
      },
    ],
    files: [
      "src/features/agent-chat/server/trace-recorder.ts",
      "src/entities/agent-trace/model/last-trace.ts",
    ],
  },
} satisfies Record<string, DeepDive>;
