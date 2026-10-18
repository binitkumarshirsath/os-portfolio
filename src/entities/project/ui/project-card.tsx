import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/shared/content";
import { Tag } from "@/shared/ui";

type ProjectCardProps = {
  project: Project;
  /** The card doesn't know about windows; the caller decides what "open" means. */
  onSelect: () => void;
};

const STACK_PREVIEW_COUNT = 4;

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group block w-full rounded-sm border border-line bg-background/40 p-3 text-left transition-colors hover:border-line-strong hover:bg-raised"
    >
      <span className="flex items-center justify-between gap-2">
        <span className="font-display text-lg font-semibold">{project.title}</span>
        <ArrowUpRight
          aria-hidden
          className="size-4 text-fg-muted transition-colors group-hover:text-accent"
        />
      </span>
      <span className="mt-0.5 block font-mono text-[11px] text-fg-muted">
        {project.featured && <span className="text-accent-text">Featured · </span>}
        {project.kind} · {project.period}
      </span>
      <span className="mt-2 block text-sm leading-snug text-fg-muted">
        {project.tagline}
      </span>
      <span className="mt-3 flex flex-wrap gap-1.5">
        {project.stack.slice(0, STACK_PREVIEW_COUNT).map((item) => (
          <Tag key={item}>{item}</Tag>
        ))}
      </span>
    </button>
  );
}
