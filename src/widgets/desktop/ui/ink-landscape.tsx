import { InkBirds, InkRidges } from "@/shared/ui";

// The desktop scene, after classic red-sun-over-Fuji prints: a vermilion sun high
// in the empty sky above the hero, ink-wash ridges and their peak along the bottom.
// The sun lives where no window ever sits, so it's visible at every screen size.
export function InkLandscape() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute top-[clamp(16px,4vh,48px)] left-[16%] aspect-square h-[clamp(72px,11vh,132px)] rounded-full bg-accent opacity-90 xl:left-[22%]" />
      <InkBirds className="absolute top-[clamp(52px,10vh,112px)] left-[calc(16%+clamp(84px,13vh,150px))] h-6 w-16 opacity-55 xl:left-[calc(22%+clamp(84px,13vh,150px))]" />
      <InkRidges idPrefix="desk" className="absolute inset-x-0 bottom-0 h-[40%] w-full" />
    </div>
  );
}
