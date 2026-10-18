import { Download, Mail } from "lucide-react";
import { profile } from "@/shared/content";
import { ButtonLink } from "@/shared/ui";

type ProfileHeroProps = {
  /** Mobile home: name, role and the two buttons only, so the chat keeps most of the screen. */
  compact?: boolean;
};

/**
 * Who Binit is and how to reach him, readable in seconds without the chat.
 * The two buttons are the most important links on the site.
 */
export function ProfileHero({ compact = false }: ProfileHeroProps) {
  return (
    <section aria-labelledby="hero-name" className={compact ? "space-y-3" : "space-y-5"}>
      <p className="font-mono text-xs tracking-[0.2em] text-accent-text uppercase">
        {profile.role} · {profile.level} · {profile.location}
      </p>
      <h1
        id="hero-name"
        className={`font-display leading-[1.05] font-extrabold text-balance ${
          compact ? "text-3xl" : "text-5xl xl:text-6xl"
        }`}
      >
        {profile.fullName}
      </h1>
      {!compact && (
        <p className="max-w-prose text-base leading-relaxed text-fg-muted">
          {profile.positioning}
        </p>
      )}
      <div className="flex flex-wrap gap-3 pt-1">
        <ButtonLink
          href={profile.resumeHref}
          download
          icon={<Download aria-hidden className="size-4" />}
        >
          Download resume
        </ButtonLink>
        <ButtonLink
          href={`mailto:${profile.email}`}
          variant="secondary"
          icon={<Mail aria-hidden className="size-4" />}
        >
          Email me
        </ButtonLink>
      </div>
      {!compact && (
        <p className="font-mono text-xs text-fg-muted">
          {profile.yearsOfExperience} ·{" "}
          <a
            href={profile.links.github}
            className="underline-offset-4 hover:text-fg hover:underline"
          >
            GitHub
          </a>{" "}
          ·{" "}
          <a
            href={profile.links.linkedin}
            className="underline-offset-4 hover:text-fg hover:underline"
          >
            LinkedIn
          </a>
        </p>
      )}
    </section>
  );
}
