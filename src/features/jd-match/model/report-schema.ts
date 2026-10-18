import { z } from "zod";

/**
 * What the model must return for a job match. Field descriptions are sent to the
 * model as part of the JSON schema, so they double as instructions. No min/max
 * constraints: strict structured-output modes reject some of them, so list
 * lengths are trimmed on the server instead.
 *
 * Browser code imports this file for its types only, so Zod stays off the client.
 */
export const jdMatchReportSchema = z.object({
  role: z
    .string()
    .describe("Job title from the description, or an empty string if not stated."),
  company: z
    .string()
    .describe("Hiring company from the description, or an empty string if not stated."),
  fit: z
    .enum(["strong", "good", "partial", "low"])
    .describe(
      "strong: nearly all core requirements backed by evidence. good: core requirements backed, some gaps. partial: several core gaps. low: mostly gaps, or not a job description.",
    ),
  summary: z
    .string()
    .describe("2–3 honest sentences in the third person about how Binit fits this role."),
  matches: z
    .array(
      z.object({
        requirement: z
          .string()
          .describe("A requirement from the job description, in a few words."),
        evidence: z
          .string()
          .describe(
            "Specific evidence from Binit's profile data: name the project, company, metric or skill.",
          ),
        strength: z
          .enum(["direct", "related"])
          .describe(
            "direct: the data shows exactly this. related: adjacent experience, named in the evidence.",
          ),
      }),
    )
    .describe("Requirements Binit's profile data supports, most important first."),
  gaps: z
    .array(
      z.object({
        requirement: z
          .string()
          .describe("A requirement the profile data doesn't support."),
        note: z.string().describe("One short, factual line on what's missing."),
      }),
    )
    .describe("Requirements without evidence in the profile data, most important first."),
});

export type JdMatchReport = z.infer<typeof jdMatchReportSchema>;
export type JdFit = JdMatchReport["fit"];
