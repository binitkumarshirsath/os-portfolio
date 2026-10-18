import { NETWORK_ERROR, readApiError, type ApiErrorState } from "@/shared/lib";

export type ChatErrorState = ApiErrorState;

/**
 * The API reports failures as { error: { code, message } } both as HTTP error
 * bodies and inside the stream, and the AI SDK hands either to us as
 * Error.message. One parser turns both into something the UI can show.
 */
export function describeChatError(error: Error | undefined): ChatErrorState | null {
  if (!error) return null;
  try {
    return readApiError(JSON.parse(error.message)) ?? NETWORK_ERROR;
  } catch {
    return NETWORK_ERROR; // not our JSON: a dropped connection or similar
  }
}
