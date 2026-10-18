"use client";

import { animate, useMotionValue, useReducedMotion, type Transition } from "motion/react";
import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import type { WindowId } from "../model/window-registry";
import { useWindowStore } from "../model/window-store";

/** How small a window gets when it's tucked into the dock. */
const DOCKED_SCALE = 0.08;

// Accelerate into the dock, decelerate out of it, so both read as one gesture.
const intoDock: Transition = { duration: 0.32, ease: [0.55, 0, 0.75, 0] };
const outOfDock: Transition = { duration: 0.34, ease: [0.16, 1, 0.3, 1] };
const popIn: Transition = { duration: 0.18, ease: "easeOut" };
export const resizeTransition: Transition = { duration: 0.28, ease: [0.32, 0.72, 0, 1] };

/** Distance from the window's centre to its dock icon's centre, in px. */
function offsetToDock(id: WindowId, frame: HTMLElement | null) {
  const dockButton = document.querySelector(`[data-window-trigger="${id}"]`);
  if (!dockButton || !frame) return null;
  const from = frame.getBoundingClientRect();
  const to = dockButton.getBoundingClientRect();
  return {
    dx: to.x + to.width / 2 - (from.x + from.width / 2),
    dy: to.y + to.height / 2 - (from.y + from.height / 2),
  };
}

/**
 * The motion values behind a window and the animations that drive them.
 * x/y: the outer layer's drag offset (drag writes them; maximize animates them).
 * dockX/dockY/scale/opacity: the inner layer, for opening and the dock.
 */
export function useWindowMotion(id: WindowId, frameRef: RefObject<HTMLElement | null>) {
  const savedOffset = useWindowStore((state) => state.offsets[id]);
  const isMaximized = useWindowStore((state) => state.maximizedIds.includes(id));
  const isRestoring = useWindowStore((state) => state.restoringId === id);
  // Only windows opened by an action have a focus request; ones open on page load don't.
  const isOpening = useWindowStore((state) => state.focusRequestId === id);
  const clearRestoring = useWindowStore((state) => state.clearRestoring);
  const minimizeWindow = useWindowStore((state) => state.minimizeWindow);
  const reduceMotion = useReducedMotion();

  // Where the window rests: its drag offset, or the corner when maximized.
  const rest = isMaximized ? { x: 0, y: 0 } : (savedOffset ?? { x: 0, y: 0 });
  const x = useMotionValue(rest.x);
  const y = useMotionValue(rest.y);
  // The dock animation moves the visible inner layer only, never the positioned outer
  // one, so it can't disturb dragging or the maximize layout animation.
  const dockX = useMotionValue(0);
  const dockY = useMotionValue(0);
  const scale = useMotionValue(1);
  const opacity = useMotionValue(1);

  // Entrance, run once before first paint so nothing flashes:
  // - back from the dock: start on the dock icon and grow out of it;
  // - opened on purpose: a small scale-and-fade pop;
  // - open on page load: no animation, so server HTML is visible straight away.
  const hasEntered = useRef(false);
  useLayoutEffect(() => {
    if (hasEntered.current) return;
    hasEntered.current = true;
    if (isRestoring) clearRestoring();
    if (reduceMotion) return;

    const offset = isRestoring ? offsetToDock(id, frameRef.current) : null;
    if (offset) {
      dockX.set(offset.dx);
      dockY.set(offset.dy);
      scale.set(DOCKED_SCALE);
      opacity.set(0);
      animate(dockX, 0, outOfDock);
      animate(dockY, 0, outOfDock);
      animate(scale, 1, outOfDock);
      animate(opacity, 1, outOfDock);
    } else if (isOpening) {
      scale.set(0.96);
      opacity.set(0);
      animate(scale, 1, popIn);
      animate(opacity, 1, popIn);
    }
  }, [
    isRestoring,
    isOpening,
    clearRestoring,
    id,
    frameRef,
    reduceMotion,
    dockX,
    dockY,
    scale,
    opacity,
  ]);

  // Maximize/restore: the box itself is animated by `layout`; this slides the drag
  // offset to zero (or back) at the same pace so the two motions line up.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const transition = reduceMotion ? { duration: 0 } : resizeTransition;
    animate(x, rest.x, transition);
    animate(y, rest.y, transition);
  }, [isMaximized, reduceMotion, x, y, rest.x, rest.y]);

  async function minimize() {
    const offset = offsetToDock(id, frameRef.current);
    if (offset && !reduceMotion) {
      await Promise.all([
        animate(dockX, offset.dx, intoDock),
        animate(dockY, offset.dy, intoDock),
        animate(scale, DOCKED_SCALE, intoDock),
        animate(opacity, 0, intoDock),
      ]);
    }
    minimizeWindow(id);
  }

  return { x, y, dockX, dockY, scale, opacity, isMaximized, minimize };
}
