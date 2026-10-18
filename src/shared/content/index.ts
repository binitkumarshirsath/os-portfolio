/**
 * The single source of truth for Binit's portfolio content.
 * UI windows, quick actions and the AI system prompt all import from here;
 * nothing about Binit should be hardcoded anywhere else.
 * Updating the portfolio means editing files in this folder only.
 */
export { profile } from "./profile";
export { projects, type ProjectSlug } from "./projects";
export { experience } from "./experience";
export { skills } from "./skills";
export { education } from "./education";
export { siteArchitecture } from "./site";
export type {
  Profile,
  Project,
  ProjectLink,
  Experience,
  SkillGroup,
  Education,
} from "./types";
