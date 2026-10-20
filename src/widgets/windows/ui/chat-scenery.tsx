import { InkRidges } from "@/shared/ui";

/**
 * Ink ridges along the foot of the chat, so an empty conversation isn't a blank
 * page. On phones a small sun rises between them, since the phone layout has no
 * sky of its own; the desktop already has one above the hero.
 */
export function ChatScenery({ withSun }: { withSun: boolean }) {
  return (
    <div className="relative h-28 w-full">
      {withSun && (
        <div className="absolute bottom-[42%] left-[68%] size-14 -translate-x-1/2 translate-y-1/2 rounded-full bg-accent opacity-90" />
      )}
      <InkRidges idPrefix="chat" className="absolute inset-0 h-full w-full" />
    </div>
  );
}
