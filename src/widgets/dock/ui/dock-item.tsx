"use client";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

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
  isOpen: boolean;
  /** Lets a closing window hand focus back to its dock button. */
  windowId: string;
  onClick: () => void;
};

export function DockButton({
  label,
  icon: Icon,
  isOpen,
  windowId,
  onClick,
}: DockButtonProps) {
  return (
    <li className="group relative">
      <motion.button
        type="button"
        aria-label={label}
        data-window-trigger={windowId}
        onClick={onClick}
        className={iconButtonClass}
        {...lift}
      >
        <Icon aria-hidden className="size-5" />
      </motion.button>
      <Tooltip>{label}</Tooltip>
      {isOpen && (
        <span
          aria-hidden
          className="absolute -bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent"
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
