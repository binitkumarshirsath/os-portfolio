import "server-only";
import { createUIMessageStream, createUIMessageStreamResponse } from "ai";

// TEMPORARY (Phase 5): proves the route speaks the same streaming format the chat
// expects. Phase 6 deletes this file and streams the real agent instead.
export function stubReply(headers: Record<string, string>): Response {
  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      const id = "stub";
      writer.write({ type: "text-start", id });
      writer.write({
        type: "text-delta",
        id,
        delta: "Request accepted. The agent connects in Phase 6.",
      });
      writer.write({ type: "text-end", id });
    },
  });
  return createUIMessageStreamResponse({ stream, headers });
}
