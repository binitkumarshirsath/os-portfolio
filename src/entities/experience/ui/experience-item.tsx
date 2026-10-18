import type { Experience } from "@/shared/content";
import { TagList } from "@/shared/ui";

/** One role on the timeline. The red rule on the left is the timeline itself. */
export function ExperienceItem({ experience }: { experience: Experience }) {
  return (
    <article className="relative space-y-3 border-l border-line-strong pb-6 pl-5 last:pb-0">
      <span
        aria-hidden
        className="absolute top-1.5 -left-[5px] size-2.5 rounded-full bg-accent"
      />
      <header>
        <p className="font-mono text-[11px] text-fg-muted">
          {experience.start} – {experience.end}
          {experience.location && ` · ${experience.location}`}
        </p>
        <h3 className="font-display text-lg font-semibold">{experience.role}</h3>
        <p className="text-sm text-accent-text">{experience.company}</p>
      </header>
      <ul className="space-y-1.5 text-sm leading-snug text-fg-muted">
        {experience.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
      <TagList items={experience.stack} />
    </article>
  );
}
