export type Mode = "tour" | "replay";

type ModeSwitchProps = {
  mode: Mode;
  hasReplay: boolean;
  onChange: (mode: Mode) => void;
};

const options: { value: Mode; label: string }[] = [
  { value: "tour", label: "Guided tour" },
  { value: "replay", label: "Replay my question" },
];

/** Tour (how it works in general) or replay (what happened to your own last question). */
export function ModeSwitch({ mode, hasReplay, onChange }: ModeSwitchProps) {
  return (
    <div className="space-y-2">
      <div
        role="group"
        aria-label="View"
        className="grid grid-cols-2 rounded-sm border border-line-strong p-0.5"
      >
        {options.map(({ value, label }) => {
          const disabled = value === "replay" && !hasReplay;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={mode === value}
              disabled={disabled}
              onClick={() => onChange(value)}
              className={`h-8 rounded-[3px] text-sm transition-colors ${
                mode === value
                  ? "bg-fg text-background"
                  : "text-fg-muted hover:text-fg disabled:text-line-strong"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      {!hasReplay && (
        <p className="text-xs leading-relaxed text-fg-muted">
          Ask the agent a question on the desktop, then come back: it replays here with
          its real timings. It stays in your browser only.
        </p>
      )}
    </div>
  );
}
