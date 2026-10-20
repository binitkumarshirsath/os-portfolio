import "server-only";
import { z } from "zod";
import { AGENT_LIMITS } from "@/shared/config/ai";

const {
  maxBodyChars: MAX_BODY_CHARS,
  maxMessages: MAX_MESSAGES,
  maxAssistantChars: MAX_ASSISTANT_CHARS,
} = AGENT_LIMITS;

const textPart = z.object({ type: z.literal("text"), text: z.string() });

// Tool calls, step markers and the like. Their shape belongs to the AI SDK, so
// we only insist they aren't a "text" part trying to dodge the length check.
const nonTextPart = z.looseObject({
  type: z.string().refine((type) => type !== "text"),
});

type Part = z.infer<typeof textPart> | z.infer<typeof nonTextPart>;
const textLength = (parts: Part[]) =>
  parts.reduce(
    (total, part) => total + ("text" in part ? String(part.text).length : 0),
    0,
  );

const userMessage = z
  .object({
    id: z.string(),
    role: z.literal("user"),
    parts: z.array(textPart).min(1),
    metadata: z.unknown().optional(),
  })
  .refine((message) => textLength(message.parts) <= AGENT_LIMITS.maxMessageChars, {
    message: `Questions are limited to ${AGENT_LIMITS.maxMessageChars} characters.`,
  });

const assistantMessage = z
  .object({
    id: z.string(),
    role: z.literal("assistant"),
    parts: z.array(z.union([textPart, nonTextPart])),
    metadata: z.unknown().optional(),
  })
  .refine((message) => textLength(message.parts) <= MAX_ASSISTANT_CHARS, {
    message: "A previous answer in the conversation is too long.",
  });

// Loose at the top level: the AI SDK also sends fields like `id` and `trigger`.
const chatRequestSchema = z
  .looseObject({
    messages: z
      .array(z.discriminatedUnion("role", [userMessage, assistantMessage]))
      .min(1)
      .max(MAX_MESSAGES),
  })
  .refine(
    ({ messages }) => {
      const last = messages.at(-1);
      // The conversation must end with the visitor's question, and it can't be blank.
      return last?.role === "user" && last.parts.some((part) => part.text.trim() !== "");
    },
    { message: "Send a non-empty question." },
  );

export type ChatRequestMessage = z.infer<typeof chatRequestSchema>["messages"][number];

export type ParsedChatRequest =
  { ok: true; messages: ChatRequestMessage[] } | { ok: false; message: string };

export function parseChatRequest(rawBody: string): ParsedChatRequest {
  if (rawBody.length === 0) return { ok: false, message: "The request body is empty." };
  if (rawBody.length > MAX_BODY_CHARS)
    return { ok: false, message: "The request is too large." };

  let json: unknown;
  try {
    json = JSON.parse(rawBody);
  } catch {
    return { ok: false, message: "The request body isn't valid JSON." };
  }

  const result = chatRequestSchema.safeParse(json);
  if (!result.success) {
    return { ok: false, message: result.error.issues[0]?.message ?? "Invalid request." };
  }
  // Only the most recent turns go to the model, which caps cost per request.
  return {
    ok: true,
    messages: result.data.messages.slice(-AGENT_LIMITS.maxHistoryMessages),
  };
}
