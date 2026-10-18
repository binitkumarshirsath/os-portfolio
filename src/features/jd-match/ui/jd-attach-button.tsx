"use client";

import { Paperclip } from "lucide-react";
import { useRef } from "react";
import { useJdMatch, type JdInput } from "../model/jd-match-store";
import { ACCEPTED_FILES } from "./jd-match-form";

type JdAttachButtonProps = {
  onMatch: (input: JdInput) => void;
};

/** The paperclip in the chat input: the fastest way to hand over a JD file. */
export function JdAttachButton({ onMatch }: JdAttachButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isBusy = useJdMatch((state) => state.status === "analysing");

  return (
    <>
      <button
        type="button"
        aria-label="Match a job description (PDF, DOCX or TXT)"
        title="Match a job description"
        disabled={isBusy}
        onClick={() => fileInputRef.current?.click()}
        className="grid size-10 shrink-0 place-items-center rounded-sm border border-line-strong text-fg-muted transition-colors hover:border-accent hover:text-accent-text disabled:opacity-50"
      >
        <Paperclip aria-hidden className="size-4" />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_FILES}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) onMatch({ file });
        }}
      />
    </>
  );
}
