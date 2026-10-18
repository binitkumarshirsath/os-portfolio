import type { ReactNode } from "react";

/** A labelled block inside a window, so every window reads the same way. */
export function WindowSection({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="font-mono text-[11px] tracking-[0.18em] text-fg-muted uppercase">
        {label}
      </h3>
      {children}
    </section>
  );
}
