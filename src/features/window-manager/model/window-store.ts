import { create } from "zustand";
import type { ProjectSlug } from "@/shared/content";
import type { WindowId } from "./window-registry";

export type WindowOffset = { x: number; y: number };

type WindowStore = {
  /**
   * Open windows in stacking order; the last id is drawn on top.
   * One array covers both "which are open" and "what's the z-order".
   */
  stack: WindowId[];
  focusedId: WindowId | null;
  /** Set when a window is opened on purpose, so it takes keyboard focus once. */
  focusRequestId: WindowId | null;
  /** How far each window has been dragged from its default spot. */
  offsets: Partial<Record<WindowId, WindowOffset>>;
  /** The project shown in the Project Detail window. */
  activeProjectSlug: ProjectSlug | null;

  openWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  moveWindow: (id: WindowId, offset: WindowOffset) => void;
  showProject: (slug: ProjectSlug) => void;
  clearFocusRequest: () => void;
};

function bringToTop(stack: WindowId[], id: WindowId): WindowId[] {
  return [...stack.filter((openId) => openId !== id), id];
}

export const useWindowStore = create<WindowStore>()((set) => ({
  // First visit: Projects beside the chat, with the chat in front.
  stack: ["projects", "chat"],
  focusedId: "chat",
  focusRequestId: null,
  offsets: {},
  activeProjectSlug: null,

  openWindow: (id) =>
    set((state) => ({
      stack: bringToTop(state.stack, id),
      focusedId: id,
      focusRequestId: id,
    })),

  closeWindow: (id) =>
    set((state) => {
      const stack = state.stack.filter((openId) => openId !== id);
      return { stack, focusedId: stack.at(-1) ?? null };
    }),

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
      focusedId: "project-detail",
      focusRequestId: "project-detail",
    })),

  clearFocusRequest: () => set({ focusRequestId: null }),
}));
