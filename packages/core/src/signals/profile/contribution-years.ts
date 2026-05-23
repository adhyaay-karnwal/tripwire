import type { Signal } from "../types"

export const contributionYears: Signal<number> = {
  id: "contributionYears",
  name: "Contribution Years",
  category: "profile",
  type: "number",
  description: "Number of years with contribution activity",
  requiresEnrichment: true,
  resolve: ({ enrichment }) =>
    enrichment?.graphql?.contributionYears.length ?? 0,
}
