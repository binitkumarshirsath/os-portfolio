import { Fragment, type ReactNode } from "react";
import { newTab } from "@/shared/ui";

// http(s) URLs up to the next space. Trailing punctuation is peeled off afterwards,
// so "see https://example.com." doesn't link the full stop.
const URL_PATTERN = /(https?:\/\/[^\s<>"]+)/g;
const TRAILING_PUNCTUATION = /[.,;:!?)\]]+$/;

const linkClass = "text-accent-text underline underline-offset-2 hover:text-fg";

/** Plain text with any URLs turned into links that open in a new tab. */
function withLinks(text: string, keyPrefix: string): ReactNode[] {
  return text.split(URL_PATTERN).map((piece, index) => {
    const key = `${keyPrefix}-${index}`;
    // Splitting on a capture group puts the URLs at the odd indexes.
    if (index % 2 === 0) return <Fragment key={key}>{piece}</Fragment>;
    const trailing = piece.match(TRAILING_PUNCTUATION)?.[0] ?? "";
    const url = piece.slice(0, piece.length - trailing.length);
    return (
      <Fragment key={key}>
        <a href={url} {...newTab} className={`${linkClass} break-all`}>
          {url}
        </a>
        {trailing}
      </Fragment>
    );
  });
}

/**
 * The agent's answer as text, with two small touches: **bold** (models reach for
 * it even when asked not to) and clickable URLs that open in a new tab, so a
 * project link never navigates away from the portfolio.
 */
export function MessageText({ text }: { text: string }) {
  const pieces = text.split(/\*\*(.+?)\*\*/g);
  return pieces.map((piece, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-semibold text-fg">
        {withLinks(piece, `bold-${index}`)}
      </strong>
    ) : (
      <Fragment key={index}>{withLinks(piece, `text-${index}`)}</Fragment>
    ),
  );
}
