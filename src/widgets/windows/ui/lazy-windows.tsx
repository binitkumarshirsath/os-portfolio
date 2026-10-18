"use client";

import dynamic from "next/dynamic";

// Windows that start closed load their code only when first opened. The chat
// isn't here on purpose: it's on screen at first paint, so deferring it would
// just swap a working chat for a placeholder.
const loading = () => <p className="p-5 font-mono text-[11px] text-fg-muted">loading…</p>;

export const LazyActivityWindow = dynamic(
  () => import("./activity-window").then((module) => module.ActivityWindow),
  { ssr: false, loading },
);

export const LazyJdMatchWindow = dynamic(
  () => import("./jd-match-window").then((module) => module.JdMatchWindow),
  { ssr: false, loading },
);
