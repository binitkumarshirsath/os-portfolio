"use client";

import { ChevronLeft } from "lucide-react";
import {
  DOCK_WINDOW_IDS,
  isMobileTab,
  useWindowStore,
  windowRegistry,
} from "@/features/window-manager";
import { HankoSeal, ThemeToggle } from "@/shared/ui";

// Windows that aren't tabs (About, Skills, Activity) are reachable from the header.
const headerWindowIds = DOCK_WINDOW_IDS.filter((id) => !isMobileTab(id));

type MobileHeaderProps = {
  /** Labels the current view; visible on panels, screen-reader only on tabs. */
  title: string;
  titleId: string;
  showBack: boolean;
  onBack: () => void;
};

export function MobileHeader({ title, titleId, showBack, onBack }: MobileHeaderProps) {
  const openWindow = useWindowStore((state) => state.openWindow);

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-line bg-background px-1">
      <div className="flex min-w-0 items-center">
        {showBack ? (
          <button
            type="button"
            aria-label="Back"
            onClick={onBack}
            className="grid size-11 place-items-center text-fg-muted hover:text-fg"
          >
            <ChevronLeft aria-hidden className="size-5" />
          </button>
        ) : (
          <span className="flex items-center gap-2 px-3">
            <HankoSeal size={20} />
            <span className="font-display text-base font-semibold text-fg">Binit OS</span>
          </span>
        )}
        <h2
          id={titleId}
          className={showBack ? "truncate font-display text-lg font-semibold" : "sr-only"}
        >
          {title}
        </h2>
      </div>
      <nav aria-label="More">
        <ul className="flex">
          <li>
            <ThemeToggle
              className="grid size-11 place-items-center text-fg-muted hover:text-fg"
              iconClassName="size-5"
            />
          </li>
          {headerWindowIds.map((id) => {
            const { title: label, icon: Icon } = windowRegistry[id];
            return (
              <li key={id}>
                <button
                  type="button"
                  aria-label={label}
                  onClick={() => openWindow(id)}
                  className="grid size-11 place-items-center text-fg-muted hover:text-fg"
                >
                  <Icon aria-hidden className="size-5" />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
