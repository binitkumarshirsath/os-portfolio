import { tool, type InferUITools } from "ai";
import { z } from "zod";
import { openableWindowIds, projectSlugs } from "./tool-targets";

/**
 * The agent's tools, all in one place. They change what's on the visitor's
 * screen, so the real work happens in the browser (see tool-call-to-ui-action).
 * The server-side `execute` only acknowledges, which lets the model keep writing
 * its answer in the same request instead of a second round trip costing quota.
 *
 * Browser code imports this file for types only, so Zod stays off the client.
 */
// Returned with every tool result. The model reads results right before writing its
// answer, so a reminder here works far better than the same rule in the system prompt
// (measured: without it, "tech stack" questions re-listed every skill from the window).
const shownToVisitor = (shown: string) => ({
  shown,
  note: "The visitor can now see this on screen. Reply in at most 3 sentences and don't list its contents.",
});

export const agentTools = {
  openWindow: tool({
    description:
      "Open a window on the visitor's screen: projects (list), experience, skills, about (summary and education), contact, activity (the agent trace monitor), or jd-match (where the visitor can paste or upload a job description to get a fit report).",
    inputSchema: z.object({ windowId: z.enum(openableWindowIds) }),
    execute: async ({ windowId }) => shownToVisitor(windowId),
  }),
  showProject: tool({
    description:
      "Open the detail window for one project, with its screenshot, highlights, stack and links.",
    inputSchema: z.object({ slug: z.enum(projectSlugs) }),
    execute: async ({ slug }) => shownToVisitor(slug),
  }),
  openResume: tool({
    description:
      "Download Binit's resume PDF. Only when the visitor asks for a resume or CV.",
    inputSchema: z.object({}),
    execute: async () => shownToVisitor("resume download"),
  }),
  showContact: tool({
    description:
      "Open the contact window with Binit's email, LinkedIn, GitHub, LeetCode and resume.",
    inputSchema: z.object({}),
    execute: async () => shownToVisitor("contact window"),
  }),
};

export type AgentTools = InferUITools<typeof agentTools>;
