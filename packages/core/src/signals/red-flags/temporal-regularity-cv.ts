import type { Signal } from "../types"

export const temporalRegularityCV: Signal<number> = {
  id: "temporalRegularityCV",
  name: "Temporal Regularity CV",
  category: "redFlags",
  type: "number",
  description:
    "Coefficient of variation of PR creation intervals (lower = more mechanical)",
  requiresEnrichment: true,
  resolve: ({ enrichment }) => {
    const td = enrichment?.prTemporalData
    if (!td || td.creationIntervals.length < 2) return 0
    const intervals = td.creationIntervals
    const mean = intervals.reduce((s, v) => s + v, 0) / intervals.length
    if (mean === 0) return 0
    const variance =
      intervals.reduce((s, v) => s + (v - mean) ** 2, 0) / intervals.length
    return Math.sqrt(variance) / mean
  },
}
