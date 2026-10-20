"use client";

import { useEffect, useState } from "react";
import type { Step } from "./steps";

/** -1 is the overview: nothing highlighted, the whole diagram in view. */
export const OVERVIEW = -1;

export type StepPlayer = {
  index: number;
  step: Step | null;
  isPlaying: boolean;
  isLast: boolean;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  reset: () => void;
};

/**
 * Steps through a tour, advancing on each step's own timer while playing.
 * Manual moves keep playing from the new step, as a video scrubber would.
 */
export function useStepPlayer(steps: readonly Step[]): StepPlayer {
  const [index, setIndex] = useState(OVERVIEW);
  const [isPlaying, setIsPlaying] = useState(false);
  const last = steps.length - 1;
  const step = steps[index] ?? null;

  useEffect(() => {
    if (!isPlaying || !step) return;
    const timer = setTimeout(() => {
      if (index < last) setIndex(index + 1);
      else setIsPlaying(false);
    }, step.durationMs);
    return () => clearTimeout(timer);
  }, [isPlaying, step, index, last]);

  const clamp = (value: number) => Math.min(last, Math.max(OVERVIEW, value));

  return {
    index,
    step,
    isPlaying,
    isLast: index === last,
    play: () => {
      // From the overview or the end, play starts over.
      if (index === OVERVIEW || index === last) setIndex(0);
      setIsPlaying(true);
    },
    pause: () => setIsPlaying(false),
    next: () => setIndex(clamp(index + 1)),
    prev: () => setIndex(clamp(index - 1)),
    goTo: (target) => setIndex(clamp(target)),
    reset: () => {
      setIsPlaying(false);
      setIndex(OVERVIEW);
    },
  };
}
