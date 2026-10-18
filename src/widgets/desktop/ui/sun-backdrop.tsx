// The site's one signature visual: a red sun with a thin ring, and faint scan lines.
// Pure CSS, decorative only, so it is hidden from assistive tech.
export function SunBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute top-1/2 right-[12%] aspect-square h-[76%] -translate-y-1/2 rounded-full bg-accent/15">
        <div className="absolute -inset-7 rounded-full border border-accent/35" />
      </div>
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0 7px, color-mix(in srgb, var(--color-accent) 16%, transparent) 7px 8px)",
          maskImage: "linear-gradient(to top, black, transparent)",
        }}
      />
    </div>
  );
}
