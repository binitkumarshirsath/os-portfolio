import { Maximize2, Minimize2, Minus, X, type LucideIcon } from "lucide-react";
import type { PointerEvent } from "react";

type TitleBarProps = {
  titleId: string;
  title: string;
  isFocused: boolean;
  isMaximized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onDragStart: (event: PointerEvent) => void;
};

type LightProps = {
  label: string;
  icon: LucideIcon;
  /** Dot colour plus a glyph colour that stays visible on it. */
  colorClass: string;
  onClick: () => void;
};

/** One traffic-light button: a 12px dot inside a 24px hit area. */
function Light({ label, icon: Icon, colorClass, onClick }: LightProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      // Without this, pressing a button would also start a drag.
      onPointerDown={(event) => event.stopPropagation()}
      // ...and a quick double press would also hit the title bar's maximize.
      onDoubleClick={(event) => event.stopPropagation()}
      className="grid size-6 place-items-center rounded-full"
    >
      <span className={`grid size-3 place-items-center rounded-full ${colorClass}`}>
        {/* Glyphs appear when the pointer is anywhere over the group, as on macOS. */}
        <Icon
          aria-hidden
          strokeWidth={3}
          className="size-2 opacity-0 group-focus-within/lights:opacity-100 group-hover/lights:opacity-100"
        />
      </span>
    </button>
  );
}

export function TitleBar({
  titleId,
  title,
  isFocused,
  isMaximized,
  onClose,
  onMinimize,
  onToggleMaximize,
  onDragStart,
}: TitleBarProps) {
  return (
    <div
      onPointerDown={onDragStart}
      onDoubleClick={onToggleMaximize}
      className={`flex h-9 shrink-0 touch-none items-center gap-2 border-b border-line bg-raised/50 px-2 select-none ${
        isMaximized ? "" : "cursor-grab active:cursor-grabbing"
      }`}
    >
      <div className="group/lights flex items-center">
        <Light
          label={`Close ${title}`}
          icon={X}
          colorClass="bg-accent text-surface"
          onClick={onClose}
        />
        <Light
          label={`Minimize ${title}`}
          icon={Minus}
          colorClass="bg-ochre text-surface"
          onClick={onMinimize}
        />
        <Light
          label={isMaximized ? `Restore ${title}` : `Maximize ${title}`}
          icon={isMaximized ? Minimize2 : Maximize2}
          colorClass="bg-moss text-surface"
          onClick={onToggleMaximize}
        />
      </div>
      <h2
        id={titleId}
        className={`font-display text-[13px] font-semibold ${isFocused ? "text-fg" : "text-fg-muted"}`}
      >
        {title}
      </h2>
    </div>
  );
}
