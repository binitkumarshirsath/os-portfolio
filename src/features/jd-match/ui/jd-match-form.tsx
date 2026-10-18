"use client";

import { Upload } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { JD_MATCH_LIMITS } from "@/shared/config/ai";
import type { JdInput } from "../model/jd-match-store";

export const ACCEPTED_FILES = ".pdf,.docx,.txt,.md";

type JdMatchFormProps = {
  disabled: boolean;
  onMatch: (input: JdInput) => void;
};

/** Paste or upload. Both lead to the same match; the server reads files itself. */
export function JdMatchForm({ disabled, onMatch }: JdMatchFormProps) {
  const [text, setText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLongEnough = text.trim().length >= JD_MATCH_LIMITS.minJobDescriptionChars;

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!disabled && isLongEnough) onMatch({ text: text.trim() });
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block space-y-1.5">
        <span className="font-mono text-[11px] tracking-[0.18em] text-fg-muted uppercase">
          Job description
        </span>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          maxLength={JD_MATCH_LIMITS.maxJobDescriptionChars}
          rows={8}
          placeholder="Paste the job description here…"
          className="w-full resize-y rounded-sm border border-line-strong bg-background p-3 text-base leading-relaxed placeholder:text-fg-muted lg:text-sm"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={disabled || !isLongEnough}
          className="h-9 rounded-sm bg-accent px-4 text-sm font-medium text-background transition-colors hover:bg-accent-text disabled:bg-line-strong disabled:text-fg-muted"
        >
          Match
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex h-9 items-center gap-2 rounded-sm border border-line-strong px-3 text-sm transition-colors hover:border-accent hover:text-accent-text disabled:text-fg-muted"
        >
          <Upload aria-hidden className="size-4" />
          Upload PDF, DOCX or TXT
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_FILES}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = ""; // so choosing the same file again still triggers
            if (file) onMatch({ file });
          }}
        />
      </div>
      <p className="text-xs leading-relaxed text-fg-muted">
        The text is read once to write the report and is never stored.
      </p>
    </form>
  );
}
