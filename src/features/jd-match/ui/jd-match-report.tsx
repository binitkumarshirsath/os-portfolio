import type { JdFit, JdMatchReport } from "../model/report-schema";
import { fitLabels } from "../model/summarize-report";

const fitStyles: Record<JdFit, string> = {
  strong: "bg-accent text-on-accent",
  good: "bg-accent text-on-accent",
  partial: "bg-accent-deep text-fg",
  low: "bg-line-strong text-fg",
};

const sectionLabel = "font-mono text-[11px] tracking-[0.18em] text-fg-muted uppercase";

type JdMatchReportViewProps = {
  report: JdMatchReport;
  truncated: boolean;
};

export function JdMatchReportView({ report, truncated }: JdMatchReportViewProps) {
  const role = [report.role, report.company].filter(Boolean).join(" · ");

  return (
    <article className="space-y-5">
      <header className="space-y-2">
        <span
          className={`inline-block rounded-sm px-2 py-0.5 font-mono text-[11px] tracking-[0.18em] uppercase ${fitStyles[report.fit]}`}
        >
          {fitLabels[report.fit]}
        </span>
        {role && <h3 className="font-display text-xl font-semibold">{role}</h3>}
        <p className="text-sm leading-relaxed text-fg-muted">{report.summary}</p>
      </header>

      {report.matches.length > 0 && (
        <section className="space-y-2">
          <h4 className={sectionLabel}>Matches · {report.matches.length}</h4>
          <ul className="space-y-3">
            {report.matches.map((match) => (
              <li key={match.requirement} className="flex gap-2.5">
                <span
                  aria-hidden
                  className={`mt-1.5 size-2 shrink-0 rounded-full ${
                    match.strength === "direct" ? "bg-accent" : "border border-accent"
                  }`}
                />
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm font-medium">
                    {match.requirement}
                    {/* The dot carries this visually; spell it out for screen readers. */}
                    <span className="sr-only"> ({match.strength} match)</span>
                  </p>
                  <p className="text-xs leading-relaxed text-fg-muted">
                    {match.evidence}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="font-mono text-[10px] text-fg-muted">
            ● direct evidence · ○ related experience
          </p>
        </section>
      )}

      {report.gaps.length > 0 && (
        <section className="space-y-2">
          <h4 className={sectionLabel}>Gaps · {report.gaps.length}</h4>
          <ul className="space-y-3">
            {report.gaps.map((gap) => (
              <li
                key={gap.requirement}
                className="space-y-0.5 border-l border-line-strong pl-3"
              >
                <p className="text-sm font-medium">{gap.requirement}</p>
                <p className="text-xs leading-relaxed text-fg-muted">{gap.note}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {truncated && (
        <p className="text-xs text-fg-muted">
          This job description was long, so only its first part was analysed.
        </p>
      )}
    </article>
  );
}
