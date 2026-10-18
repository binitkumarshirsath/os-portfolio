"use client";

import { FileDown } from "lucide-react";
import {
  DOCK_WINDOW_IDS,
  useWindowStore,
  windowRegistry,
} from "@/features/window-manager";
import { profile } from "@/shared/content";
import { DockButton, DockLink } from "./dock-item";

export function Dock() {
  const stack = useWindowStore((state) => state.stack);
  const minimizedIds = useWindowStore((state) => state.minimizedIds);
  const openWindow = useWindowStore((state) => state.openWindow);

  return (
    <nav
      aria-label="Dock"
      className="relative z-50 flex shrink-0 justify-center pt-1 pb-3"
    >
      <ul className="flex items-center gap-1 rounded-lg border border-line bg-surface px-2 py-1.5">
        {DOCK_WINDOW_IDS.map((id) => (
          <DockButton
            key={id}
            windowId={id}
            label={windowRegistry[id].title}
            icon={windowRegistry[id].icon}
            state={
              minimizedIds.includes(id)
                ? "minimized"
                : stack.includes(id)
                  ? "open"
                  : "closed"
            }
            onClick={() => openWindow(id)}
          />
        ))}
        <li aria-hidden className="mx-1 h-7 w-px bg-line" />
        <DockLink
          label="Resume (PDF)"
          icon={FileDown}
          href={profile.resumeHref}
          download
        />
      </ul>
    </nav>
  );
}
