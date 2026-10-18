/**
 * windows — the content of every window, keyed by window id.
 * Lives in widgets (not in window-manager) because it composes several
 * features and entities; the app page hands this map to whichever shell
 * is on screen.
 */
export { windowBodies, type WindowBodies } from "./ui/window-bodies";
