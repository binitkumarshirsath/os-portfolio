"use client";

import { motion, useDragControls } from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent,
  type RefObject,
} from "react";
import { windowRegistry, type WindowId } from "../model/window-registry";
import { useWindowStore } from "../model/window-store";
import { TitleBar } from "./title-bar";
import { useWindowMaximize } from "./use-window-maximize";
import { useWindowMotion } from "./use-window-motion";

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
  const focusWindow = useWindowStore((state) => state.focusWindow);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const moveWindow = useWindowStore((state) => state.moveWindow);
  const clearFocusRequest = useWindowStore((state) => state.clearFocusRequest);

  const dragControls = useDragControls();
  const frameRef = useRef<HTMLDivElement>(null);
  const motionValues = useWindowMotion(id, frameRef);
  const { x, y, dockX, dockY, scale, opacity } = motionValues;
  const { width, height, isMaximized, toggleMaximize } = useWindowMaximize({
    id,
    frame,
    frameRef,
    boundsRef,
    x,
    y,
  });
  // Whatever opened this window (a dock button, a project card) gets focus back on close.
  const returnFocusRef = useRef<HTMLElement | null>(null);
  // Drag limits as plain numbers, measured when a drag begins. Not a ref to the desktop:
  // with a ref, Motion watches this window's size and repositions it whenever it
  // changes, which cancels the maximize/restore animation halfway. Motion reads these
  // once the pointer has moved past its drag threshold, after this state has rendered.
  const [dragBounds, setDragBounds] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
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

  function startDrag(event: PointerEvent) {
    if (isMaximized) return;
    const window = frameRef.current?.getBoundingClientRect();
    const area = boundsRef.current?.getBoundingClientRect();
    if (window && area) {
      // How far x/y may travel before an edge leaves the desktop area.
      setDragBounds({
        left: x.get() - (window.left - area.left),
        right: x.get() + (area.right - window.right),
        top: y.get() - (window.top - area.top),
        bottom: y.get() + (area.bottom - window.bottom),
      });
    }
    dragControls.start(event);
  }

  async function minimize() {
    await motionValues.minimize();
    // The window now lives in the dock, so that's where focus goes.
    dockButton()?.focus();
  }

  return (
    <motion.div
      ref={frameRef}
      role="dialog"
      aria-labelledby={titleId}
      tabIndex={-1}
      drag={!isMaximized}
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={dragBounds}
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
      style={{
        top: frame.top,
        right: frame.right,
        width,
        height,
        // The frame height gives way on short screens; a maximized window sizes itself.
        maxHeight: isMaximized ? "none" : `calc(100% - ${frame.top + 16}px)`,
        x,
        y,
        zIndex: 10 + stackIndex,
      }}
      className="pointer-events-auto absolute outline-none"
    >
      {/* Two layers on purpose: the outer one owns position and size (drag, maximize),
          this inner one owns scale and fade (dock, open, close), so the two kinds
          of animation never touch the same element. */}
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
          onToggleMaximize={toggleMaximize}
          onDragStart={startDrag}
        />
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </motion.div>
    </motion.div>
  );
}
