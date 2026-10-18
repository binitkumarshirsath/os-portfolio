import type { ReactNode } from "react";
import type { WindowId } from "@/features/window-manager";
import { AboutWindow } from "./about-window";
import { ActivityWindow } from "./activity-window";
import { ChatWindow } from "./chat-window";
import { ContactWindow } from "./contact-window";
import { ExperienceWindow } from "./experience-window";
import { JdMatchWindow } from "./jd-match-window";
import { ProjectDetailWindow } from "./project-detail-window";
import { ProjectsWindow } from "./projects-window";
import { SkillsWindow } from "./skills-window";

/**
 * What goes inside each window. Both shells receive this same map, so the
 * desktop window and the mobile panel for an id always show the same content.
 * `satisfies` makes TypeScript fail if a registry id has no content.
 */
export const windowBodies = {
  chat: <ChatWindow />,
  projects: <ProjectsWindow />,
  "project-detail": <ProjectDetailWindow />,
  experience: <ExperienceWindow />,
  skills: <SkillsWindow />,
  about: <AboutWindow />,
  contact: <ContactWindow />,
  activity: <ActivityWindow />,
  "jd-match": <JdMatchWindow />,
} satisfies Record<WindowId, ReactNode>;

export type WindowBodies = Record<WindowId, ReactNode>;
