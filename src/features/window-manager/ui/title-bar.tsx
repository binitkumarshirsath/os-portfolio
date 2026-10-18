import { X } from "lucide-react";
import type { PointerEvent } from "react";

type TitleBarProps = {
  titleId: string;
  title: string;
  isFocused: boolean;
  onClose: () => void;
  onDragStart: (event: PointerEvent) => void;
};

export function TitleBar({
  titleId,
  title,
  isFocused,
  onClose,
  onDragStart,
}: TitleBarProps) {
  return (
    <div
      onPointerDown={onDragStart}
      className="flex h-9 shrink-0 cursor-grab touch-none items-center gap-2 border-b border-line bg-raised px-2 select-none active:cursor-grabbing"
    >
      <div className="flex items-center">
        <button
          type="button"
          aria-label={`Close ${title}`}
          onClick={onClose}
          // Without this, pressing the button would also start a drag.
          onPointerDown={(event) => event.stopPropagation()}
          className="group grid size-6 place-items-center rounded-full"
        >
          <span className="grid size-3 place-items-center rounded-full bg-accent">
            <X
              aria-hidden
              strokeWidth={3}
              className="size-2 text-background opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
            />
          </span>
        </button>
        {/* Decorative: only close does something, to keep the window model simple. */}
        <span aria-hidden className="mx-1.5 size-3 rounded-full bg-accent-deep" />
        <span aria-hidden className="mx-1.5 size-3 rounded-full bg-line-strong" />
      </div>
      <h2
        id={titleId}
        className={`font-mono text-[11px] tracking-[0.18em] uppercase ${isFocused ? "text-fg" : "text-fg-muted"}`}
      >
        {title}
      </h2>
    </div>
  );
}
