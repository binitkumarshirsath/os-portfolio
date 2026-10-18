import type { ChatErrorCode } from "@/shared/config/rate-limits";

export type ChatErrorState = {
  /** "network": the request never got a proper answer from our API at all. */
  code: ChatErrorCode | "network";
  message: string;
};

type ErrorBody = { error: { code: ChatErrorCode; message: string } };

function isErrorBody(value: unknown): value is ErrorBody {
  if (typeof value !== "object" || value === null || !("error" in value)) return false;
  const { error } = value;
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string" &&
    "message" in error &&
    typeof error.message === "string"
  );
}

/**
 * The API reports failures as { error: { code, message } } both as HTTP error
 * bodies and inside the stream, and the AI SDK hands either to us as
 * Error.message. One parser turns both into something the UI can show.
 */
export function describeChatError(error: Error | undefined): ChatErrorState | null {
  if (!error) return null;
  try {
    const body: unknown = JSON.parse(error.message);
    if (isErrorBody(body)) return body.error;
  } catch {
    // Not our JSON: a dropped connection or similar.
  }
  return {
    code: "network",
    message: "The connection dropped before the answer arrived. Try again in a moment.",
  };
}
