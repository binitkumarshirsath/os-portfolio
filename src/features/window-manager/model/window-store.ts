import { create } from "zustand";
import type { ProjectSlug } from "@/shared/content";
import type { WindowId } from "./window-registry";

export type WindowOffset = { x: number; y: number };

type WindowStore = {
  /**
   * Open windows in stacking order; the last id is drawn on top.
   * One array covers both "which are open" and "what's the z-order".
   * Minimized windows stay in it (they're still open, just hidden).
   */
  stack: WindowId[];
  /** Open but hidden; the dock brings them back. */
  minimizedIds: WindowId[];
  /** Filling the whole desktop instead of their default frame. */
  maximizedIds: WindowId[];
  focusedId: WindowId | null;
  /** Set when a window is opened on purpose, so it takes keyboard focus once. */
  focusRequestId: WindowId | null;
  /** How far each window has been dragged from its default spot. */
  offsets: Partial<Record<WindowId, WindowOffset>>;
  /** The project shown in the Project Detail window. */
  activeProjectSlug: ProjectSlug | null;

  openWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  toggleMaximize: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  moveWindow: (id: WindowId, offset: WindowOffset) => void;
  showProject: (slug: ProjectSlug) => void;
  clearFocusRequest: () => void;
};

const without = (ids: WindowId[], id: WindowId) => ids.filter((other) => other !== id);

function bringToTop(stack: WindowId[], id: WindowId): WindowId[] {
  return [...without(stack, id), id];
}

/** Focus falls to the highest window that's actually visible. */
function topVisible(stack: WindowId[], minimizedIds: WindowId[]): WindowId | null {
  return stack.findLast((id) => !minimizedIds.includes(id)) ?? null;
}

export const useWindowStore = create<WindowStore>()((set) => ({
  // First visit: Projects beside the chat, with the chat in front.
  stack: ["projects", "chat"],
  minimizedIds: [],
  maximizedIds: [],
  focusedId: "chat",
  focusRequestId: null,
  offsets: {},
  activeProjectSlug: null,

  // Opening also restores a minimized window, so the dock works for both.
  openWindow: (id) =>
    set((state) => ({
      stack: bringToTop(state.stack, id),
      minimizedIds: without(state.minimizedIds, id),
      focusedId: id,
      focusRequestId: id,
    })),

  closeWindow: (id) =>
    set((state) => {
      const stack = without(state.stack, id);
      const minimizedIds = without(state.minimizedIds, id);
      return {
        stack,
        minimizedIds,
        maximizedIds: without(state.maximizedIds, id),
        focusedId: topVisible(stack, minimizedIds),
      };
    }),

  minimizeWindow: (id) =>
    set((state) => {
      const minimizedIds = [...without(state.minimizedIds, id), id];
      return { minimizedIds, focusedId: topVisible(state.stack, minimizedIds) };
    }),

  toggleMaximize: (id) =>
    set((state) => ({
      maximizedIds: state.maximizedIds.includes(id)
        ? without(state.maximizedIds, id)
        : [...state.maximizedIds, id],
      stack: bringToTop(state.stack, id),
      focusedId: id,
    })),

  focusWindow: (id) =>
    set((state) =>
      state.focusedId === id
        ? state
        : { stack: bringToTop(state.stack, id), focusedId: id },
    ),

  moveWindow: (id, offset) =>
    set((state) => ({ offsets: { ...state.offsets, [id]: offset } })),

  showProject: (slug) =>
    set((state) => ({
      activeProjectSlug: slug,
      stack: bringToTop(state.stack, "project-detail"),
      minimizedIds: without(state.minimizedIds, "project-detail"),
      focusedId: "project-detail",
      focusRequestId: "project-detail",
    })),

  clearFocusRequest: () => set({ focusRequestId: null }),
}));
