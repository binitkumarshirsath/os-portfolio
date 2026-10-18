import { WINDOW_IDS, type WindowId } from "@/shared/config/windows";
import { projects, type ProjectSlug } from "@/shared/content";

// What the agent's tools are allowed to point at, straight from the registry and
// content, so the model can only name windows and projects that exist. Project
// Detail is reached through showProject (it needs a slug) and the chat is
// already open, so neither is offered to openWindow.
export const openableWindowIds = WINDOW_IDS.filter(
  (id) => id !== "project-detail" && id !== "chat",
);
export const projectSlugs = projects.map((project) => project.slug);

export const isOpenableWindowId = (value: unknown): value is WindowId =>
  openableWindowIds.some((id) => id === value);

export const isProjectSlug = (value: unknown): value is ProjectSlug =>
  projectSlugs.some((slug) => slug === value);
