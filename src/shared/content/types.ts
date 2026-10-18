/**
 * Shapes for everything the site says about Binit.
 * The UI, the quick actions and the AI system prompt all read these,
 * so a field added here is a field every surface can use.
 *
 * Missing facts are written as visible placeholders like "[ADD LINK]"
 * rather than left blank, so gaps are obvious on the page and in review.
 */

export type Profile = {
  name: string;
  fullName: string;
  role: string;
  level: string;
  yearsOfExperience: string;
  location: string;
  /** IANA zone for the menubar clock, so visitors see Binit's local time. */
  timeZone: string;
  /** One line under the hero heading. */
  positioning: string;
  /** Two or three sentences for the About window and the system prompt. */
  summary: string;
  currentlyLearning: readonly string[];
  email: string;
  links: {
    github: string;
    linkedin: string;
  };
  /** Path to the resume PDF under public/. */
  resumeHref: string;
};

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  /** URL- and tool-safe id, e.g. "devflow". Used by showProject(slug). */
  slug: string;
  title: string;
  kind: "Web app" | "Android app";
  /** Free text such as "Oct 2023 – Dec 2023". */
  period: string;
  /** One line shown on the project card. */
  tagline: string;
  description: string;
  highlights: readonly string[];
  stack: readonly string[];
  links: readonly ProjectLink[];
  /** Screenshot of the project, hosted by Binit. */
  imageUrl?: string;
  /** Featured projects lead the Projects window and answer "best project". */
  featured: boolean;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  /** Free text such as "Jan 2023" so we never have to invent exact days. */
  start: string;
  end: string;
  location?: string;
  highlights: readonly string[];
  stack: readonly string[];
};

export type SkillGroup = {
  label: string;
  items: readonly string[];
};

export type Education = {
  id: string;
  school: string;
  degree: string;
  period: string;
  grade: string;
  /** Board or university and place, e.g. "University of Mumbai, Maharashtra". */
  detail: string;
};
