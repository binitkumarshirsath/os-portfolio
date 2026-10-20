type HankoSealProps = {
  /** px; the seal is square. */
  size?: number;
};

/**
 * Binit's seal: a vermilion square with a "B", in the style of a hanko, the
 * personal stamp used in Japan to sign documents. Used as the site's mark.
 */
export function HankoSeal({ size = 18 }: HankoSealProps) {
  return (
    <span
      aria-hidden
      className="inline-grid shrink-0 place-items-center rounded-[3px] bg-accent font-display leading-none font-extrabold text-on-accent"
      style={{ width: size, height: size, fontSize: size * 0.62 }}
    >
      B
    </span>
  );
}
