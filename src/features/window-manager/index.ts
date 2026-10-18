/**
 * window-manager — the registry of windows plus one small Zustand store
 * (which are open, which has focus, stacking order, drag offsets).
 * Both the desktop and mobile shells render from this same registry;
 * what goes *inside* each window is supplied by the widgets layer.
 */
export {
  WINDOW_IDS,
  DOCK_WINDOW_IDS,
  MOBILE_TAB_IDS,
  isMobileTab,
  windowRegistry,
  type WindowId,
  type WindowDefinition,
} from "./model/window-registry";
export { useWindowStore, type WindowOffset } from "./model/window-store";
export { runUiAction } from "./model/run-ui-action";
export { WindowFrame } from "./ui/window-frame";
