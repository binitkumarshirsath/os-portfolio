import { Mail, RotateCcw } from "lucide-react";
import type { ChatErrorState } from "../model/chat-error";

type ChatErrorNoticeProps = {
  error: ChatErrorState;
  onShowContact: () => void;
  onRetry: () => void;
};

const actionClass =
  "inline-flex h-8 items-center gap-1.5 rounded-sm border border-line-strong px-3 font-mono text-xs text-fg transition-colors hover:border-accent hover:text-accent-text";

/** Failures read like the assistant talking, never like a stack trace. */
export function ChatErrorNotice({ error, onShowContact, onRetry }: ChatErrorNoticeProps) {
  // When the agent is out for the day, the best next step is reaching Binit directly.
  const offerContact = error.code === "daily_limit" || error.code === "model_unavailable";
  // Dropped connections and provider spikes clear quickly; the daily and hourly caps don't.
  const offerRetry = error.code === "network" || error.code === "model_unavailable";

  return (
    <div role="status" className="space-y-1">
      <p className="font-mono text-[11px] text-accent-text">assistant · unavailable</p>
      <div className="space-y-3 rounded-sm border border-accent-deep bg-accent-tint p-3">
        <p className="text-sm leading-relaxed">{error.message}</p>
        {(offerContact || offerRetry) && (
          <div className="flex flex-wrap gap-2">
            {offerContact && (
              <button type="button" onClick={onShowContact} className={actionClass}>
                <Mail aria-hidden className="size-3.5" />
                Contact Binit
              </button>
            )}
            {offerRetry && (
              <button type="button" onClick={onRetry} className={actionClass}>
                <RotateCcw aria-hidden className="size-3.5" />
                Try again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
