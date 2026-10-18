// Downloads Latin-only subsets of the two Japanese display/body fonts.
// Usage: node scripts/subset-fonts.mjs
//   writes src/shared/assets/fonts/*.woff2 (the site) and fonts/og/*.ttf (the OG image)
//
// Why: Shippori Mincho B1 and Zen Kaku Gothic New are Japanese fonts that Google
// splits into ~120 files per weight. Loaded through next/font/google, that put
// 616 @font-face rules (~160 KiB) into render-blocking CSS. Google's `text=` API
// instead builds one file per weight holding exactly the characters we list.
// Both fonts are SIL Open Font License, which allows redistributing them.
// Re-run only if you add weights or need characters outside the set below.

import { mkdir, writeFile } from "node:fs/promises";

const OUT_DIR = new URL("../src/shared/assets/fonts/", import.meta.url);

const FONTS = [
  { family: "Shippori Mincho B1", file: "shippori-mincho-b1", weights: [600, 800] },
  {
    family: "Zen Kaku Gothic New",
    file: "zen-kaku-gothic-new",
    weights: [400, 500, 700],
  },
];

// Printable ASCII, Latin-1, general punctuation (dashes, quotes, ellipsis),
// and the few symbols the UI uses (arrows, ● ○, ×).
const codePoints = [
  ...range(0x20, 0x7e),
  ...range(0xa0, 0xff),
  ...range(0x2010, 0x2027),
  0x2030,
  0x2032,
  0x2033,
  0x2039,
  0x203a,
  0x2122,
  ...range(0x2190, 0x2193),
  0x25cb,
  0x25cf,
  0x2715,
];

function range(from, to) {
  return Array.from({ length: to - from + 1 }, (_, index) => from + index);
}

// The OG image renderer can't read woff2, so it gets TrueType copies.
const OG_FONTS = [
  { family: "Shippori Mincho B1", file: "shippori-mincho-b1", weight: 800 },
  { family: "JetBrains Mono", file: "jetbrains-mono", weight: 400 },
];

// Google serves woff2 only to browsers it recognises, and TrueType to anything else.
const userAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";

const text = encodeURIComponent(String.fromCodePoint(...codePoints));

async function download(family, weight, { asBrowser }) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${family.replaceAll(" ", "+")}:wght@${weight}&text=${text}`;
  const headers = asBrowser ? { "user-agent": userAgent } : {};
  const css = await (await fetch(cssUrl, { headers })).text();
  const fontUrl = css.match(/url\((https:[^)]+)\)/)?.[1];
  if (!fontUrl) throw new Error(`No font URL for ${family} ${weight}:\n${css}`);
  return Buffer.from(await (await fetch(fontUrl)).arrayBuffer());
}

async function save(directory, name, bytes) {
  await mkdir(directory, { recursive: true });
  await writeFile(new URL(name, directory), bytes);
  console.log(`${name.padEnd(30)} ${(bytes.length / 1024).toFixed(1)} KiB`);
}

for (const { family, file, weights } of FONTS) {
  for (const weight of weights) {
    const bytes = await download(family, weight, { asBrowser: true });
    await save(OUT_DIR, `${file}-${weight}.woff2`, bytes);
  }
}

for (const { family, file, weight } of OG_FONTS) {
  const bytes = await download(family, weight, { asBrowser: false });
  await save(new URL("og/", OUT_DIR), `${file}-${weight}.ttf`, bytes);
}
