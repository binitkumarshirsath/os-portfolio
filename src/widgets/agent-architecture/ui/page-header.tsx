import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/shared/config/routes";
import { HankoSeal, ThemeToggle } from "@/shared/ui";

/** Back to the desktop on one side, the theme on the other, the page's name between. */
export function PageHeader() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-line bg-background px-2 lg:px-4">
      <Link
        href={ROUTES.home}
        className="flex h-10 items-center gap-2 rounded-sm px-2 text-sm text-fg-muted transition-colors hover:text-fg"
      >
        <ArrowLeft aria-hidden className="size-4" />
        <HankoSeal size={20} />
        <span className="font-display font-semibold text-fg max-sm:sr-only">
          Binit OS
        </span>
      </Link>
      <h1 className="truncate font-display text-base font-semibold text-fg lg:text-lg">
        How this agent works
      </h1>
      <ThemeToggle
        className="grid size-10 place-items-center text-fg-muted hover:text-fg"
        iconClassName="size-5"
      />
    </header>
  );
}
