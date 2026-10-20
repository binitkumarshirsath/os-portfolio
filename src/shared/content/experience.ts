import type { Experience } from "./types";

// Newest first.
export const experience = [
  {
    id: "apiwiz",
    company: "APIwiz",
    role: "SDE2 – Frontend Developer",
    start: "Jul 2025",
    end: "Present",
    highlights: [
      "Design Studio: developed a node-based OpenAPI specification editor using React Flow, enabling visual specification creation and JSON-to-graph rendering. Resolved UI unresponsiveness with large, deeply nested JSON specifications spanning thousands of lines by eliminating an unnecessary deep-cloning operation before passing data to React Flow.",
      "Monaco Editor inline commenting: implemented an inline commenting system for OpenAPI specifications, letting users select editor lines and add contextual comments. Used JSON parsing and line-number-to-JSON-path mapping to attach each comment to a specific value in the specification.",
      "Observability dashboard: developed dashboard interfaces and integrated backend APIs to display API metrics, logs, traces and charts, supporting API monitoring and operational troubleshooting.",
      "Developer marketplace: developed frontend workflows across package discovery, subscriptions, application creation and product consumption, integrating backend APIs across interconnected business workflows.",
      "DocuWiz documentation platform: migrated existing frontend features into a developer documentation platform for guides, recipes and API references, building UI layouts and reusable components for a consistent user experience.",
    ],
    // Only what the description names; add the rest of the stack here as needed.
    stack: ["React", "React Flow", "Monaco Editor", "OpenAPI", "JSON"],
  },
  {
    id: "reliance-jio",
    company: "Reliance Jio Infocomm Limited",
    role: "Software Developer Engineer",
    start: "Dec 2023",
    end: "Jun 2025",
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
