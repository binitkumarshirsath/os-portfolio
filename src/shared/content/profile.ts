import type { Profile } from "./types";

export const profile = {
  name: "Binit",
  fullName: "Binitkumar Shirsath",
  role: "Frontend Engineer",
  level: "SDE2",
  yearsOfExperience: "~3 years",
  location: "Bengaluru, India",
  timeZone: "Asia/Kolkata",
  positioning:
    "Frontend engineer building observability UIs — dashboards and OpenTelemetry metric visualizations.",
  summary:
    "Binitkumar is a Frontend Engineer (SDE2) with about three years of experience, based in Bengaluru. He builds observability interfaces: Datadog-style dashboards and OpenTelemetry metric visualizations. He has also worked full-stack at Reliance Jio and Healthires with React, Next.js, Spring Boot, Node/Express, MongoDB and AWS, and is currently learning AI engineering.",
  currentlyLearning: ["Prompting", "ReAct agents", "Tool calling"],
  email: "binitkumar0911@gmail.com",
  links: {
    github: "https://github.com/binitkumarshirsath",
    linkedin: "https://in.linkedin.com/in/binitkumarshirsath",
    leetcode: "https://leetcode.com/u/binitkumar0911/",
  },
  // Served from public/, so "Download resume" works without leaving the site.
  resumeHref: "/Binitkumar.S_Resume.pdf",
} as const satisfies Profile;
