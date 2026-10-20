"use client";

import { ShieldAlert, ShieldCheck, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { archNodes, type ArchNodeId } from "../model/graph";
import { deepDives } from "../model/deep-dives";

const TITLE_ID = "deep-dive-title";
const heading = "font-mono text-[11px] tracking-[0.18em] text-fg-muted uppercase";

type DeepDivePanelProps = {
  nodeId: ArchNodeId | null;
  onClose: () => void;
};

/** The engineering detail behind one box, sliding in from the left over the diagram. */
export function DeepDivePanel({ nodeId, onClose }: DeepDivePanelProps) {
  const panelRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // A new box: back to the top, with focus on its title so screen readers start there.
  useEffect(() => {
    if (!nodeId) return;
    panelRef.current?.scrollTo({ top: 0 });
    titleRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [nodeId, onClose]);

  const node = archNodes.find((n) => n.id === nodeId);
  const dive = nodeId ? deepDives[nodeId] : null;

  return (
    <AnimatePresence>
      {node && dive && (
        <motion.aside
          ref={panelRef}
          role="dialog"
          aria-labelledby={TITLE_ID}
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-0 left-0 z-20 w-full overflow-y-auto border-r border-line-strong bg-surface shadow-[8px_0_32px_-12px_rgb(0_0_0/0.25)] lg:w-[460px]"
        >
          <header className="sticky top-0 flex items-start justify-between gap-3 border-b border-line bg-surface px-5 py-4">
            <div className="min-w-0">
              <p className={heading}>Deep dive</p>
              <h2
                id={TITLE_ID}
                ref={titleRef}
                tabIndex={-1}
                className="font-display text-xl font-semibold text-fg outline-none"
              >
                {node.title}
              </h2>
              <p className="font-mono text-[11px] text-fg-muted">{node.caption}</p>
            </div>
            <button
              type="button"
              aria-label="Close deep dive"
              onClick={onClose}
              className="grid size-9 shrink-0 place-items-center rounded-sm text-fg-muted hover:bg-raised hover:text-fg"
            >
              <X aria-hidden className="size-4" />
            </button>
          </header>

          <div className="space-y-6 px-5 py-5">
            <p className="text-[15px] leading-relaxed text-fg">{dive.summary}</p>

            {dive.sections.map((section) => (
              <section key={section.heading} className="space-y-2">
                <h3 className={heading}>{section.heading}</h3>
                <ul className="space-y-2">
                  {section.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2.5 text-sm leading-relaxed text-fg/90"
                    >
                      <span
                        aria-hidden
                        className="mt-2 size-1 shrink-0 rounded-full bg-accent"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            {dive.bypass && <BypassList items={dive.bypass} />}

            <section className="space-y-2">
              <h3 className={heading}>Read the code</h3>
              <ul className="space-y-1">
                {dive.files.map((file) => (
                  <li key={file} className="font-mono text-xs break-all text-fg-muted">
                    {file}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function BypassList({
  items,
}: {
  items: NonNullable<(typeof deepDives)[ArchNodeId]["bypass"]>;
}) {
  return (
    <section className="space-y-2">
      <h3 className={heading}>Can it be bypassed?</h3>
      <ul className="space-y-2">
        {items.map(({ attempt, outcome, holds }) => {
          const Icon = holds ? ShieldCheck : ShieldAlert;
          return (
            <li
              key={attempt}
              className="rounded-sm border border-line bg-background/60 p-3"
            >
              <p className="flex items-start justify-between gap-3 text-sm font-medium text-fg">
                {attempt}
                <span className="inline-flex shrink-0 items-center gap-1 font-mono text-[11px] font-normal text-fg-muted">
                  <Icon
                    aria-hidden
                    className={`size-3.5 ${holds ? "text-moss" : "text-ochre"}`}
                  />
                  {holds ? "holds" : "partly"}
                </span>
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-fg-muted">{outcome}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
