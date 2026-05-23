import type { Signal } from "../types"

export const sponsoringCount: Signal<number> = {
  id: "sponsoringCount",
  name: "Sponsoring Count",
  category: "social",
  type: "number",
  description: "Number of users being sponsored",
  requiresEnrichment: true,
  resolve: ({ enrichment }) => enrichment?.graphql?.sponsoringCount ?? 0,
}
