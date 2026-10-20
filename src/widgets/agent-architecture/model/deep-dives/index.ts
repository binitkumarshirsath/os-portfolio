import type { ArchNodeId } from "../graph";
import { modelDives } from "./model";
import { outputDives } from "./output";
import { requestDives } from "./request";
import type { DeepDive } from "./types";

export type { DeepDive } from "./types";

/** One deep dive per box; the Record type makes a missing one a compile error. */
export const deepDives: Record<ArchNodeId, DeepDive> = {
  ...requestDives,
  ...modelDives,
  ...outputDives,
};
