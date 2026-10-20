import { motion } from "motion/react";
import type { Step } from "../model/steps";

type StepCardProps = {
  step: Step | null;
  index: number;
  total: number;
  isPlaying: boolean;
  showTechnical: boolean;
  /** What to say before the tour starts. */
  overview: { title: string; text: string };
};

const eyebrow = "font-mono text-[11px] tracking-[0.18em] text-fg-muted uppercase";

/** The current step in words. Announced politely, so screen readers follow the tour too. */
export function StepCard({
  step,
  index,
  total,
  isPlaying,
  showTechnical,
  overview,
}: StepCardProps) {
  return (
    <div aria-live="polite" className="relative min-h-40 space-y-2">
      <p className={eyebrow}>{step ? `Step ${index + 1} of ${total}` : "Overview"}</p>
      <h2 className="font-display text-xl leading-snug font-semibold text-fg">
        {step?.title ?? overview.title}
      </h2>
      <p className="text-[15px] leading-relaxed text-fg/90">
        {step?.plain ?? overview.text}
      </p>
      {step && showTechnical && (
        <p className="rounded-sm border-l-2 border-ochre bg-raised/60 px-3 py-2 font-mono text-xs leading-relaxed text-fg-muted">
          {step.technical}
        </p>
      )}
      {/* How long until autoplay moves on; restarts with each step. */}
      {step && isPlaying && (
        <motion.div
          key={step.id}
          aria-hidden
          className="absolute -bottom-3 left-0 h-0.5 w-full origin-left bg-accent/70"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: step.durationMs / 1000, ease: "linear" }}
        />
      )}
    </div>
  );
}
