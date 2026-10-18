import type { JdFit, JdMatchReport } from "./report-schema";

export const fitLabels: Record<JdFit, string> = {
  strong: "Strong fit",
  good: "Good fit",
  partial: "Partial fit",
  low: "Low fit",
};

const TOP_ITEMS = 3;

/**
 * The short version for the chat, so the conversation records the result; the
 * full report stays in its window. Built from the report, with no second model call.
 */
export function summarizeReport(report: JdMatchReport): string {
  const role = [report.role, report.company].filter(Boolean).join(" at ");
  const heading = `${fitLabels[report.fit]}${role ? ` for ${role}` : ""}.`;
  const strongest = report.matches.slice(0, TOP_ITEMS).map((match) => match.requirement);
  const gaps = report.gaps.slice(0, TOP_ITEMS).map((gap) => gap.requirement);

  return [
    `${heading} ${report.summary}`,
    strongest.length > 0 ? `Strongest matches: ${strongest.join("; ")}.` : "",
    gaps.length > 0 ? `Gaps: ${gaps.join("; ")}.` : "",
    "The full report, with evidence for each point, is in the Job Match window.",
  ]
    .filter(Boolean)
    .join("\n\n");
}
