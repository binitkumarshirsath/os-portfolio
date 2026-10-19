"use client";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { newTab } from "@/shared/ui";

const lift = { whileHover: { y: -4 }, transition: { duration: 0.15 } } as const;
const iconButtonClass =
  "grid size-11 place-items-center rounded-md text-fg-muted transition-colors hover:bg-raised hover:text-fg";

function Tooltip({ children }: { children: ReactNode }) {
  // aria-hidden: the button's aria-label already gives screen readers the name.
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-sm border border-line bg-raised px-2 py-1 font-mono text-[11px] whitespace-nowrap text-fg opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
    >
      {children}
    </span>
  );
}

type DockButtonProps = {
  label: string;
  icon: LucideIcon;
  /** Open shows a red dot; minimized shows a hollow one, like a parked app. */
  state: "open" | "minimized" | "closed";
  /** Lets a closing window hand focus back to its dock button. */
  windowId: string;
  onClick: () => void;
};

export function DockButton({
  label,
  icon: Icon,
  state,
  windowId,
  onClick,
}: DockButtonProps) {
  return (
    <li className="group relative">
      <motion.button
        type="button"
        aria-label={state === "minimized" ? `${label} (minimized)` : label}
        data-window-trigger={windowId}
        onClick={onClick}
        className={iconButtonClass}
        {...lift}
      >
        <Icon aria-hidden className="size-5" />
      </motion.button>
      <Tooltip>{label}</Tooltip>
      {state !== "closed" && (
        <span
          aria-hidden
          className={`absolute -bottom-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full ${
            state === "open" ? "bg-accent" : "border border-accent"
          }`}
        />
      )}
    </li>
  );
}

type DockLinkProps = {
  label: string;
  icon: LucideIcon;
  href: string;
  download?: boolean;
};

export function DockLink({ label, icon: Icon, href, download }: DockLinkProps) {
  return (
    <li className="group relative">
      <motion.a
        href={href}
        download={download}
        {...newTab}
        aria-label={label}
        className={iconButtonClass}
        {...lift}
      >
        <Icon aria-hidden className="size-5" />
      </motion.a>
      <Tooltip>{label}</Tooltip>
    </li>
  );
}
