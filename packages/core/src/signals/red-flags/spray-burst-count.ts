import type { Signal } from "../types"

export const sprayBurstCount: Signal<number> = {
  id: "sprayBurstCount",
  name: "Spray Burst Count",
  category: "redFlags",
  type: "number",
  description: "Max PRs created in any 1-hour window",
  requiresEnrichment: true,
  resolve: ({ enrichment }) =>
    enrichment?.prTemporalData?.maxPrsInOneHourWindow ?? 0,
}
