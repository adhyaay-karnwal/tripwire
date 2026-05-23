import type { Signal } from "../types"

export const contributionsLastYear: Signal<number> = {
  id: "contributionsLastYear",
  name: "Contributions Last Year",
  category: "contributions",
  type: "number",
  description: "Total contributions in the last year",
  requiresEnrichment: true,
  resolve: ({ enrichment }) => enrichment?.graphql?.contributionsLastYear ?? 0,
}
