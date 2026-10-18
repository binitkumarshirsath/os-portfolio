type TagProps = {
  children: string;
};

/** A small mono label for a technology or skill. */
export function Tag({ children }: TagProps) {
  return (
    <span className="inline-block rounded-sm border border-line bg-accent-tint px-1.5 py-0.5 font-mono text-[11px] leading-4 text-accent-text">
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
