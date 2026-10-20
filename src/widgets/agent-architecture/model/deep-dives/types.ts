/**
 * The engineering story behind one box of the diagram: how it works, and how
 * it holds up when someone tries to get around it. Every point describes code
 * that exists; numbers come from the same config the server enforces.
 */
export type DeepDive = {
  summary: string;
  sections: readonly { heading: string; points: readonly string[] }[];
  /** Attempts to get around this part, and what actually happens. */
  bypass?: readonly {
    attempt: string;
    outcome: string;
    /** false when the honest answer is "partly": the limit is softened, not broken. */
    holds: boolean;
  }[];
  /** Where to read the code, relative to the repo root. */
  files: readonly string[];
};
