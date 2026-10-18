/**
 * project — how a single project is presented (card, detail view) and
 * how to look one up by slug. Reads project data from shared/content;
 * owns no state.
 */
export { ProjectCard } from "./ui/project-card";
export { ProjectDetail } from "./ui/project-detail";
export { findProject, projectsFeaturedFirst } from "./model/project-lookup";
