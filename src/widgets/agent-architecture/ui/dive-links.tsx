import { ArrowUpRight } from "lucide-react";
import { archNodes, type ArchNodeId } from "../model/graph";

type DiveLinksProps = {
  /** The current step's boxes; all of them in the overview. */
  nodeIds: readonly ArchNodeId[] | undefined;
  onOpen: (id: ArchNodeId) => void;
};

/** The deep dives as buttons: the same as clicking a box, and reachable by keyboard. */
export function DiveLinks({ nodeIds, onOpen }: DiveLinksProps) {
  const nodes = nodeIds
    ? archNodes.filter((node) => nodeIds.includes(node.id))
    : archNodes;

  return (
    <section aria-labelledby="dive-links-title" className="space-y-2">
      <h3
        id="dive-links-title"
        className="font-mono text-[11px] tracking-[0.18em] text-fg-muted uppercase"
      >
        Go deeper
      </h3>
      <ul className="flex flex-wrap gap-1.5">
        {nodes.map(({ id, title }) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => onOpen(id)}
              className="inline-flex h-7 items-center gap-1 rounded-full border border-line-strong bg-raised/60 pr-2 pl-3 text-xs text-fg/85 transition-colors hover:border-accent/70 hover:bg-accent-tint hover:text-fg"
            >
              {title}
              <ArrowUpRight aria-hidden className="size-3" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
