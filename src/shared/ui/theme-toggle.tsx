"use client";

import { Moon, Sun, SunMoon } from "lucide-react";
import { toggleTheme, useTheme } from "@/shared/lib";

type ThemeToggleProps = {
  className: string;
  iconClassName: string;
};

/** Day/night switch. Shows where it will take you: a moon by day, a sun at night. */
export function ThemeToggle({ className, iconClassName }: ThemeToggleProps) {
  const theme = useTheme();
  // Before hydration the theme isn't known yet; a neutral icon keeps the size stable.
  const Icon = theme === null ? SunMoon : theme === "dark" ? Sun : Moon;
  const label = theme === "dark" ? "Switch to day theme" : "Switch to night theme";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={className}
    >
      <Icon aria-hidden className={iconClassName} />
    </button>
  );
}
