import type { Signal } from "../types"

export const autoMergeFarmMedianTime: Signal<number> = {
  id: "autoMergeFarmMedianTime",
  name: "Auto-Merge Farm Median Time",
  category: "redFlags",
  type: "number",
  description: "Median time-to-merge in minutes across recent PRs",
  requiresEnrichment: true,
  resolve: ({ enrichment }) => {
    const td = enrichment?.prTemporalData
    if (!td || td.timeToMerge.length === 0) return 0
    const sorted = [...td.timeToMerge].sort((a, b) => a - b)
    return sorted[Math.floor(sorted.length / 2)] / 60
  },
}
