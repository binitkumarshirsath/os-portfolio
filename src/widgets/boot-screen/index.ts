/**
 * boot-screen — the short "> loading binit.os" moment on a first visit.
 * BootScreen goes in the page, BootScript in <head>; once per tab session,
 * skippable, and never shown with reduced motion.
 */
export { BootScreen } from "./ui/boot-screen";
export { BootScript } from "./ui/boot-script";
