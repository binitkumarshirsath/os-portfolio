"use client";

import { FileText, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useWindowStore, windowRegistry, type WindowId } from "@/features/window-manager";
import { profile } from "@/shared/content";
import { newTab } from "@/shared/ui";

// What a visitor most often wants, as icons on the desktop. Windows open over
// them like on a real OS; with everything closed, this corner is still useful.
const ICON_WINDOWS: WindowId[] = [
  "chat",
  "projects",
  "experience",
  "jd-match",
  "contact",
];

const resumeFileName = profile.resumeHref.split("/").at(-1) ?? "Resume.pdf";

const tileClass =
  "grid size-14 place-items-center rounded-2xl border border-line bg-surface text-fg-muted shadow-[0_1px_2px_rgb(60_40_20/0.06),0_10px_24px_-14px_rgb(60_40_20/0.3)] transition group-hover:-translate-y-0.5 group-hover:text-accent";
const labelClass =
  "max-w-full rounded px-1.5 py-0.5 text-center text-xs leading-snug text-fg group-hover:bg-raised group-focus-visible:bg-accent-tint";

function IconFace({ icon: Icon, label }: { icon: LucideIcon; label: ReactNode }) {
  return (
    <>
      <span className={tileClass}>
        <Icon aria-hidden className="size-6" strokeWidth={1.6} />
      </span>
      <span className={labelClass}>{label}</span>
    </>
  );
}

const itemClass =
  "group flex w-24 flex-col items-center gap-1.5 rounded-lg p-1 outline-offset-4";

export function DesktopIcons() {
  const openWindow = useWindowStore((state) => state.openWindow);

  return (
    <nav aria-label="Desktop" className="absolute top-6 right-6">
      {/* Two columns, three rows: compact enough to sit entirely behind the Projects window. */}
      <ul className="grid grid-cols-2 gap-x-3 gap-y-2">
        {ICON_WINDOWS.map((id) => (
          <li key={id}>
            <button type="button" onClick={() => openWindow(id)} className={itemClass}>
              <IconFace icon={windowRegistry[id].icon} label={windowRegistry[id].title} />
            </button>
          </li>
        ))}
        <li>
          {/* A real file on the desktop: the resume, downloaded (or opened in a new tab). */}
          <a href={profile.resumeHref} download {...newTab} className={itemClass}>
            <IconFace
              icon={FileText}
              label={<span className="break-all">{resumeFileName}</span>}
            />
          </a>
        </li>
      </ul>
    </nav>
  );
}
