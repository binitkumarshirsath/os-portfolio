import { Download, Mail } from "lucide-react";
import { experience, profile } from "@/shared/content";
import { ButtonLink, newTab } from "@/shared/ui";

type ProfileHeroProps = {
  /** Mobile home: name, role and the two buttons only, so the chat keeps most of the screen. */
  compact?: boolean;
};

// The current role, straight from the experience content: whichever entry ends "Present".
const currentRole = experience.find((role) => role.end === "Present");

/**
 * Who Binit is and how to reach him, readable in seconds without the chat.
 * The two buttons are the most important links on the site.
 */
export function ProfileHero({ compact = false }: ProfileHeroProps) {
  return (
    <section
      aria-labelledby="hero-name"
      className={`relative ${compact ? "space-y-3" : "space-y-5"}`}
    >
      {!compact && (
        // His name in katakana, set vertically in the margin like an anime title card.
        // Decorative: the real name is the heading below.
        <span
          aria-hidden
          className="absolute top-12 -left-10 font-display text-sm font-semibold tracking-[0.35em] text-accent [writing-mode:vertical-rl]"
        >
          ビニット
        </span>
      )}
      <p className="flex items-center gap-3 font-mono text-xs tracking-[0.14em] whitespace-nowrap text-accent-text uppercase">
        <span aria-hidden className="h-px w-6 shrink-0 bg-accent" />
        {/* One line whatever the font: wrapping here shifted the whole page once
            JetBrains Mono replaced its wider fallback (measured CLS 0.24). */}
        <span className="truncate">
          {profile.role} · {profile.level}
          {/* The desktop hero column is narrowest at lg, so the city waits for xl there. */}
          <span className={compact ? "" : "hidden xl:inline"}>
            {" "}
            · {profile.location.split(",")[0]}
          </span>
        </span>
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
      {currentRole && (
        <p className="flex items-center gap-2 text-sm text-fg-muted">
          <span aria-hidden className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent/60" />
            <span className="relative size-2 rounded-full bg-accent" />
          </span>
          <span>
            Now · <span className="text-fg">{currentRole.role}</span> at{" "}
            <span className="text-fg">{currentRole.company}</span>
          </span>
        </p>
      )}
      <div className="flex flex-wrap gap-3 pt-1">
        <ButtonLink
          href={profile.resumeHref}
          download
          {...newTab}
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
            {...newTab}
            className="underline-offset-4 hover:text-fg hover:underline"
          >
            GitHub
          </a>{" "}
          ·{" "}
          <a
            href={profile.links.linkedin}
            {...newTab}
            className="underline-offset-4 hover:text-fg hover:underline"
          >
            LinkedIn
          </a>{" "}
          ·{" "}
          <a
            href={profile.links.leetcode}
            {...newTab}
            className="underline-offset-4 hover:text-fg hover:underline"
          >
            LeetCode
          </a>
        </p>
      )}
    </section>
  );
}
