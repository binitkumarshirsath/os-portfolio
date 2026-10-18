"use client";

import { MOBILE_TAB_IDS, windowRegistry, type WindowId } from "@/features/window-manager";

type TabBarProps = {
  activeTab: WindowId;
  onSelect: (id: WindowId) => void;
};

export function TabBar({ activeTab, onSelect }: TabBarProps) {
  return (
    <nav
      aria-label="Sections"
      // Keeps the tabs clear of the iPhone home indicator.
      className="shrink-0 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="grid grid-cols-4">
        {MOBILE_TAB_IDS.map((id) => {
          const { mobileTab, icon: Icon } = windowRegistry[id];
          const isActive = id === activeTab;
          return (
            <li key={id}>
              <button
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => onSelect(id)}
                className={`relative flex h-14 w-full flex-col items-center justify-center gap-1 text-[11px] transition-colors ${
                  isActive ? "text-accent-text" : "text-fg-muted hover:text-fg"
                }`}
              >
                {isActive && (
                  <span aria-hidden className="absolute top-0 h-0.5 w-8 bg-accent" />
                )}
                <Icon aria-hidden className="size-5" />
                {mobileTab}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
