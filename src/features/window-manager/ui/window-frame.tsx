"use client";

import { motion, useDragControls, useMotionValue } from "motion/react";
import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { windowRegistry, type WindowId } from "../model/window-registry";
import { useWindowStore } from "../model/window-store";
import { TitleBar } from "./title-bar";

type WindowFrameProps = {
  id: WindowId;
  /** The area windows can be dragged within. */
  boundsRef: RefObject<HTMLElement | null>;
  children: ReactNode;
};

export function WindowFrame({ id, boundsRef, children }: WindowFrameProps) {
  const { title, frame } = windowRegistry[id];
  const stackIndex = useWindowStore((state) => state.stack.indexOf(id));
  const isFocused = useWindowStore((state) => state.focusedId === id);
  const hasFocusRequest = useWindowStore((state) => state.focusRequestId === id);
  const savedOffset = useWindowStore((state) => state.offsets[id]);
  const focusWindow = useWindowStore((state) => state.focusWindow);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const moveWindow = useWindowStore((state) => state.moveWindow);
  const clearFocusRequest = useWindowStore((state) => state.clearFocusRequest);

  const dragControls = useDragControls();
  const x = useMotionValue(savedOffset?.x ?? 0);
  const y = useMotionValue(savedOffset?.y ?? 0);
  const frameRef = useRef<HTMLDivElement>(null);
  // Whatever opened this window (a dock button, a project card) gets focus back on close.
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleId = `window-title-${id}`;

  useEffect(() => {
    if (!hasFocusRequest) return;
    const opener = document.activeElement;
    if (opener instanceof HTMLElement && !frameRef.current?.contains(opener)) {
      returnFocusRef.current = opener;
    }
    frameRef.current?.focus();
    clearFocusRequest();
  }, [hasFocusRequest, clearFocusRequest]);

  function close() {
    closeWindow(id);
    // Windows open on first load have no opener, so fall back to their dock button.
    const target =
      returnFocusRef.current ??
      document.querySelector<HTMLElement>(`[data-window-trigger="${id}"]`);
    if (target?.isConnected) target.focus();
  }

  return (
    <motion.div
      ref={frameRef}
      role="dialog"
      aria-labelledby={titleId}
      tabIndex={-1}
      drag
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={boundsRef}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={() => moveWindow(id, { x: x.get(), y: y.get() })}
      onPointerDown={() => focusWindow(id)}
      onFocus={() => focusWindow(id)}
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        event.stopPropagation();
        close();
      }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      style={{
        x,
        y,
        zIndex: 10 + stackIndex,
        top: frame.top,
        right: frame.right,
        width: frame.width,
        height: frame.height,
        maxHeight: `calc(100% - ${frame.top + 16}px)`,
      }}
      className={`pointer-events-auto absolute flex flex-col overflow-hidden rounded-md border bg-surface shadow-[0_24px_60px_-24px_rgb(0_0_0/0.9)] outline-none ${
        isFocused ? "border-accent-deep" : "border-line"
      }`}
    >
      <TitleBar
        titleId={titleId}
        title={title}
        isFocused={isFocused}
        onClose={close}
        onDragStart={(event) => dragControls.start(event)}
      />
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </motion.div>
  );
}
