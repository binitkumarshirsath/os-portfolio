/**
 * Every window the site can show. This list is the contract between the two
 * shells (desktop windows, mobile panels), the quick actions, and the agent's
 * openWindow tool, whose Zod enum is built from it on the server.
 */
export const WINDOW_IDS = [
  "chat",
  "projects",
  "project-detail",
  "experience",
  "skills",
  "about",
  "contact",
  "activity",
  "jd-match",
] as const;

export type WindowId = (typeof WINDOW_IDS)[number];
