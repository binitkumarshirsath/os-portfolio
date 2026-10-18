"use client";

import { useWindowStore, type WindowId } from "@/features/window-manager";
import { Clock } from "./clock";

const menuItems: { label: string; windowId: WindowId }[] = [
  { label: "About", windowId: "about" },
  { label: "Work", windowId: "projects" },
  { label: "Ask", windowId: "chat" },
];

export function Menubar() {
  const openWindow = useWindowStore((state) => state.openWindow);

  return (
    <header className="relative z-50 flex h-8 shrink-0 items-center justify-between border-b border-line bg-background px-4 font-mono text-xs">
      <div className="flex items-center gap-6">
        <span className="font-semibold tracking-[0.25em] text-accent">BINIT · OS</span>
        <nav aria-label="Main">
          <ul className="flex gap-1">
            {menuItems.map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => openWindow(item.windowId)}
                  className="rounded-sm px-2 py-1 text-fg-muted transition-colors hover:bg-raised hover:text-fg"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="flex items-center gap-5">
        {/* Static for now; Phase 6 ties this to whether the agent is reachable. */}
        <span className="flex items-center gap-2 text-fg-muted">
          <span aria-hidden className="size-1.5 rounded-full bg-accent" />
          agent ready
        </span>
        <Clock />
      </div>
    </header>
  );
}
