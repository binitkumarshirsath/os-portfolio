import { ROUTES } from "@/shared/config/routes";
import type { UiAction } from "@/shared/config/ui-actions";
import {
  experience,
  profile,
  projects,
  siteArchitecture,
  skills,
} from "@/shared/content";

export type QuickAction = {
  id: string;
  /** Text on the chip. */
  label: string;
  /** What appears in the chat as the visitor's question. */
  question: string;
  /** Pre-written from content, so it's instant and never invents anything. */
  answer: string;
  /** The same UI action the agent's tools would trigger. */
  action: UiAction;
};

const SKILLS_PER_GROUP = 6;

// Content guarantees at least one project; featured ones lead.
const [bestProject, ...otherProjects] = [
  ...projects.filter((project) => project.featured),
  ...projects.filter((project) => !project.featured),
];
const runnerUp = otherProjects.find((project) => project.featured);

const bullets = (lines: readonly string[]) => lines.map((line) => `• ${line}`).join("\n");

export const quickActions: readonly QuickAction[] = [
  {
    id: "best-project",
    label: "Show your best project",
    question: "What's your best project?",
    answer: [
      `${bestProject.title}: ${bestProject.tagline}`,
      bullets(bestProject.highlights),
      runnerUp ? `Also worth a look: ${runnerUp.title}.` : "",
    ]
      .filter(Boolean)
      .join("\n\n"),
    action: { type: "showProject", slug: bestProject.slug },
  },
  {
    id: "experience",
    label: "Your experience",
    question: "What's your experience?",
    answer: [
      `${profile.fullName} is a ${profile.role} (${profile.level}) with ${profile.yearsOfExperience} of experience, based in ${profile.location}.`,
      bullets(
        experience.map(
          (role) => `${role.role} at ${role.company} (${role.start} – ${role.end})`,
        ),
      ),
    ].join("\n\n"),
    action: { type: "openWindow", windowId: "experience" },
  },
  {
    id: "tech-stack",
    label: "Tech stack",
    question: "What's your tech stack?",
    answer: bullets(
      skills.map(
        (group) => `${group.label}: ${group.items.slice(0, SKILLS_PER_GROUP).join(", ")}`,
      ),
    ),
    action: { type: "openWindow", windowId: "skills" },
  },
  {
    id: "resume",
    label: "Download resume",
    question: "Can I get your resume?",
    answer: `Downloading ${profile.name}'s resume (PDF) now. If it doesn't start, use the "Download resume" button.`,
    action: { type: "openResume" },
  },
  {
    id: "how-built",
    label: "How was this agent built?",
    question: "How was this agent built?",
    answer: [
      bullets(siteArchitecture),
      "The full walkthrough, drawn as a diagram, just opened in a new tab.",
    ].join("\n\n"),
    action: { type: "openPage", href: ROUTES.agentArchitecture },
  },
  {
    id: "jd-match",
    label: "Match my JD",
    question: "Can I check Binit against a job description?",
    answer:
      "Yes. Paste it or upload a PDF, DOCX or TXT in the Job Match window (the paperclip next to the chat input works too). You'll get an honest fit report: requirements his work backs up, with evidence, and the gaps. The text is never stored.",
    action: { type: "openWindow", windowId: "jd-match" },
  },
  {
    id: "contact",
    label: "Contact",
    question: "How can I contact you?",
    answer: `Email ${profile.email} — or find ${profile.name} on LinkedIn, GitHub and LeetCode. The Contact window has all the links.`,
    action: { type: "showContact" },
  },
];
