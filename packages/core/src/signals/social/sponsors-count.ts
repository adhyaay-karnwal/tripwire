import type { Signal } from "../types"

export const sponsorsCount: Signal<number> = {
  id: "sponsorsCount",
  name: "Sponsors Count",
  category: "social",
  type: "number",
  description: "Number of sponsors",
  requiresEnrichment: true,
  resolve: ({ enrichment }) => enrichment?.graphql?.sponsorsCount ?? 0,
}
