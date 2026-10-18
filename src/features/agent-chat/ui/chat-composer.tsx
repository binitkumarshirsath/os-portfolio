"use client";

import { ArrowUp } from "lucide-react";
import { useState, type FormEvent } from "react";
import { AGENT_LIMITS } from "@/shared/config/ai";

type ChatComposerProps = {
  /** The visitor can keep typing while an answer streams; only sending waits. */
  canSend: boolean;
  placeholder: string;
  onSend: (text: string) => void;
};

/** Show the counter only when it matters, near the limit. */
const COUNTER_FROM = AGENT_LIMITS.maxMessageChars - 100;

export function ChatComposer({ canSend, placeholder, onSend }: ChatComposerProps) {
  const [text, setText] = useState("");
  const question = text.trim();

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!canSend || !question) return;
    onSend(question);
    setText("");
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <div className="relative min-w-0 flex-1">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          maxLength={AGENT_LIMITS.maxMessageChars}
          aria-label="Ask about Binit"
          placeholder={placeholder}
          // 16px on phones stops iOS zooming into the field on focus.
          className="h-10 w-full rounded-sm border border-line-strong bg-background pr-14 pl-3 text-base placeholder:text-fg-muted lg:text-sm"
        />
        {text.length >= COUNTER_FROM && (
          <span className="absolute top-1/2 right-2 -translate-y-1/2 font-mono text-[10px] text-fg-muted">
            {text.length}/{AGENT_LIMITS.maxMessageChars}
          </span>
        )}
      </div>
      <button
        type="submit"
        aria-label="Send"
        disabled={!canSend || !question}
        className="grid size-10 shrink-0 place-items-center rounded-sm bg-accent text-background transition-colors hover:bg-accent-text disabled:bg-line-strong disabled:text-fg-muted"
      >
        <ArrowUp aria-hidden className="size-4" />
      </button>
    </form>
  );
}
