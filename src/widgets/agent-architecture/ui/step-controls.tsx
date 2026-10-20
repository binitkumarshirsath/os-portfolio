import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { OVERVIEW, type StepPlayer } from "../model/use-step-player";

const iconButton =
  "grid size-10 place-items-center rounded-sm border border-line-strong text-fg-muted transition-colors hover:border-accent hover:text-accent-text disabled:border-line disabled:text-line-strong";

/** Previous, play/pause, next and back-to-overview, like a small media player. */
export function StepControls({ player }: { player: StepPlayer }) {
  const { index, isPlaying, isLast } = player;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Previous step"
        onClick={player.prev}
        disabled={index === OVERVIEW}
        className={iconButton}
      >
        <SkipBack aria-hidden className="size-4" />
      </button>
      <button
        type="button"
        onClick={isPlaying ? player.pause : player.play}
        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-sm bg-accent px-4 text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep"
      >
        {isPlaying ? (
          <Pause aria-hidden className="size-4" />
        ) : (
          <Play aria-hidden className="size-4" />
        )}
        {isPlaying
          ? "Pause"
          : index === OVERVIEW
            ? "Play"
            : isLast
              ? "Play again"
              : "Play from here"}
      </button>
      <button
        type="button"
        aria-label="Next step"
        onClick={player.next}
        disabled={isLast}
        className={iconButton}
      >
        <SkipForward aria-hidden className="size-4" />
      </button>
      <button
        type="button"
        aria-label="Back to the whole diagram"
        title="Back to the whole diagram"
        onClick={player.reset}
        disabled={index === OVERVIEW}
        className={iconButton}
      >
        <RotateCcw aria-hidden className="size-4" />
      </button>
    </div>
  );
}
