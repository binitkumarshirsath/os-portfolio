"use client";

import {
  animate,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
  type Transition,
} from "motion/react";
import { useLayoutEffect, useRef, type RefObject } from "react";
import type { WindowDefinition, WindowId } from "../model/window-registry";
import { useWindowStore } from "../model/window-store";

/** Gap kept around a maximized window, in px. */
const INSET = 12;
const resize: Transition = { duration: 0.28, ease: [0.32, 0.72, 0, 1] };

type Geometry = { x: number; y: number; width: number; height: number };

/**
 * Offsets and size that make a window fill `area`, given where it is now.
 * Windows are anchored by `right`, so growing the width also moves the left
 * edge; the target x accounts for that.
 */
function maximizedGeometry(
  current: DOMRect,
  area: DOMRect,
  offset: { x: number; y: number },
): Geometry {
  const width = area.width - 2 * INSET;
  const height = area.height - 2 * INSET;
  const leftWithoutOffset = current.left - offset.x - (width - current.width);
  const topWithoutOffset = current.top - offset.y;
  return {
    width,
    height,
    x: area.left + INSET - leftWithoutOffset,
    y: area.top + INSET - topWithoutOffset,
  };
}

type Options = {
  id: WindowId;
  frame: WindowDefinition["frame"];
  frameRef: RefObject<HTMLElement | null>;
  boundsRef: RefObject<HTMLElement | null>;
  /** The drag offset, shared with dragging. */
  x: MotionValue<number>;
  y: MotionValue<number>;
};

/**
 * Maximize and restore by animating the window's own geometry: offset and size
 * move together to the target rectangle, on one easing, so the edges travel in
 * straight lines. (Motion's `layout` animation was used before, but its drag
 * feature rescales the drag offset when layout changes, which left dragged
 * windows maximized partly off screen.)
 */
export function useWindowMaximize({ id, frame, frameRef, boundsRef, x, y }: Options) {
  const isMaximized = useWindowStore((state) => state.maximizedIds.includes(id));
  const savedOffset = useWindowStore((state) => state.offsets[id]);
  const storeToggle = useWindowStore((state) => state.toggleMaximize);
  const reduceMotion = useReducedMotion();

  // CSS sizes while restored (the chat's width is a clamp()); px while maximized.
  const width = useMotionValue<number | string>(frame.width);
  const height = useMotionValue<number | string>(frame.height);
  // The restored size in px, so restoring can animate back to it.
  const restoredSize = useRef<{ width: number; height: number } | null>(null);

  async function toggleMaximize(): Promise<void> {
    const current = frameRef.current?.getBoundingClientRect();
    const area = boundsRef.current?.getBoundingClientRect();
    if (!current || !area) return;
    const transition = reduceMotion ? { duration: 0 } : resize;
    // Pin the size in px first: a clamp() can't be animated to a number.
    width.set(current.width);
    height.set(current.height);

    if (!isMaximized) {
      const target = maximizedGeometry(current, area, { x: x.get(), y: y.get() });
      restoredSize.current = { width: current.width, height: current.height };
      storeToggle(id);
      await Promise.all([
        animate(x, target.x, transition),
        animate(y, target.y, transition),
        animate(width, target.width, transition),
        animate(height, target.height, transition),
      ]);
      return;
    }

    storeToggle(id);
    const offset = savedOffset ?? { x: 0, y: 0 };
    // Reopened from the dock while maximized, there's no remembered size to animate to.
    if (restoredSize.current) {
      await Promise.all([
        animate(x, offset.x, transition),
        animate(y, offset.y, transition),
        animate(width, restoredSize.current.width, transition),
        animate(height, restoredSize.current.height, transition),
      ]);
    } else {
      x.set(offset.x);
      y.set(offset.y);
    }
    // Back to the CSS sizes, so the window keeps responding to the viewport.
    width.set(frame.width);
    height.set(frame.height);
  }

  // While maximized: fill at once if mounted that way (reopened from the dock),
  // and keep filling if the browser window is resized.
  useLayoutEffect(() => {
    if (!isMaximized) return;
    const snap = () => {
      const current = frameRef.current?.getBoundingClientRect();
      const area = boundsRef.current?.getBoundingClientRect();
      if (!current || !area) return;
      const target = maximizedGeometry(current, area, { x: x.get(), y: y.get() });
      x.set(target.x);
      y.set(target.y);
      width.set(target.width);
      height.set(target.height);
    };
    if (restoredSize.current === null) snap();
    window.addEventListener("resize", snap);
    return () => window.removeEventListener("resize", snap);
  }, [isMaximized, frameRef, boundsRef, x, y, width, height]);

  return { width, height, isMaximized, toggleMaximize };
}
