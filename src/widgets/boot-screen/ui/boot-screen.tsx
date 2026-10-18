import { AI_MODELS } from "@/shared/config/ai";
import { BootSkip } from "./boot-skip";

const lines = [
  "> loading binit.os",
  "> mounting windows",
  `> agent online · ${AI_MODELS.primary.id.split("/").at(-1)}`,
];

/**
 * The first-visit boot moment. Pure server HTML + CSS so it never waits for
 * JavaScript: lines type in, then the whole screen fades out by ~1.1s (see
 * .boot-screen in globals.css). Hidden before first paint on repeat visits in a
 * session and under reduced motion. Decorative only, so screen readers skip it.
 */
export function BootScreen() {
  return (
    <div
      aria-hidden
      className="boot-screen fixed inset-0 z-[100] grid place-items-center bg-background"
    >
      <div className="w-64 space-y-1.5 font-mono text-xs text-fg-muted">
        {lines.map((line, index) => (
          <p
            key={line}
            className="boot-line"
            style={{ animationDelay: `${index * 0.22}s` }}
          >
            {line}
          </p>
        ))}
        <p className="boot-line text-accent-text" style={{ animationDelay: "0.66s" }}>
          ▍
        </p>
      </div>
      <BootSkip />
    </div>
  );
}
