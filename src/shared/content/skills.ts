import type { SkillGroup } from "./types";

// Names only: the UI uses its own icon set instead of hotlinked third-party logos.
export const skills = [
  {
    label: "Frontend",
    items: [
      "React",
      "Next.js",
      "React Native",
      "Jetpack Compose",
      "Ktor",
      "Koin",
      "Redux Toolkit",
      "HTML",
      "CSS",
      "SCSS",
      "Tailwind CSS",
      "Bootstrap",
    ],
  },
  {
    label: "Backend",
    items: [
      "Node.js",
      "Express.js",
      "Spring Boot",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Firebase",
    ],
  },
  {
    label: "Languages & tools",
    items: [
      "TypeScript",
      "JavaScript",
      "Java",
      "Kotlin",
      "Socket.IO",
      "JWT",
      "Git",
      "GitHub",
      "Docker",
      "Postman",
      "MongoDB Atlas",
      "RoomDB",
      "Figma",
    ],
  },
] as const satisfies readonly SkillGroup[];
