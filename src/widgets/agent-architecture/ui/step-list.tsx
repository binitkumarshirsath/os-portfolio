import type { Step } from "../model/steps";

type StepListProps = {
  steps: readonly Step[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

/** Every step as text: a table of contents for the tour, and its keyboard route. */
export function StepList({ steps, activeIndex, onSelect }: StepListProps) {
  return (
    <ol className="space-y-0.5">
      {steps.map((step, i) => {
        const isActive = i === activeIndex;
        return (
          <li key={step.id}>
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-current={isActive ? "step" : undefined}
              className={`flex w-full items-baseline gap-3 rounded-sm px-2 py-1.5 text-left text-sm transition-colors ${
                isActive
                  ? "bg-accent-tint text-fg"
                  : i < activeIndex
                    ? "text-fg/80 hover:bg-raised"
                    : "text-fg-muted hover:bg-raised hover:text-fg"
              }`}
            >
              <span
                className={`w-5 shrink-0 font-mono text-[11px] tabular-nums ${isActive ? "text-accent-text" : ""}`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {step.title}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
