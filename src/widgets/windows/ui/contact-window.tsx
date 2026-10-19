import { ArrowUpRight, Download, Mail } from "lucide-react";
import type { ReactNode } from "react";
import { profile } from "@/shared/content";

type ContactRow = {
  label: string;
  value: string;
  href: string;
  icon: ReactNode;
  download?: boolean;
  external?: boolean;
};

// "https://github.com/someone" -> "someone", so the visible text always matches the link.
function linkPath(url: string): string {
  return new URL(url).pathname.replace(/^\/|\/$/g, "");
}

const iconClass = "size-4 text-accent";

const rows: ContactRow[] = [
  {
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
    icon: <Mail aria-hidden className={iconClass} />,
  },
  {
    label: "LinkedIn",
    value: linkPath(profile.links.linkedin),
    href: profile.links.linkedin,
    icon: <ArrowUpRight aria-hidden className={iconClass} />,
    external: true,
  },
  {
    label: "GitHub",
    value: linkPath(profile.links.github),
    href: profile.links.github,
    icon: <ArrowUpRight aria-hidden className={iconClass} />,
    external: true,
  },
  {
    label: "LeetCode",
    value: linkPath(profile.links.leetcode),
    href: profile.links.leetcode,
    icon: <ArrowUpRight aria-hidden className={iconClass} />,
    external: true,
  },
  {
    label: "Resume",
    value: "PDF",
    href: profile.resumeHref,
    icon: <Download aria-hidden className={iconClass} />,
    download: true,
  },
];

export function ContactWindow() {
  return (
    <ul className="divide-y divide-line">
      {rows.map((row) => (
        <li key={row.label}>
          <a
            href={row.href}
            download={row.download}
            {...(row.external && { target: "_blank", rel: "noreferrer" })}
            className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-raised"
          >
            {row.icon}
            {/* Label above value, so a long email fits a 320px window without truncating. */}
            <span className="min-w-0">
              <span className="block font-mono text-[11px] tracking-[0.18em] text-fg-muted uppercase">
                {row.label}
              </span>
              <span className="block text-sm wrap-break-word">{row.value}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
