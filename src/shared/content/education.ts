import type { Education } from "./types";

// Newest first.
export const education = [
  {
    id: "vppcoe",
    school: "Vasantdada Patil Pratishthan's College of Engineering and Visual Arts",
    degree: "Bachelor of Engineering (B.E.), Computer Engineering",
    period: "2019 – 2023",
    grade: "8.89 CGPA",
    detail: "University of Mumbai, Mumbai, Maharashtra",
  },
  {
    id: "kv-koliwada",
    school: "Kendriya Vidyalaya Koliwada, Mumbai",
    degree: "CBSE Class XII, Science with Computer",
    period: "2018 – 2019",
    grade: "72.3%",
    detail: "CBSE Board, Mumbai, Maharashtra",
  },
  {
    id: "kv-dhanbad",
    school: "Kendriya Vidyalaya No. 1, Dhanbad",
    degree: "CBSE Class X",
    period: "2016 – 2017",
    grade: "9.2 CGPA",
    detail: "CBSE Board, Dhanbad, Jharkhand",
  },
] as const satisfies readonly Education[];
