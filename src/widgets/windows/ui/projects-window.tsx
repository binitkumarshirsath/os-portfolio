"use client";

import { ProjectCard, projectsFeaturedFirst } from "@/entities/project";
import { useWindowStore } from "@/features/window-manager";

export function ProjectsWindow() {
  const showProject = useWindowStore((state) => state.showProject);

  return (
    <div className="space-y-2 p-3">
      <p className="px-1 font-mono text-[11px] text-fg-muted">
        {projectsFeaturedFirst.length} projects · featured first
      </p>
      <ul className="space-y-2">
        {projectsFeaturedFirst.map((project) => (
          <li key={project.slug}>
            <ProjectCard project={project} onSelect={() => showProject(project.slug)} />
          </li>
        ))}
      </ul>
    </div>
  );
}
