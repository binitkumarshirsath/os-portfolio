"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/** About 40 words a second: quick, but readable as typing. */
const WORD_DELAY_MS = 25;
/** When further behind than this, reveal several words a tick so long answers don't drag. */
const MAX_BACKLOG_WORDS = 60;

const WORD = /\S+\s*/g;

/** How far the revealed text reaches after one more tick. */
function advance(text: string, from: number): number {
  const words = text.slice(from).match(WORD) ?? [];
  if (words.length === 0) return text.length;
  const step = Math.max(1, Math.ceil(words.length / MAX_BACKLOG_WORDS));
  return from + words.slice(0, step).join("").length;
}

/**
 * Reveals text a word at a time. Groq writes a whole answer in about 0.2 s,
 * which reads as text appearing all at once; pacing it here, rather than on the
 * server, keeps the server fast and the trace's model timings honest.
 * Only answers that were streaming when they appeared are paced; history shows at once.
 */
export function useTypewriter(
  text: string,
  enabled: boolean,
): { shown: string; isTyping: boolean } {
  const reduceMotion = useReducedMotion();
  const [shown, setShown] = useState(enabled ? 0 : Infinity);
  const isTyping = enabled && !reduceMotion && shown < text.length;

  useEffect(() => {
    if (!isTyping) return;
    const timer = setTimeout(() => setShown(advance(text, shown)), WORD_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isTyping, text, shown]);

  return { shown: isTyping ? text.slice(0, shown) : text, isTyping };
}
