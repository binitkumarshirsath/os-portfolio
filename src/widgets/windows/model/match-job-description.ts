import { appendLocalExchange } from "@/features/agent-chat";
import { submitJobDescription, summarizeReport, type JdInput } from "@/features/jd-match";
import { runUiAction } from "@/features/window-manager";

/**
 * One job match, wherever it starts (the chat paperclip or the Job Match form):
 * show the window, run the match, then record a short summary in the chat so the
 * conversation, and the agent's later answers, know it happened.
 */
export async function matchJobDescription(input: JdInput): Promise<void> {
  runUiAction({ type: "openWindow", windowId: "jd-match" });
  const outcome = await submitJobDescription(input);
  if (outcome.ok) {
    appendLocalExchange(
      `Match this job description: ${outcome.label}`,
      summarizeReport(outcome.report),
      "jd-match",
    );
  }
}
