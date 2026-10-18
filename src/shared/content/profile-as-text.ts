import { education } from "./education";
import { experience } from "./experience";
import { profile } from "./profile";
import { projects } from "./projects";
import { skills } from "./skills";

// The whole portfolio as labelled plain text, for model prompts (the chat agent and
// the JD matcher). Plain text rather than JSON: models read it more reliably and it
// costs fewer tokens. Edit the content files and every prompt updates with them.

export const bulletList = (items: readonly string[]) =>
  items.map((item) => `- ${item}`).join("\n");

const about = `Name: ${profile.fullName} (goes by ${profile.name})
Role: ${profile.role}, ${profile.level}, ${profile.yearsOfExperience} of experience
Location: ${profile.location}
Summary: ${profile.summary}
Currently learning: ${profile.currentlyLearning.join(", ")}
Email: ${profile.email}
GitHub: ${profile.links.github}
LinkedIn: ${profile.links.linkedin}
Resume: available as a PDF download on this site`;

const experienceText = experience
  .map(
    (role) => `${role.role} at ${role.company} (${role.start} – ${role.end})
${bulletList(role.highlights)}
Stack: ${role.stack.join(", ")}`,
  )
  .join("\n\n");

const projectsText = projects
  .map((project) => {
    const heading = `${project.title}${project.featured ? " [featured]" : ""} — ${project.kind}, ${project.period}`;
    const links = project.links.map((link) => `${link.label} ${link.href}`).join(", ");
    return `${heading}
${project.description}
${bulletList(project.highlights)}
Stack: ${project.stack.join(", ")}
Links: ${links}`;
  })
  .join("\n\n");

const skillsText = skills
  .map((group) => `${group.label}: ${group.items.join(", ")}`)
  .join("\n");

const educationText = education
  .map((entry) => `${entry.degree}, ${entry.school} (${entry.period}), ${entry.grade}`)
  .join("\n");

export const profileAsText = `### About
${about}

### Experience (newest first)
${experienceText}

### Projects
${projectsText}

### Skills
${skillsText}

### Education
${educationText}`;
