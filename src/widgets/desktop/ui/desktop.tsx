"use client";

import { AnimatePresence } from "motion/react";
import { useRef, type ReactNode } from "react";
import { ProfileHero } from "@/entities/profile";
import {
  WINDOW_IDS,
  WindowFrame,
  useWindowStore,
  type WindowId,
} from "@/features/window-manager";
import { SunBackdrop } from "./sun-backdrop";

type DesktopProps = {
  bodies: Record<WindowId, ReactNode>;
};

export function Desktop({ bodies }: DesktopProps) {
  const boundsRef = useRef<HTMLDivElement>(null);
  const stack = useWindowStore((state) => state.stack);
  const minimizedIds = useWindowStore((state) => state.minimizedIds);

  // Render in registry order, not stack order: re-ordering DOM nodes on every focus
  // change would drop keyboard focus and scroll position. z-index handles stacking.
  const visibleIds = WINDOW_IDS.filter(
    (id) => stack.includes(id) && !minimizedIds.includes(id),
  );

  return (
    // --hero-end: the hero's right edge plus a gap. The chat window sizes itself
    // against it, so it grows on wide screens without covering the hero buttons.
    <main className="relative min-h-0 flex-1 overflow-hidden [--hero-end:368px] xl:[--hero-end:484px]">
      <SunBackdrop />

      <div className="absolute top-1/2 left-12 w-[19rem] -translate-y-1/2 xl:left-20 xl:w-[24rem]">
        <ProfileHero />
      </div>

      {/* Click-through layer: only the windows themselves catch the pointer. */}
      <div ref={boundsRef} className="pointer-events-none absolute inset-0">
        <AnimatePresence>
          {visibleIds.map((id) => (
            <WindowFrame key={id} id={id} boundsRef={boundsRef}>
              {bodies[id]}
            </WindowFrame>
          ))}
        </AnimatePresence>
      </div>
    </main>
  );
}
