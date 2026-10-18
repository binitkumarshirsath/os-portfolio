/**
 * Server-only entry for jd-match, used by app/api/jd-match/route.ts.
 * Reads uploads (PDF/DOCX/TXT) and runs the match; nothing is stored.
 */
export { readJobDescription } from "./read-job-description";
export { matchJobDescription } from "./match-job-description";
