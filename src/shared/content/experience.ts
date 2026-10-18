import type { Experience } from "./types";

// Newest first.
export const experience = [
  {
    // TODO(content): Binit will add APIwiz details. Do not fill these in by guessing.
    id: "apiwiz",
    company: "APIwiz",
    role: "[ADD ROLE]",
    start: "[ADD START]",
    end: "[ADD END]",
    highlights: ["[ADD HIGHLIGHT]"],
    stack: ["[ADD STACK]"],
  },
  {
    id: "reliance-jio",
    company: "Reliance Jio Infocomm Limited",
    role: "Software Developer Engineer",
    start: "Dec 2023",
    // TODO(content): source data says "Present" — confirm the end date now that APIwiz is current.
    end: "Present",
    highlights: [
      "Built and deployed a full-stack web application for tracking team member performance, letting managers view, filter, sort and modify monthly performance data, improving operational efficiency and data accuracy.",
      "Implemented cron jobs and integrated NodeMailer to automate weekly performance reports for managers.",
      "Optimized data retrieval using MongoDB aggregation pipelines for complex queries.",
      "Developed highly customizable, reusable components in React and Jetpack Compose for the JDS (JioDesignSystem) library.",
    ],
    stack: [
      "React",
      "Spring Boot",
      "Express.js",
      "Jetpack Compose",
      "MongoDB",
      "PostgreSQL",
      "Tailwind CSS",
      "TypeScript",
    ],
  },
  {
    id: "snipit",
    company: "SnipIt",
    role: "Backend Developer",
    start: "Sep 2023",
    end: "Dec 2023",
    highlights: [
      "Developed the backend infrastructure for a news website using Node.js, Express.js and Firebase.",
      "Integrated cron jobs for scheduled tasks and the external News API.",
      "Implemented RESTful APIs with role-based authentication and authorization.",
    ],
    stack: ["Node.js", "Express.js", "Firebase", "MongoDB", "TypeScript"],
  },
  {
    id: "healthires",
    company: "Healthires",
    role: "Full Stack Developer",
    start: "Jun 2023",
    end: "Dec 2023",
    highlights: [
      "Developed RESTful APIs and optimized query performance with MongoDB indexing, reducing query time by 60%.",
      "Integrated EJS and NodeMailer to generate and email resumes to users on signup.",
      "Built and deployed a full-stack admin panel for user management.",
      "Deployed the backend on AWS and the frontend on Firebase.",
      "Configured CloudWatch and Winston logging for monitoring and system observability.",
    ],
    stack: [
      "React",
      "Redux",
      "Node.js",
      "Express.js",
      "MongoDB",
      "EJS",
      "CSS",
      "JavaScript",
      "TypeScript",
      "Docker",
    ],
  },
] as const satisfies readonly Experience[];
