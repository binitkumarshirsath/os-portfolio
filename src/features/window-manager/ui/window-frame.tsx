"use client";

import { motion, useDragControls } from "motion/react";
import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { windowRegistry, type WindowId } from "../model/window-registry";
import { useWindowStore } from "../model/window-store";
import { TitleBar } from "./title-bar";
import { resizeTransition, useWindowMotion } from "./use-window-motion";

type WindowFrameProps = {
  id: WindowId;
  /** The area windows can be dragged within. */
  boundsRef: RefObject<HTMLElement | null>;
  children: ReactNode;
};

const MAXIMIZED_INSET = 12;

export function WindowFrame({ id, boundsRef, children }: WindowFrameProps) {
  const { title, frame } = windowRegistry[id];
  const stackIndex = useWindowStore((state) => state.stack.indexOf(id));
  const isFocused = useWindowStore((state) => state.focusedId === id);
  const hasFocusRequest = useWindowStore((state) => state.focusRequestId === id);
  const focusWindow = useWindowStore((state) => state.focusWindow);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const toggleMaximize = useWindowStore((state) => state.toggleMaximize);
  const moveWindow = useWindowStore((state) => state.moveWindow);
  const clearFocusRequest = useWindowStore((state) => state.clearFocusRequest);

  const dragControls = useDragControls();
  const frameRef = useRef<HTMLDivElement>(null);
  const motionValues = useWindowMotion(id, frameRef);
  const { x, y, dockX, dockY, scale, opacity, isMaximized } = motionValues;
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

  const dockButton = () =>
    document.querySelector<HTMLElement>(`[data-window-trigger="${id}"]`);

  function close() {
    closeWindow(id);
    // Windows open on first load have no opener, so fall back to their dock button.
    const target = returnFocusRef.current ?? dockButton();
    if (target?.isConnected) target.focus();
  }

  async function minimize() {
    await motionValues.minimize();
    // The window now lives in the dock, so that's where focus goes.
    dockButton()?.focus();
  }

  // Maximized windows fill the desktop; the drag offset is kept in the store for restore.
  const placement = isMaximized
    ? { inset: MAXIMIZED_INSET }
    : {
        top: frame.top,
        right: frame.right,
        width: frame.width,
        height: frame.height,
        maxHeight: `calc(100% - ${frame.top + 16}px)`,
      };

  return (
    <motion.div
      ref={frameRef}
      role="dialog"
      aria-labelledby={titleId}
      tabIndex={-1}
      drag={!isMaximized}
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
      // `layout` animates the box between its frame and the full desktop; the
      // dependency stops it from running on any other re-render.
      layout
      layoutDependency={isMaximized}
      transition={{ layout: resizeTransition }}
      style={{ ...placement, x, y, borderRadius: 6, zIndex: 10 + stackIndex }}
      className="pointer-events-auto absolute outline-none"
    >
      {/* Two layers on purpose: the outer one owns position and size (drag, layout),
          this inner one owns scale and fade (dock, open, close). Putting a scale on
          the same element as `layout` makes Motion's size correction fight it. */}
      <motion.div
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        style={{ x: dockX, y: dockY, scale, opacity }}
        className={`flex size-full flex-col overflow-hidden rounded-md border bg-surface shadow-[0_24px_60px_-24px_rgb(0_0_0/0.9)] ${
          isFocused ? "border-accent-deep" : "border-line"
        }`}
      >
        <TitleBar
          titleId={titleId}
          title={title}
          isFocused={isFocused}
          isMaximized={isMaximized}
          onClose={close}
          onMinimize={minimize}
          onToggleMaximize={() => toggleMaximize(id)}
          onDragStart={(event) => {
            if (!isMaximized) dragControls.start(event);
          }}
        />
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </motion.div>
    </motion.div>
  );
}
