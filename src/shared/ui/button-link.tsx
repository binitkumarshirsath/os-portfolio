import type { AnchorHTMLAttributes, ReactNode } from "react";

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "primary" | "secondary";
  icon?: ReactNode;
};

const variants = {
  primary: "bg-accent text-background hover:bg-accent-text",
  secondary:
    "border border-line-strong text-fg hover:border-accent hover:text-accent-text",
} as const;

/** An `<a>` styled as a button: it navigates or downloads, so it stays a link. */
export function ButtonLink({
  variant = "primary",
  icon,
  className = "",
  children,
  ...anchorProps
}: ButtonLinkProps) {
  return (
    <a
      {...anchorProps}
      className={`inline-flex h-10 items-center gap-2 rounded-sm px-4 text-sm font-medium transition-colors ${variants[variant]} ${className}`}
    >
      {icon}
      {children}
    </a>
  );
}
