import type { Project } from "./types";

// `as const` keeps each slug as a literal type, so later the agent's
// showProject tool can build a Zod enum that only accepts real slugs.
// Order matters: the Projects window lists them as written.
export const projects = [
  {
    slug: "devflow",
    title: "DevFlow",
    kind: "Web app",
    period: "Oct 2023 – Dec 2023",
    tagline: "A Stack Overflow clone built with Next.js, TypeScript and MongoDB.",
    description:
      "DevFlow is a Stack Overflow clone where users ask questions, vote on and save questions, vote on answers, add code snippets and search by tag or globally. Authentication runs through Clerk.",
    highlights: [
      "Questions with upvotes, downvotes and saves; voting on answers.",
      "Tag-based and global search, plus code snippets in posts.",
      "Clerk authentication, with webhooks keeping the database in sync with auth.",
      "Next.js server actions for data mutations.",
    ],
    stack: ["Next.js", "React", "TypeScript", "MongoDB", "Clerk", "shadcn/ui"],
    links: [
      { label: "Live", href: "https://devflow-binit.vercel.app/" },
      { label: "GitHub", href: "https://github.com/binitkumarshirsath/devflow" },
    ],
    imageUrl:
      "https://res.cloudinary.com/dn4g4us6b/image/upload/v1743269905/Portfolio_Binitkumar_Shirsath/ican4br2vhydp5whb6jq.png",
    featured: true,
  },
  {
    slug: "studynotion",
    title: "StudyNotion",
    kind: "Web app",
    period: "Aug 2023 – Sep 2023",
    tagline: "A full ed-tech platform on the MERN stack.",
    description:
      "StudyNotion is a fully functional ed-tech platform where users create, consume and rate educational content. It is built on the MERN stack: React, Node.js, MongoDB and Express.",
    highlights: [
      "Users create, consume and rate educational content.",
      "Payments through Razorpay and emails through NodeMailer.",
      "State managed with Redux Toolkit.",
    ],
    stack: [
      "React",
      "Redux Toolkit",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Razorpay",
      "NodeMailer",
      "JavaScript",
    ],
    links: [
      { label: "Live", href: "https://studynotion-binitkumar.vercel.app/" },
      {
        label: "GitHub",
        href: "https://github.com/binitkumarshirsath/studynotion-frontend",
      },
    ],
    imageUrl:
      "https://res.cloudinary.com/dn4g4us6b/image/upload/v1743269973/Portfolio_Binitkumar_Shirsath/e3df3o8sw71azqspzbnj.png",
    featured: true,
  },
  {
    slug: "rawdex",
    title: "RawDex",
    kind: "Web app",
    period: "Jul 2023 – Aug 2023",
    tagline: "Search games across platforms and categories.",
    description:
      "RawDex is a game search platform. Users search games across platforms and categories, with filtering. TanStack Query handles caching and infinite pagination, and Zustand handles state.",
    highlights: [
      "Search and filtering across platforms and categories.",
      "TanStack Query for caching and infinite pagination.",
      "Zustand for state management.",
    ],
    stack: ["React", "TypeScript", "TanStack Query", "Zustand"],
    links: [
      { label: "Live", href: "https://rawdex.vercel.app/" },
      { label: "GitHub", href: "https://github.com/binitkumarshirsath/rawdex" },
    ],
    imageUrl:
      "https://res.cloudinary.com/dn4g4us6b/image/upload/v1743270281/Portfolio_Binitkumar_Shirsath/ue13pw6kxvdxjt0pk0fs.png",
    featured: false,
  },
  {
    slug: "crypto-tracker",
    title: "Crypto Tracker",
    kind: "Android app",
    period: "Feb 2025",
    tagline: "Real-time cryptocurrency data in Jetpack Compose.",
    description:
      "Binit's first Jetpack Compose project: a crypto tracker with real-time cryptocurrency data and a modern UI. It has a list screen of coins and a detail screen with more information about each one.",
    highlights: [
      "List and detail screens with adaptive navigation.",
      "Charts drawn with the Canvas API.",
      "Koin for dependency injection and the Ktor client for networking.",
    ],
    stack: ["Jetpack Compose", "Kotlin", "Koin", "Ktor Client", "Canvas API"],
    links: [
      { label: "GitHub", href: "https://github.com/binitkumarshirsath/Crypto-Tracker" },
    ],
    imageUrl:
      "https://res.cloudinary.com/dn4g4us6b/image/upload/v1743270125/Portfolio_Binitkumar_Shirsath/idxnqm3ebufuqgzkdeyr.png",
    featured: false,
  },
  {
    slug: "zenwalls",
    title: "ZenWalls",
    kind: "Android app",
    period: "Mar 2025",
    tagline: "A wallpaper app for high-quality Unsplash photos.",
    description:
      "ZenWalls is a wallpaper app built with Jetpack Compose for browsing high-quality wallpapers from Unsplash. Users search, explore and download wallpapers in several resolutions, with caching, offline access and photographer profiles.",
    highlights: [
      "Search, explore and download wallpapers in several resolutions.",
      "Caching and offline access with Room and Paging 3.",
      "Photographer profiles.",
    ],
    stack: [
      "Jetpack Compose",
      "Kotlin",
      "Ktor Client",
      "Paging 3",
      "Room",
      "Koin",
      "ViewModel",
    ],
    links: [{ label: "GitHub", href: "https://github.com/binitkumarshirsath/zenwalls" }],
    imageUrl:
      "https://res.cloudinary.com/dn4g4us6b/image/upload/v1743270028/Portfolio_Binitkumar_Shirsath/h3vjjbpqrzhffm994qox.png",
    featured: false,
  },
  {
    slug: "evo-gym",
    title: "Evo Gym",
    kind: "Web app",
    period: "Jul 2023",
    tagline: "A styling and animation study in Tailwind and Framer Motion.",
    description:
      "A learning project focused on styling, built with Tailwind and Framer Motion. It is a front-end only site with no functionality behind it yet.",
    highlights: ["Layout and styling with Tailwind.", "Animations with Framer Motion."],
    stack: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "HTML5"],
    links: [
      { label: "Live", href: "https://evo-gym-fawn.vercel.app/" },
      { label: "GitHub", href: "https://github.com/binitkumarshirsath/evo-gym" },
    ],
    imageUrl:
      "https://res.cloudinary.com/dn4g4us6b/image/upload/v1743270281/Portfolio_Binitkumar_Shirsath/xsozv5rtzt194repoj2z.png",
    featured: false,
  },
] as const satisfies readonly Project[];

export type ProjectSlug = (typeof projects)[number]["slug"];
