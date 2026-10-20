// Sumi-e mountains: three ridges of ink wash, the far one with a flat-topped
// volcanic peak, mist pooling at the foot of each. Drawn in code (no image, no
// third-party art) and decorative, so hidden from assistive tech.
//
// Each ridge is an opaque ink tone (--ink-* in globals.css) that dissolves into
// the paper towards its base. That fade is the mist, and because the tones come
// from the theme tokens the scene follows day and night by itself.

const RIDGES = [
  {
    id: "far",
    tone: "var(--ink-far)",
    path: "M0 190C60 180 120 160 180 165C240 170 290 185 330 175L430 108C442 100 458 100 470 108L570 170C620 182 660 178 720 168C790 156 830 140 900 146C980 152 1010 175 1090 170C1170 165 1220 140 1300 146C1370 151 1410 160 1440 158V300H0Z",
  },
  {
    id: "mid",
    tone: "var(--ink-mid)",
    path: "M0 222C80 210 140 196 220 202C300 208 340 224 420 218C500 212 560 190 640 196C720 202 770 226 860 222C950 218 1000 198 1090 202C1180 206 1230 224 1320 220C1380 217 1420 210 1440 211V300H0Z",
  },
  {
    id: "near",
    tone: "var(--ink-near)",
    path: "M0 262C100 252 180 244 270 248C360 252 420 266 520 262C620 258 680 246 780 248C880 250 940 264 1040 262C1140 260 1200 248 1300 250C1370 251 1415 258 1440 257V300H0Z",
  },
];

type InkRidgesProps = {
  /** Size and position; the ridges stretch to fill whatever box they're given. */
  className: string;
  /** Distinct per use, so two scenes on one page don't share gradient ids. */
  idPrefix: string;
};

export function InkRidges({ className, idPrefix }: InkRidgesProps) {
  return (
    <svg
      aria-hidden
      className={`pointer-events-none ${className}`}
      viewBox="0 0 1440 300"
      preserveAspectRatio="none"
    >
      <defs>
        {RIDGES.map((ridge) => (
          // Solid ink at the crest, dissolving into paper at the foot: the mist.
          <linearGradient
            key={ridge.id}
            id={`${idPrefix}-${ridge.id}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0" style={{ stopColor: ridge.tone }} />
            <stop offset="0.85" style={{ stopColor: "var(--color-background)" }} />
          </linearGradient>
        ))}
      </defs>
      {RIDGES.map((ridge) => (
        <path key={ridge.id} d={ridge.path} fill={`url(#${idPrefix}-${ridge.id})`} />
      ))}
    </svg>
  );
}

/** Three small birds, as a brush would flick them. */
export function InkBirds({ className }: { className: string }) {
  return (
    <svg
      aria-hidden
      className={`pointer-events-none text-fg ${className}`}
      viewBox="0 0 64 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    >
      <path d="M0 13Q4 8 8 13Q12 8 16 13" />
      <path transform="translate(24 0) scale(0.8)" d="M0 5Q4 0 8 5Q12 0 16 5" />
      <path transform="translate(44 14) scale(0.65)" d="M0 5Q4 0 8 5Q12 0 16 5" />
    </svg>
  );
}
