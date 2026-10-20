// The site's signature visual: a crimson sun setting behind the windows, cut into
// bars below the horizon (see .sun in globals.css), with a thin ring and faint scan
// lines at the bottom. Pure CSS and decorative, so it's hidden from assistive tech.
export function SunBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute right-[13%] bottom-[8%] aspect-square h-[74%]">
        <div className="sun absolute inset-0 rounded-full" />
        <div className="absolute -inset-6 rounded-full border border-accent/25" />
      </div>
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0 7px, color-mix(in srgb, var(--color-accent) 14%, transparent) 7px 8px)",
          maskImage: "linear-gradient(to top, black, transparent)",
        }}
      />
    </div>
  );
}
