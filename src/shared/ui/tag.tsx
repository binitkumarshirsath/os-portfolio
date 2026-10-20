type TagProps = {
  children: string;
};

/** A small mono label for a technology or skill. Neutral on purpose: red marks actions. */
export function Tag({ children }: TagProps) {
  return (
    <span className="inline-block rounded-full border border-line-strong bg-raised/60 px-2 py-0.5 font-mono text-[11px] leading-4 text-fg-muted">
      {children}
    </span>
  );
}

export function TagList({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li key={item}>
          <Tag>{item}</Tag>
        </li>
      ))}
    </ul>
  );
}
