/** 640 ms, 1.6 s: milliseconds until a second, then one decimal. */
export function formatDuration(ms: number): string {
  return ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(1)} s`;
}

const compact = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** 80, 5.7K: compact from a thousand up, as stat tiles read best. */
export function formatCount(value: number): string {
  return compact.format(value);
}

/** "openai/gpt-oss-120b" → "gpt-oss-120b": the provider prefix is noise in a narrow row. */
export function shortModelName(modelId: string): string {
  return modelId.split("/").at(-1) ?? modelId;
}
