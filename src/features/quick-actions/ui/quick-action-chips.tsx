"use client";

import { quickActions, type QuickAction } from "../model/quick-actions";

type QuickActionChipsProps = {
  onSelect: (quickAction: QuickAction) => void;
};

export function QuickActionChips({ onSelect }: QuickActionChipsProps) {
  return (
    <ul aria-label="Suggested questions" className="flex flex-wrap gap-2">
      {quickActions.map((quickAction) => (
        <li key={quickAction.id} className="shrink-0">
          <button
            type="button"
            onClick={() => onSelect(quickAction)}
            className="h-8 rounded-sm border border-line-strong px-3 font-mono text-xs whitespace-nowrap text-fg-muted transition-colors hover:border-accent hover:text-accent-text"
          >
            {quickAction.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
