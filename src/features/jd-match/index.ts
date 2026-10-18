/**
 * jd-match — compare a job description with Binit's profile.
 * A recruiter pastes or uploads a JD (PDF, DOCX, TXT); the server extracts the
 * text and one model call returns a structured report: fit, matches with
 * evidence, and honest gaps. Server code lives behind ./server.
 */
export { JdMatchPanel } from "./ui/jd-match-panel";
export { JdAttachButton } from "./ui/jd-attach-button";
export { submitJobDescription, type JdInput } from "./model/jd-match-store";
export { summarizeReport } from "./model/summarize-report";
export type { JdMatchReport } from "./model/report-schema";
