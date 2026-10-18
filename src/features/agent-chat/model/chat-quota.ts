import { create } from "zustand";

type ChatQuota = {
  /** Questions left this hour; null until the server has told us. */
  remaining: number | null;
  setRemaining: (remaining: number) => void;
};

export const useChatQuota = create<ChatQuota>()((set) => ({
  remaining: null,
  setRemaining: (remaining) => set({ remaining }),
}));

let hasRequestedQuota = false;

/**
 * Asks the server once per page load, so the meter is right even for a returning
 * visitor. After that, every chat response's X-RateLimit-Remaining keeps it current.
 */
export function loadQuotaOnce(): void {
  if (hasRequestedQuota) return;
  hasRequestedQuota = true;
  fetch("/api/chat")
    .then((response) => (response.ok ? response.json() : null))
    .then((body: { remaining?: unknown } | null) => {
      if (typeof body?.remaining === "number") {
        useChatQuota.getState().setRemaining(body.remaining);
      }
    })
    .catch(() => {
      // The meter just stays hidden; the chat itself still works.
    });
}
