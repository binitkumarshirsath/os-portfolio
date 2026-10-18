"use client";

import { findProject, ProjectDetail } from "@/entities/project";
import { useWindowStore } from "@/features/window-manager";

export function ProjectDetailWindow() {
  const slug = useWindowStore((state) => state.activeProjectSlug);
  const project = slug ? findProject(slug) : undefined;

  if (!project) {
    return (
      <p className="p-5 text-sm text-fg-muted">
        Pick a project from the Projects window.
      </p>
    );
  }
  return <ProjectDetail project={project} />;
}
