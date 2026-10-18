import type { ApiErrorCode } from "@/shared/config/rate-limits";

export type ApiErrorState = {
  /** "network": the request never got a proper answer from our API at all. */
  code: ApiErrorCode | "network";
  message: string;
};

export const NETWORK_ERROR: ApiErrorState = {
  code: "network",
  message: "The connection dropped before the answer arrived. Try again in a moment.",
};

/** Our APIs report failures as { error: { code, message } }; anything else isn't ours. */
export function readApiError(value: unknown): ApiErrorState | null {
  if (typeof value !== "object" || value === null || !("error" in value)) return null;
  const { error } = value;
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    // The code comes from our own server, which only sends ApiErrorCode values.
    return { code: error.code as ApiErrorCode, message: error.message };
  }
  return null;
}
