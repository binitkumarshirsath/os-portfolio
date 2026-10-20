"use client";

import { quickActions, type QuickAction } from "../model/quick-actions";

type QuickActionChipsProps = {
  onSelect: (quickAction: QuickAction) => void;
};

export function QuickActionChips({ onSelect }: QuickActionChipsProps) {
  return (
    // Wraps on desktop; one swipeable row on phones so the chips don't take over the screen.
    <ul
      aria-label="Suggested questions"
      className="flex flex-wrap gap-2 max-lg:-mx-4 max-lg:flex-nowrap max-lg:overflow-x-auto max-lg:px-4 max-lg:pb-1"
    >
      {quickActions.map((quickAction) => (
        <li key={quickAction.id} className="shrink-0">
          <button
            type="button"
            onClick={() => onSelect(quickAction)}
            className="h-8 rounded-full border border-line-strong bg-raised/60 px-3.5 text-[13px] whitespace-nowrap text-fg/85 transition-colors hover:border-accent/70 hover:bg-accent-tint hover:text-fg"
          >
            {quickAction.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
