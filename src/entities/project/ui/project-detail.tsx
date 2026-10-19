import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/shared/content";
import { ButtonLink, newTab, TagList } from "@/shared/ui";

export function ProjectDetail({ project }: { project: Project }) {
  return (
    <article className="space-y-5 p-5">
      {project.imageUrl && (
        <div className="relative aspect-video overflow-hidden rounded-sm border border-line">
          <Image
            src={project.imageUrl}
            alt={`Screenshot of ${project.title}`}
            fill
            sizes="(min-width: 64rem) 320px, 100vw"
            className="object-cover object-top"
          />
        </div>
      )}

      <header className="space-y-1">
        <p className="font-mono text-[11px] text-fg-muted">
          {project.kind} · {project.period}
        </p>
        <h3 className="font-display text-2xl font-extrabold">{project.title}</h3>
        <p className="text-sm text-accent-text">{project.tagline}</p>
      </header>

      <p className="text-sm leading-relaxed text-fg-muted">{project.description}</p>

      <ul className="space-y-1.5 text-sm">
        {project.highlights.map((highlight) => (
          <li key={highlight} className="flex gap-2">
            <span aria-hidden className="mt-2 size-1 shrink-0 bg-accent" />
            {highlight}
          </li>
        ))}
      </ul>

      <TagList items={project.stack} />

      <div className="flex flex-wrap gap-2">
        {project.links.map((link, index) => (
          <ButtonLink
            key={link.href}
            href={link.href}
            {...newTab}
            variant={index === 0 ? "primary" : "secondary"}
            icon={<ArrowUpRight aria-hidden className="size-4" />}
          >
            {link.label}
          </ButtonLink>
        ))}
      </div>
    </article>
  );
}
