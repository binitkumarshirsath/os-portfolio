import { Fragment } from "react";

/**
 * Models reach for **bold** even when asked not to. Rather than show raw
 * asterisks, render just that one piece of markdown; everything else stays text.
 */
export function MessageText({ text }: { text: string }) {
  // Splitting on a capture group keeps the bold runs at the odd indexes.
  const pieces = text.split(/\*\*(.+?)\*\*/g);
  return pieces.map((piece, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-semibold text-fg">
        {piece}
      </strong>
    ) : (
      <Fragment key={index}>{piece}</Fragment>
    ),
  );
}
