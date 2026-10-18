import { projects, type ProjectSlug } from "@/shared/content";

// The exact type of the content array, so slugs stay literal ("devflow", …) rather
// than widening to string. That's what lets showProject(slug) reject typos.
type ContentProject = (typeof projects)[number];

export function findProject(slug: ProjectSlug): ContentProject | undefined {
  return projects.find((project) => project.slug === slug);
}

/** Featured projects first, otherwise in the order they're written in content. */
export const projectsFeaturedFirst: readonly ContentProject[] = [
  ...projects.filter((project) => project.featured),
  ...projects.filter((project) => !project.featured),
];
